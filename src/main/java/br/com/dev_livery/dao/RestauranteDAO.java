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
import java.util.Map;

@Repository
public class RestauranteDAO {

    private final DataSource dataSource;

    public RestauranteDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Long salvar(RestauranteDTO dto) throws SQLException {
        String sqlRest = "INSERT INTO RESTAURANTE (CNPJ, CPF_PARCEIRO, NOME, TELEFONE_RESTAURANTE, CEP, RUA, NUMERO, BAIRRO, CIDADE, TEMPO_ENTREGA) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String sqlPertence = "INSERT INTO PERTENCE (CD_RESTAURANTE, CD_CATEGORIA) VALUES (?, ?)";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                Long cdRestaurante;
                try (PreparedStatement ps = conn.prepareStatement(sqlRest, Statement.RETURN_GENERATED_KEYS)) {
                    ps.setString(1, dto.cnpj());
                    ps.setString(2, dto.cpf());
                    ps.setString(3, dto.nome());
                    ps.setString(4, dto.telefoneRestaurante());
                    ps.setString(5, dto.cep());
                    ps.setString(6, dto.rua());
                    ps.setString(7, dto.numero());
                    ps.setString(8, dto.bairro());
                    ps.setString(9, dto.cidade());
                    ps.setInt(10, dto.tempoEntrega() != null ? dto.tempoEntrega() : 30);
                    ps.executeUpdate();

                    ResultSet rs = ps.getGeneratedKeys();
                    if (!rs.next()) { conn.rollback(); return null; }
                    cdRestaurante = rs.getLong(1);
                }

                if (dto.cdCategoria() != null) {
                    try (PreparedStatement ps = conn.prepareStatement(sqlPertence)) {
                        ps.setLong(1, cdRestaurante);
                        ps.setInt(2, dto.cdCategoria());
                        ps.executeUpdate();
                    }
                }

                conn.commit();
                return cdRestaurante;
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }

