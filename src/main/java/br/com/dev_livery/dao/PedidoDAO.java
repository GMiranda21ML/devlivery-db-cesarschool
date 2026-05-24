package br.com.dev_livery.dao;

import br.com.dev_livery.dto.PedidoDTO;
import br.com.dev_livery.dto.PedidoItemDTO;
import br.com.dev_livery.dto.PedidoResponseDTO;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.sql.CallableStatement;

@Repository
public class PedidoDAO {

    private final DataSource dataSource;

    public PedidoDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void inserir(PedidoDTO pedido) throws SQLException {
        String sqlPedido = "INSERT INTO PEDIDO (CD_PEDIDO, VALOR_TOTAL, STATUS, DATA, CD_RESTAURANTE, CPF_CLIENTE) VALUES (?, ?, 'Pendente', CURDATE(), ?, ?)";

        // CORREÇÃO BÔNUS: Adicionado QUANTIDADE e o terceiro '?' para bater com os 3 setInt abaixo
        String sqlContem = "INSERT INTO CONTEM (CD_PEDIDO, CD_PRODUTO, QUANTIDADE) VALUES (?, ?, ?)";
        String sqlGetValor = "SELECT PRECO FROM PRODUTO WHERE CD_PRODUTO = ?";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);

            try {
                int nextCdPedido = getNextCdPedido(conn);

                double valorTotal = 0.0;
                for (PedidoItemDTO item : pedido.items()) {
                    try (PreparedStatement stmtPreco = conn.prepareStatement(sqlGetValor)) {
                        stmtPreco.setInt(1, item.cdProduto());
                        try (ResultSet rs = stmtPreco.executeQuery()) {
                            if (rs.next()) {
                                valorTotal += rs.getDouble("PRECO") * item.quantidade();
                            }
                        }
                    }
                }

                try (PreparedStatement stmtPedido = conn.prepareStatement(sqlPedido)) {
                    stmtPedido.setInt(1, nextCdPedido);
                    stmtPedido.setDouble(2, valorTotal);
                    stmtPedido.setInt(3, pedido.cdRestaurante());
                    stmtPedido.setString(4, pedido.cpfCliente());
                    stmtPedido.executeUpdate();
                }

                try (PreparedStatement stmtContem = conn.prepareStatement(sqlContem)) {
                    for (PedidoItemDTO item : pedido.items()) {
                        stmtContem.setInt(1, nextCdPedido);
                        stmtContem.setInt(2, item.cdProduto());
                        stmtContem.setInt(3, item.quantidade());
                        stmtContem.addBatch();
                    }
                    stmtContem.executeBatch();
                }

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }

    private int getNextCdPedido(Connection conn) throws SQLException {
        String sql = "SELECT COALESCE(MAX(CD_PEDIDO), 0) + 1 AS NEXT_CD FROM PEDIDO";
        try (PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                return rs.getInt("NEXT_CD");
            }
        }
        return 1;
    }

    public List<PedidoResponseDTO> listarPedidosPendentesPorRestaurante(Integer cdRestaurante) throws SQLException {
        String sql = """
                SELECT CD_PEDIDO, VALOR_TOTAL, STATUS, DATA, CD_RESTAURANTE, CPF_CLIENTE
                FROM PEDIDO
                WHERE CD_RESTAURANTE = ? AND STATUS = 'Pendente';
                """;
        List<PedidoResponseDTO> pedidos = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdRestaurante);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    pedidos.add(new PedidoResponseDTO(
                            rs.getInt("CD_PEDIDO"),
                            rs.getDouble("VALOR_TOTAL"),
                            rs.getString("STATUS"),
                            rs.getString("DATA"),
                            rs.getInt("CD_RESTAURANTE"),
                            rs.getString("CPF_CLIENTE")
                    ));
                }
            }
        }
        return pedidos;
    }

    public Double calcularFaturamentoPorRestaurante(Integer cdRestaurante) throws SQLException {
        String sql = """
                SELECT COALESCE(SUM(VALOR_TOTAL), 0.0) AS FATURAMENTO
                FROM PEDIDO
                WHERE CD_RESTAURANTE = ? AND STATUS = 'Concluido';
                """;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdRestaurante);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getDouble("FATURAMENTO");
                }
            }
        }
        return 0.0;
    }

    // CORREÇÃO 2: Mantivemos APENAS a versão que chama a sua Procedure!
    public void atualizarStatusPedido(Integer cdPedido, String novoStatus) throws SQLException {
        String sql = "{call atualizar_status_pedido(?, ?)}";

        try (Connection conn = dataSource.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {

            stmt.setInt(1, cdPedido);
            stmt.setString(2, novoStatus);
            stmt.execute();
        }
    } // CORREÇÃO 1: Chave de fechamento do método adicionada aqui!

    public Double simularDescontoCupom(Double valorPedido, String tipoCupom, Double valorDesconto) throws SQLException {
        String sql = "SELECT calcular_desconto_cupom(?, ?, ?) AS VALOR_FINAL";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setDouble(1, valorPedido);
            stmt.setString(2, tipoCupom);
            stmt.setDouble(3, valorDesconto);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getDouble("VALOR_FINAL");
                }
            }
        }
        return valorPedido;
    }
}