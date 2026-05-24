package br.com.dev_livery.dao;

import br.com.dev_livery.dto.RestauranteDTO;
import br.com.dev_livery.dto.RestauranteResponseDTO;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.sql.CallableStatement;

@Repository
public class RestauranteDAO {

    private final DataSource dataSource;

    public RestauranteDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Long salvar(RestauranteDTO dto) throws SQLException {
        String sql = "INSERT INTO RESTAURANTE (CNPJ, CPF_PARCEIRO, NOME, TELEFONE_RESTAURANTE, CEP, RUA, NUMERO, BAIRRO, CIDADE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, dto.cnpj());
            ps.setString(2, dto.cpf());
            ps.setString(3, dto.nome());
            ps.setString(4, dto.telefoneRestaurante());
            ps.setString(5, dto.cep());
            ps.setString(6, dto.rua());
            ps.setString(7, dto.numero());
            ps.setString(8, dto.bairro());
            ps.setString(9, dto.cidade());

            ps.executeUpdate();

            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next()) {
                return rs.getLong(1);
            }
            return null;
        }
    }

    public RestauranteResponseDTO buscarPorCpf(String cpfParceiro) throws SQLException {
        String sql = """
                SELECT
                    R.NOME, U.EMAIL, U.CPF,
                    R.CD_RESTAURANTE, R.CNPJ, R.NUMERO, R.CEP, R.BAIRRO, R.RUA, R.CIDADE,
                    R.TELEFONE_RESTAURANTE AS telefoneRestaurante,
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA
                FROM USUARIO U
                INNER JOIN RESTAURANTE R ON U.CPF = R.CPF_PARCEIRO
                WHERE U.CPF = ?
                """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, cpfParceiro);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapearRestaurante(rs);
                }
            }
        }
        return null;
    }

    public RestauranteResponseDTO buscarPorCd(Integer cdRestaurante) throws SQLException {
        String sql = """
                SELECT
                    R.NOME, U.EMAIL, U.CPF,
                    R.CD_RESTAURANTE, R.CNPJ, R.NUMERO, R.CEP, R.BAIRRO, R.RUA, R.CIDADE,
                    R.TELEFONE_RESTAURANTE AS telefoneRestaurante,
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA
                FROM USUARIO U
                INNER JOIN RESTAURANTE R ON U.CPF = R.CPF_PARCEIRO
                WHERE R.CD_RESTAURANTE = ?
                """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cdRestaurante);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapearRestaurante(rs);
                }
            }
        }
        return null;
    }

    public List<RestauranteResponseDTO> listarTodos() throws SQLException {
        String sql = """
                SELECT
                    R.NOME, U.EMAIL, U.CPF,
                    R.CD_RESTAURANTE, R.CNPJ, R.NUMERO, R.CEP, R.BAIRRO, R.RUA, R.CIDADE,
                    R.TELEFONE_RESTAURANTE AS telefoneRestaurante,
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA
                FROM USUARIO U
                INNER JOIN RESTAURANTE R ON U.CPF = R.CPF_PARCEIRO
                """;

        List<RestauranteResponseDTO> restaurantes = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                restaurantes.add(mapearRestaurante(rs));
            }
        }
        return restaurantes;
    }

    public List<RestauranteResponseDTO> listarMelhoresAvaliados() throws SQLException {
        String sql = """
                SELECT
                    R.CD_RESTAURANTE, U.CPF, R.NOME, U.EMAIL,
                    R.TELEFONE_RESTAURANTE AS telefoneRestaurante,
                    R.CNPJ, R.NUMERO, R.CEP, R.BAIRRO, R.RUA, R.CIDADE,
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA
                FROM USUARIO U
                INNER JOIN RESTAURANTE R ON U.CPF = R.CPF_PARCEIRO
                INNER JOIN PRODUTO P ON R.CD_RESTAURANTE = P.CD_RESTAURANTE
                GROUP BY
                    R.CD_RESTAURANTE, U.CPF, R.NOME, U.EMAIL,
                    R.TELEFONE_RESTAURANTE, R.CNPJ, R.NUMERO, R.CEP, R.BAIRRO, R.RUA, R.CIDADE,
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA
                HAVING AVG(P.NOTA) > 4.0
                """;
        List<RestauranteResponseDTO> restaurantes = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                restaurantes.add(mapearRestaurante(rs));
            }
        }
        return restaurantes;
    }

    private RestauranteResponseDTO mapearRestaurante(ResultSet rs) throws SQLException {
        Double nota = rs.getObject("NOTA") != null ? rs.getDouble("NOTA") : 5.0;
        Double taxa = rs.getObject("TAXA_ENTREGA") != null ? rs.getDouble("TAXA_ENTREGA") : 0.0;
        Integer tempo = rs.getObject("TEMPO_ENTREGA") != null ? rs.getInt("TEMPO_ENTREGA") : 30;

        return new RestauranteResponseDTO(
                rs.getInt("CD_RESTAURANTE"),
                rs.getString("CPF"),
                rs.getString("NOME"),
                rs.getString("EMAIL"),
                rs.getString("telefoneRestaurante"),
                rs.getString("CNPJ"),
                rs.getString("NUMERO"),
                rs.getString("CEP"),
                rs.getString("BAIRRO"),
                rs.getString("RUA"),
                rs.getString("CIDADE"),
                nota,
                taxa,
                tempo
        );
    }

    public List<RestauranteResponseDTO> listarPorCategoria(String nomeCategoria) throws SQLException {
        String sql = """
                SELECT
                    R.NOME, U.EMAIL, U.CPF,
                    R.CD_RESTAURANTE, R.CNPJ, R.NUMERO, R.CEP, R.BAIRRO, R.RUA, R.CIDADE,
                    R.TELEFONE_RESTAURANTE AS telefoneRestaurante,
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA
                FROM USUARIO U
                INNER JOIN RESTAURANTE R ON U.CPF = R.CPF_PARCEIRO
                INNER JOIN PERTENCE P ON R.CD_RESTAURANTE = P.CD_RESTAURANTE
                INNER JOIN CATEGORIA C ON P.CD_CATEGORIA = C.CD_CATEGORIA
                WHERE C.NOME = ?
                """;

        List<RestauranteResponseDTO> restaurantes = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, nomeCategoria);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    restaurantes.add(mapearRestaurante(rs));
                }
            }
        }
        return restaurantes;
    }

    public void recalcularNotasProdutos(Integer cdRestaurante) throws SQLException {
        String sql = "{call recalcular_nota_produtos_restaurante(?)}";

        try (Connection conn = dataSource.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {

            stmt.setInt(1, cdRestaurante);
            stmt.execute();
        }
    }
}