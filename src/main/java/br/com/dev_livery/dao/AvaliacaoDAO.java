package br.com.dev_livery.dao;

import br.com.dev_livery.dto.AvaliacaoDTO;
import br.com.dev_livery.dto.LogPedidoDTO;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AvaliacaoDAO {

    private final DataSource dataSource;

    public AvaliacaoDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // ---------------------------------------------------------------
    // Insere uma avaliação → dispara trg_atualizar_nota_entregador
    // ---------------------------------------------------------------
    public void inserir(AvaliacaoDTO dto) throws SQLException {
        String sqlNextId = "SELECT COALESCE(MAX(CD_AVALIACAO), 0) + 1 AS NEXT_ID FROM AVALIA";
        String sqlInsert = """
                INSERT INTO AVALIA (CD_AVALIACAO, CPF_CLIENTE, CD_PEDIDO, CD_PRODUTO, NOTA, COMENTARIO, DATA)
                VALUES (?, ?, ?, ?, ?, ?, CURDATE())
                """;

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                int nextId;
                try (PreparedStatement stmtId = conn.prepareStatement(sqlNextId);
                     ResultSet rs = stmtId.executeQuery()) {
                    nextId = rs.next() ? rs.getInt("NEXT_ID") : 1;
                }

                try (PreparedStatement stmt = conn.prepareStatement(sqlInsert)) {
                    stmt.setInt(1, nextId);
                    stmt.setString(2, dto.cpfCliente());
                    stmt.setInt(3, dto.cdPedido());
                    stmt.setInt(4, dto.cdProduto());
                    stmt.setFloat(5, dto.nota());
                    stmt.setString(6, dto.comentario());
                    stmt.executeUpdate();
                }

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }

    // ---------------------------------------------------------------
    // Lista todos os produtos de um pedido concluído (para o cliente
    // poder escolher qual produto avaliar)
    // ---------------------------------------------------------------
    public List<java.util.Map<String, Object>> listarProdutosDoPedido(Integer cdPedido) throws SQLException {
        String sql = """
                SELECT c.CD_PRODUTO, p.NOME, c.QUANTIDADE
                FROM CONTEM c
                JOIN PRODUTO p ON c.CD_PRODUTO = p.CD_PRODUTO
                WHERE c.CD_PEDIDO = ?
                """;

        List<java.util.Map<String, Object>> result = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdPedido);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    java.util.Map<String, Object> row = new java.util.LinkedHashMap<>();
                    row.put("cdProduto", rs.getInt("CD_PRODUTO"));
                    row.put("nome", rs.getString("NOME"));
                    row.put("quantidade", rs.getInt("QUANTIDADE"));
                    result.add(row);
                }
            }
        }
        return result;
    }

    // ---------------------------------------------------------------
    // Verifica se o cliente já avaliou determinado produto do pedido
    // ---------------------------------------------------------------
    public boolean jaAvaliou(String cpfCliente, Integer cdPedido, Integer cdProduto) throws SQLException {
        String sql = "SELECT 1 FROM AVALIA WHERE CPF_CLIENTE = ? AND CD_PEDIDO = ? AND CD_PRODUTO = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, cpfCliente);
            stmt.setInt(2, cdPedido);
            stmt.setInt(3, cdProduto);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    // ---------------------------------------------------------------
    // Lista todos os registros de LOG_PEDIDOS (efeito do trigger)
    // ---------------------------------------------------------------
    public List<LogPedidoDTO> listarLogs() throws SQLException {
        String sql = """
                SELECT CD_LOG, CD_PEDIDO, CPF_CLIENTE, VALOR_TOTAL, DATA_HORA, OPERACAO
                FROM LOG_PEDIDOS
                ORDER BY CD_LOG DESC
                """;

        List<LogPedidoDTO> logs = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                logs.add(new LogPedidoDTO(
                        rs.getInt("CD_LOG"),
                        rs.getInt("CD_PEDIDO"),
                        rs.getString("CPF_CLIENTE"),
                        rs.getDouble("VALOR_TOTAL"),
                        rs.getString("DATA_HORA"),
                        rs.getString("OPERACAO")
                ));
            }
        }
        return logs;
    }
}