    public void atualizar(Integer cdRestaurante, Map<String, Object> campos) throws SQLException {
        if (campos.isEmpty()) return;

        StringBuilder sql = new StringBuilder("UPDATE RESTAURANTE SET ");
        List<Object> valores = new ArrayList<>();

        if (campos.containsKey("nome")) {
            sql.append("NOME = ?, "); valores.add(campos.get("nome"));
        }
        if (campos.containsKey("telefoneRestaurante")) {
            sql.append("TELEFONE_RESTAURANTE = ?, "); valores.add(campos.get("telefoneRestaurante"));
        }
        if (campos.containsKey("tempoEntrega")) {
            sql.append("TEMPO_ENTREGA = ?, "); valores.add(campos.get("tempoEntrega"));
        }

        // Remove última vírgula
        sql.setLength(sql.length() - 2);
        sql.append(" WHERE CD_RESTAURANTE = ?");
        valores.add(cdRestaurante);

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < valores.size(); i++) {
                ps.setObject(i + 1, valores.get(i));
            }
            ps.executeUpdate();
        }

        // Atualiza categoria se fornecida
        if (campos.containsKey("cdCategoria")) {
            String sqlDel = "DELETE FROM PERTENCE WHERE CD_RESTAURANTE = ?";
            String sqlIns = "INSERT INTO PERTENCE (CD_RESTAURANTE, CD_CATEGORIA) VALUES (?, ?)";
            try (Connection conn = dataSource.getConnection()) {
                try (PreparedStatement ps = conn.prepareStatement(sqlDel)) {
                    ps.setInt(1, cdRestaurante); ps.executeUpdate();
                }
                try (PreparedStatement ps = conn.prepareStatement(sqlIns)) {
                    ps.setInt(1, cdRestaurante);
                    ps.setObject(2, campos.get("cdCategoria"));
                    ps.executeUpdate();
                }
            }
        }
    }

    public void atualizarNomeImagem(Long cdRestaurante, String nomeImagem) throws SQLException {
        String sql = "UPDATE RESTAURANTE SET NOME_IMAGEM = ? WHERE CD_RESTAURANTE = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, nomeImagem);
            ps.setLong(2, cdRestaurante);
            ps.executeUpdate();
        }
    }

    public RestauranteResponseDTO buscarPorCpf(String cpfParceiro) throws SQLException {
        String sql = """
                SELECT
                    R.NOME, U.EMAIL, U.CPF,
                    R.CD_RESTAURANTE, R.CNPJ, R.NUMERO, R.CEP, R.BAIRRO, R.RUA, R.CIDADE,
                    R.TELEFONE_RESTAURANTE AS telefoneRestaurante,
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA, R.NOME_IMAGEM
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

    public List<RestauranteResponseDTO> listarPorParceiro(String cpfParceiro) throws SQLException {
        String sql = """
                SELECT
                    R.NOME, U.EMAIL, U.CPF,
                    R.CD_RESTAURANTE, R.CNPJ, R.NUMERO, R.CEP, R.BAIRRO, R.RUA, R.CIDADE,
                    R.TELEFONE_RESTAURANTE AS telefoneRestaurante,
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA, R.NOME_IMAGEM
                FROM USUARIO U
                INNER JOIN RESTAURANTE R ON U.CPF = R.CPF_PARCEIRO
                WHERE U.CPF = ?
                """;

        List<RestauranteResponseDTO> restaurantes = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, cpfParceiro);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    restaurantes.add(mapearRestaurante(rs));
                }
            }
        }
        return restaurantes;
    }

    public RestauranteResponseDTO buscarPorCd(Integer cdRestaurante) throws SQLException {
        String sql = """
                SELECT
                    R.NOME, U.EMAIL, U.CPF,
                    R.CD_RESTAURANTE, R.CNPJ, R.NUMERO, R.CEP, R.BAIRRO, R.RUA, R.CIDADE,
                    R.TELEFONE_RESTAURANTE AS telefoneRestaurante,
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA, R.NOME_IMAGEM
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
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA, R.NOME_IMAGEM
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
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA, R.NOME_IMAGEM
                FROM USUARIO U
                INNER JOIN RESTAURANTE R ON U.CPF = R.CPF_PARCEIRO
                INNER JOIN PRODUTO P ON R.CD_RESTAURANTE = P.CD_RESTAURANTE
                GROUP BY
                    R.CD_RESTAURANTE, U.CPF, R.NOME, U.EMAIL,
                    R.TELEFONE_RESTAURANTE, R.CNPJ, R.NUMERO, R.CEP, R.BAIRRO, R.RUA, R.CIDADE,
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA, R.NOME_IMAGEM
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
                tempo,
                rs.getString("NOME_IMAGEM")

        );
    }

    public List<RestauranteResponseDTO> listarPorCategoria(String nomeCategoria) throws SQLException {
        String sql = """
                SELECT
                    R.NOME, U.EMAIL, U.CPF,
                    R.CD_RESTAURANTE, R.CNPJ, R.NUMERO, R.CEP, R.BAIRRO, R.RUA, R.CIDADE,
                    R.TELEFONE_RESTAURANTE AS telefoneRestaurante,
                    R.NOTA, R.TAXA_ENTREGA, R.TEMPO_ENTREGA, R.NOME_IMAGEM
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

    public void excluir(Integer cdRestaurante) throws SQLException {
        String sqlPertence = "DELETE FROM PERTENCE WHERE CD_RESTAURANTE = ?";
        String sqlProduto = "DELETE FROM PRODUTO WHERE CD_RESTAURANTE = ?";
        String sqlRestaurante = "DELETE FROM RESTAURANTE WHERE CD_RESTAURANTE = ?";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false); // Inicia uma transação segura
            try {
                try (PreparedStatement ps = conn.prepareStatement(sqlPertence)) {
                    ps.setInt(1, cdRestaurante);
                    ps.executeUpdate();
                }

                try (PreparedStatement ps = conn.prepareStatement(sqlProduto)) {
                    ps.setInt(1, cdRestaurante);
                    ps.executeUpdate();
                }

                try (PreparedStatement ps = conn.prepareStatement(sqlRestaurante)) {
                    ps.setInt(1, cdRestaurante);
                    ps.executeUpdate();
                }

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e; // Lança o erro para o Controller avisar o usuário
            }
        }
    }
}