
package br.com.dev_livery.dao;

import br.com.dev_livery.dto.PedidoDTO;
import br.com.dev_livery.dto.PedidoItemDTO;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PedidoDAO {

    private final DataSource dataSource;

    public PedidoDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void inserir(PedidoDTO pedido) throws SQLException {

        String sqlPedido = "INSERT INTO PEDIDO (CD_PEDIDO, VALOR_TOTAL, STATUS, DATA, CD_RESTAURANTE, CPF_CLIENTE) VALUES (?, ?, 'Pendente', CURDATE(), ?, ?)";
        String sqlContem = "INSERT INTO CONTEM (CD_PEDIDO, CD_PRODUTO) VALUES (?, ?)";
        String sqlGetValor = "SELECT PRECO FROM PRODUTO WHERE CD_PRODUTO = ?";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);

            try {
                // Get next CD_PEDIDO
                int nextCdPedido = getNextCdPedido(conn);

                // Calculate total value
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

                // Insert pedido
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
                        stmtContem.setInt(3, item.quantidade()); // Passa a quantidade direto para o banco
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

    public void atualizarStatusPedido(Integer cdPedido, String status) throws SQLException {
        String sql = "UPDATE PEDIDO SET STATUS = ? WHERE CD_PEDIDO = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, cdPedido);
            stmt.executeUpdate();
        }
    }

    public record PedidoResponseDTO(
            Integer cdPedido,
            Double valorTotal,
            String status,
            String data,
            Integer cdRestaurante,
            String cpfCliente
    ) {}
}
