
package br.com.dev_livery.dao;

import br.com.dev_livery.dto.ParceiroDTO;
import br.com.dev_livery.dto.ParceiroResponseDTO;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class ParceiroDAO {

    private final DataSource dataSource;

    public ParceiroDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void inserir(String cpf, String nome, String email, String senhaHash, String telefone) throws SQLException {

        String sqlUsuario = "INSERT INTO USUARIO (CPF, NOME, EMAIL, SENHA) VALUES (?, ?, ?, ?)";
        String sqlTelefone = "INSERT INTO TELEFONE (CPF, NUMERO) VALUES (?, ?)";
        String sqlParceiro = "INSERT INTO PARCEIRO (CPF) VALUES (?)";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);

            try (PreparedStatement usuario = conn.prepareStatement(sqlUsuario);
                 PreparedStatement numTelefone = conn.prepareStatement(sqlTelefone);
                 PreparedStatement parceiro = conn.prepareStatement(sqlParceiro)) {

                usuario.setString(1, cpf);
                usuario.setString(2, nome);
                usuario.setString(3, email);
                usuario.setString(4, senhaHash);
                usuario.executeUpdate();

                numTelefone.setString(1, cpf);
                numTelefone.setString(2, telefone);
                numTelefone.executeUpdate();

                parceiro.setString(1, cpf);
                parceiro.executeUpdate();

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }

    public ParceiroResponseDTO buscarPorCpf(String cpf) throws SQLException {
        String sql = """
                SELECT
                	U.NOME, U.EMAIL, U.CPF,
                	T.NUMERO AS TELEFONE
                FROM USUARIO U
                INNER JOIN PARCEIRO P ON U.CPF = P.CPF
                INNER JOIN TELEFONE T ON U.CPF = T.CPF
                WHERE U.CPF = ?;
                """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, cpf);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new ParceiroResponseDTO(
                            rs.getString("CPF"),
                            rs.getString("NOME"),
                            rs.getString("EMAIL"),
                            rs.getString("TELEFONE")
                    );
                }
            }
        }
        return null;
    }

    public void atualizar(ParceiroDTO dto) throws SQLException {
        String sqlUsuario = "UPDATE USUARIO SET NOME = ?, EMAIL = ? WHERE CPF = ?";
        String sqlDelTelefone = "DELETE FROM TELEFONE WHERE CPF = ?";
        String sqlInsTelefone = "INSERT INTO TELEFONE (CPF, NUMERO) VALUES (?, ?)";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement stmtU = conn.prepareStatement(sqlUsuario);
                 PreparedStatement stmtDelT = conn.prepareStatement(sqlDelTelefone);
                 PreparedStatement stmtInsT = conn.prepareStatement(sqlInsTelefone)) {

                stmtU.setString(1, dto.nome());
                stmtU.setString(2, dto.email());
                stmtU.setString(3, dto.cpf());
                stmtU.executeUpdate();

                stmtDelT.setString(1, dto.cpf());
                stmtDelT.executeUpdate();

                if (dto.telefone() != null && !dto.telefone().isBlank()) {
                    stmtInsT.setString(1, dto.cpf());
                    stmtInsT.setString(2, dto.telefone());
                    stmtInsT.executeUpdate();
                }

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }

    public void deletar(String cpf) throws SQLException {
        String sqlTelefone = "DELETE FROM TELEFONE WHERE CPF = ?";
        String sqlParceiro = "DELETE FROM PARCEIRO WHERE CPF = ?";
        String sqlUsuario = "DELETE FROM USUARIO WHERE CPF = ?";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement stmtTel = conn.prepareStatement(sqlTelefone);
                 PreparedStatement stmtParc = conn.prepareStatement(sqlParceiro);
                 PreparedStatement stmtUsu = conn.prepareStatement(sqlUsuario)) {

                stmtTel.setString(1, cpf);
                stmtTel.executeUpdate();

                stmtParc.setString(1, cpf);
                stmtParc.executeUpdate();

                stmtUsu.setString(1, cpf);
                stmtUsu.executeUpdate();

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }
}
