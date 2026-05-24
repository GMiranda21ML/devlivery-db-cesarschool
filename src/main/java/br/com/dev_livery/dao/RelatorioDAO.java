package br.com.dev_livery.dao;

import br.com.dev_livery.dto.FaturamentoDTO;
import br.com.dev_livery.dto.ClienteInativoDTO;
import br.com.dev_livery.dto.ProdutoPremiumDTO;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public class RelatorioDAO {

    private final DataSource dataSource;

    public RelatorioDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // Executa a VIEW 1 (Faturamento)
    public List<FaturamentoDTO> listarFaturamento() throws SQLException {
        String sql = "SELECT * FROM VIEW_FATURAMENTO_PEDIDOS_CONCLUIDOS";
        List<FaturamentoDTO> lista = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(new FaturamentoDTO(
                        rs.getInt("CD_PEDIDO"),
                        rs.getString("RESTAURANTE"),
                        rs.getString("CLIENTE"),
                        rs.getString("FORMA_PAGAMENTO"),
                        rs.getDouble("VALOR_PAGO"),
                        rs.getTimestamp("DATA_HORA").toLocalDateTime()
                ));
            }
        }
        return lista;
    }

    // Executa a Consulta 3 (Anti-Join - Clientes sem pedido)
    public List<ClienteInativoDTO> listarClientesInativos() throws SQLException {
        String sql = """
            SELECT u.NOME, u.EMAIL
            FROM CLIENTE c
            JOIN USUARIO u ON c.CPF = u.CPF
            LEFT JOIN PEDIDO p ON c.CPF = p.CPF_CLIENTE
            WHERE p.CD_PEDIDO IS NULL
        """;

        List<ClienteInativoDTO> lista = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                lista.add(new ClienteInativoDTO(
                        rs.getString("NOME"),
                        rs.getString("EMAIL")
                ));
            }
        }
        return lista;
    }

    public List<String> listarSuperRestaurantes() throws SQLException {
        String sql = """
        SELECT 
            r.NOME
        FROM 
            RESTAURANTE r 
        JOIN 
            PRODUTO p ON r.CD_RESTAURANTE = p.CD_RESTAURANTE 
        GROUP BY 
            r.NOME 
        HAVING 
            AVG(p.NOTA) > 4.0
    """;

        List<String> nomes = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                nomes.add(rs.getString("NOME"));
            }
        }
        return nomes;
    }

    // NOVO: Executa a Consulta 4 (Produtos Premium - SUBCONSULTA)
    public List<ProdutoPremiumDTO> listarProdutosPremium() throws SQLException {
        String sql = """
            SELECT 
                NOME, 
                PRECO
            FROM 
                PRODUTO
            WHERE 
                PRECO > (SELECT AVG(PRECO) FROM PRODUTO)
        """;

        List<ProdutoPremiumDTO> produtos = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                produtos.add(new ProdutoPremiumDTO(
                        rs.getString("NOME"),
                        rs.getDouble("PRECO")
                ));
            }
        }
        return produtos;
    }
}