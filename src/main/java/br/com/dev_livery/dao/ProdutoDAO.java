
package br.com.dev_livery.dao;

import br.com.dev_livery.dto.ProdutoResponseDTO;
import br.com.dev_livery.dto.ProdutoDTO;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProdutoDAO {

    private final DataSource dataSource;

    public ProdutoDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<ProdutoResponseDTO> listarPorRestaurante(Integer cdRestaurante) throws SQLException {
        String sql = """
                SELECT CD_PRODUTO, NOME, DESCRICAO, NOTA, PRECO, CD_RESTAURANTE, NOME_IMAGEM
                FROM PRODUTO
                WHERE CD_RESTAURANTE = ?;
                """;
        List<ProdutoResponseDTO> produtos = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdRestaurante);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    produtos.add(new ProdutoResponseDTO(
                            rs.getInt("CD_PRODUTO"),
                            rs.getString("NOME"),
                            rs.getString("DESCRICAO"),
                            rs.getDouble("NOTA"),
                            rs.getDouble("PRECO"),
                            rs.getInt("CD_RESTAURANTE"),
                            rs.getString("NOME_IMAGEM")
                    ));
                }
            }
        }
        return produtos;
    }

    public ProdutoResponseDTO buscarPorId(Integer cdProduto) throws SQLException {
        String sql = """
                SELECT CD_PRODUTO, NOME, DESCRICAO, NOTA, PRECO, CD_RESTAURANTE, NOME_IMAGEM
                FROM PRODUTO
                WHERE CD_PRODUTO = ?;
                """;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdProduto);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new ProdutoResponseDTO(
                            rs.getInt("CD_PRODUTO"),
                            rs.getString("NOME"),
                            rs.getString("DESCRICAO"),
                            rs.getDouble("NOTA"),
                            rs.getDouble("PRECO"),
                            rs.getInt("CD_RESTAURANTE"),
                            rs.getString("NOME_IMAGEM")
                    );
                }
            }
        }
        return null;
    }

    public Integer inserir(ProdutoDTO produto) throws SQLException {
        String sql = "INSERT INTO PRODUTO (NOME, DESCRICAO, NOTA, PRECO, CD_RESTAURANTE) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, java.sql.Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, produto.nome());
            stmt.setString(2, produto.descricao());
            stmt.setDouble(3, produto.nota() != null ? produto.nota() : 0.0);
            stmt.setDouble(4, produto.preco());
            stmt.setInt(5, produto.cdRestaurante());
            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        return null;
    }

    public void atualizar(Integer cdProduto, ProdutoDTO produto) throws SQLException {
        String sql = "UPDATE PRODUTO SET NOME = ?, DESCRICAO = ?, NOTA = ?, PRECO = ? WHERE CD_PRODUTO = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, produto.nome());
            stmt.setString(2, produto.descricao());
            stmt.setDouble(3, produto.nota() != null ? produto.nota() : 0.0);
            stmt.setDouble(4, produto.preco());
            stmt.setInt(5, cdProduto);
            stmt.executeUpdate();
        }
    }

    public void atualizarNomeImagem(Integer cdProduto, String nomeImagem) throws SQLException {
        String sql = "UPDATE PRODUTO SET NOME_IMAGEM = ? WHERE CD_PRODUTO = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, nomeImagem);
            ps.setInt(2, cdProduto);
            ps.executeUpdate();
        }
    }

    public void deletar(Integer cdProduto) throws SQLException {
        String sql = "DELETE FROM PRODUTO WHERE CD_PRODUTO = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdProduto);
            stmt.executeUpdate();
        }
    }
}
