package br.com.dev_livery.dao;

import br.com.dev_livery.dto.PedidoDTO;
import br.com.dev_livery.dto.PedidoItemDTO;
import br.com.dev_livery.dto.PedidoResponseDTO;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.*;
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

                String sqlPagamento = "INSERT INTO PAGAMENTO (CD_PAGAMENTO, CD_PEDIDO, TIPO, VALOR, DATA_HORA) VALUES (?, ?, ?, ?, NOW())";
                int nextCdPag;
                try (PreparedStatement stmtPagId = conn.prepareStatement("SELECT COALESCE(MAX(CD_PAGAMENTO), 0) + 1 AS NEXT_ID FROM PAGAMENTO");
                     ResultSet rsPag = stmtPagId.executeQuery()) {
                    nextCdPag = rsPag.next() ? rsPag.getInt("NEXT_ID") : 1;
                }
                try (PreparedStatement stmtPag = conn.prepareStatement(sqlPagamento)) {
                    stmtPag.setInt(1, nextCdPag);
                    stmtPag.setInt(2, nextCdPedido);
                    stmtPag.setString(3, "PIX");
                    stmtPag.setDouble(4, valorTotal);
                    stmtPag.executeUpdate();
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
            if (rs.next()) return rs.getInt("NEXT_CD");
        }
        return 1;
    }

    public List<PedidoResponseDTO> listarPedidosPorRestauranteEStatus(Integer cdRestaurante, String status) throws SQLException {
        String sql;
        if ("todos".equalsIgnoreCase(status)) {
            sql = "SELECT CD_PEDIDO, VALOR_TOTAL, STATUS, DATA, CD_RESTAURANTE, CPF_CLIENTE FROM PEDIDO WHERE CD_RESTAURANTE = ? ORDER BY CD_PEDIDO DESC";
        } else {
            sql = "SELECT CD_PEDIDO, VALOR_TOTAL, STATUS, DATA, CD_RESTAURANTE, CPF_CLIENTE FROM PEDIDO WHERE CD_RESTAURANTE = ? AND STATUS = ? ORDER BY CD_PEDIDO DESC";
        }

        List<PedidoResponseDTO> pedidos = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdRestaurante);
            if (!"todos".equalsIgnoreCase(status)) {
                stmt.setString(2, status);
            }
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    pedidos.add(mapRow(rs));
                }
            }
        }
        return pedidos;
    }

    public PedidoResponseDTO buscarPedidoPorId(Integer cdPedido) throws SQLException {
        String sql = "SELECT CD_PEDIDO, VALOR_TOTAL, STATUS, DATA, CD_RESTAURANTE, CPF_CLIENTE FROM PEDIDO WHERE CD_PEDIDO = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdPedido);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        }
        return null;
    }

    public boolean validarDonoRestaurante(Integer cdRestaurante, String cpfParceiro) throws SQLException {
        String sql = "SELECT 1 FROM RESTAURANTE WHERE CD_RESTAURANTE = ? AND CPF_PARCEIRO = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdRestaurante);
            stmt.setString(2, cpfParceiro);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    public boolean validarDonoPedido(Integer cdPedido, String cpfParceiro) throws SQLException {
        String sql = """
                SELECT 1 FROM PEDIDO p
                JOIN RESTAURANTE r ON p.CD_RESTAURANTE = r.CD_RESTAURANTE
                WHERE p.CD_PEDIDO = ? AND r.CPF_PARCEIRO = ?
                """;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdPedido);
            stmt.setString(2, cpfParceiro);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    public Double calcularFaturamentoPorRestaurante(Integer cdRestaurante) throws SQLException {
        String sql = """
               SELECT COALESCE(SUM(VALOR_PAGO), 0.0) AS FATURAMENTO
               FROM VIEW_FATURAMENTO_PEDIDOS_CONCLUIDOS
               WHERE CD_PEDIDO IN (
                   SELECT CD_PEDIDO FROM PEDIDO WHERE CD_RESTAURANTE = ?
               );
               """;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdRestaurante);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return rs.getDouble("FATURAMENTO");
            }
        }
        return 0.0;
    }

    // Chama a procedure atualizar_status_pedido definida no banco de dados.
    // A procedure faz o UPDATE no status E registra no HISTORICO_STATUS automaticamente.
    public void atualizarStatusPedido(Integer cdPedido, String novoStatus) throws SQLException {
        String sql = "{call atualizar_status_pedido(?, ?)}";

        try (Connection conn = dataSource.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {

            stmt.setInt(1, cdPedido);
            stmt.setString(2, novoStatus);
            stmt.execute();
        }
    }

    public Double simularDescontoCupom(Double valorPedido, String tipoCupom, Double valorDesconto) throws SQLException {
        String sql = "SELECT calcular_desconto_cupom(?, ?, ?) AS VALOR_FINAL";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setDouble(1, valorPedido);
            stmt.setString(2, tipoCupom);
            stmt.setDouble(3, valorDesconto);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return rs.getDouble("VALOR_FINAL");
            }
        }
        return valorPedido;
    }

    public List<PedidoResponseDTO> listarPedidosPorCliente(String cpf) throws SQLException {
        String sql = "SELECT CD_PEDIDO, VALOR_TOTAL, STATUS, DATA, CD_RESTAURANTE, CPF_CLIENTE FROM PEDIDO WHERE CPF_CLIENTE = ? ORDER BY CD_PEDIDO DESC";
        List<PedidoResponseDTO> pedidos = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, cpf);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    pedidos.add(mapRow(rs));
                }
            }
        }
        return pedidos;
    }

    public void confirmarEntrega(Integer cdPedido, String cpfEntregador) throws SQLException {
        String sqlUpdate = "UPDATE PEDIDO SET STATUS = 'Concluido', CPF_ENTREGADOR = ? WHERE CD_PEDIDO = ?";
        String sqlHistId = "SELECT COALESCE(MAX(CD_HISTORICO), 0) + 1 AS NEXT_ID FROM HISTORICO_STATUS";
        String sqlHist   = "INSERT INTO HISTORICO_STATUS (CD_HISTORICO, CD_PEDIDO, DESCRICAO, DATA_HORA) VALUES (?, ?, ?, NOW())";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                try (PreparedStatement stmtUpd = conn.prepareStatement(sqlUpdate)) {
                    stmtUpd.setString(1, cpfEntregador);
                    stmtUpd.setInt(2, cdPedido);
                    stmtUpd.executeUpdate();
                }
                int nextId = 1;
                try (PreparedStatement stmtId = conn.prepareStatement(sqlHistId);
                     ResultSet rs = stmtId.executeQuery()) {
                    if (rs.next()) nextId = rs.getInt("NEXT_ID");
                }
                try (PreparedStatement stmtHist = conn.prepareStatement(sqlHist)) {
                    stmtHist.setInt(1, nextId);
                    stmtHist.setInt(2, cdPedido);
                    stmtHist.setString(3, "Entrega confirmada pelo entregador: " + cpfEntregador);
                    stmtHist.executeUpdate();
                }
                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }

    public List<PedidoResponseDTO> listarPedidosParaEntrega() throws SQLException {
        String sql = "SELECT CD_PEDIDO, VALOR_TOTAL, STATUS, DATA, CD_RESTAURANTE, CPF_CLIENTE " +
                "FROM PEDIDO WHERE STATUS = 'Saiu para entrega' ORDER BY CD_PEDIDO ASC";
        List<PedidoResponseDTO> pedidos = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                pedidos.add(mapRow(rs));
            }
        }
        return pedidos;
    }

    private PedidoResponseDTO mapRow(ResultSet rs) throws SQLException {
        return new PedidoResponseDTO(
                rs.getInt("CD_PEDIDO"),
                rs.getDouble("VALOR_TOTAL"),
                rs.getString("STATUS"),
                rs.getString("DATA"),
                rs.getInt("CD_RESTAURANTE"),
                rs.getString("CPF_CLIENTE")
        );
    }
}