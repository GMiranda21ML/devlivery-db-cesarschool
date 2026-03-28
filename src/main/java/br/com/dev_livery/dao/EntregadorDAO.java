package br.com.dev_livery.dao;

import br.com.dev_livery.dto.EntregadorDTO;
import br.com.dev_livery.dto.EntregadorResponseDTO;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class EntregadorDAO {

    private final DataSource dataSource;

    public EntregadorDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void inserir(String cpf, String nome, String email, String senhaHash,
                        String telefone, String veiculo, String placa) throws SQLException {

        String sqlUsuario = "INSERT INTO USUARIO (CPF, NOME, EMAIL, SENHA) VALUES (?, ?, ?, ?)";
        String sqlTelefone = "INSERT INTO TELEFONE (CPF, NUMERO) VALUES (?, ?)";
        String sqlEntregador = "INSERT INTO ENTREGADOR (CPF, NOTA, VEICULO, PLACA) VALUES (?, ?, ?, ?)";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);

            try (PreparedStatement usuario = conn.prepareStatement(sqlUsuario);
                 PreparedStatement numTelefone = conn.prepareStatement(sqlTelefone);
                 PreparedStatement entregador = conn.prepareStatement(sqlEntregador)) {

                // 1. Tabela USUARIO
                usuario.setString(1, cpf);
                usuario.setString(2, nome);
                usuario.setString(3, email);
                usuario.setString(4, senhaHash);
                usuario.executeUpdate();

                // 2. Tabela TELEFONE
                numTelefone.setString(1, cpf);
                numTelefone.setString(2, telefone);
                numTelefone.executeUpdate();

                // 3. Tabela ENTREGADOR
                entregador.setString(1, cpf);
                entregador.setDouble(2, 5.0);
                entregador.setString(3, veiculo);
                entregador.setString(4, placa);
                entregador.executeUpdate();

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }

    public EntregadorResponseDTO buscarPorCpf(String cpf) throws SQLException {
        String sql = """
                SELECT
                	U.NOME, U.EMAIL, U.CPF,
                	E.NOTA, E.VEICULO, E.PLACA,
                	T.NUMERO AS TELEFONE
                FROM USUARIO U
                INNER JOIN ENTREGADOR E ON U.CPF = E.CPF
                INNER JOIN TELEFONE T ON U.CPF = T.CPF
                WHERE U.CPF = ?;
                """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, cpf);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new EntregadorResponseDTO(
                            rs.getString("CPF"),
                            rs.getString("NOME"),
                            rs.getString("EMAIL"),
                            rs.getString("TELEFONE"),
                            rs.getString("VEICULO"),
                            rs.getString("PLACA"),
                            rs.getDouble("NOTA")
                    );
                }
            }
        }
        return null;
    }

    public void atualizar(EntregadorDTO dto) throws SQLException {
        String sqlUsuario = "UPDATE USUARIO SET NOME = ?, EMAIL = ? WHERE CPF = ?";
        String sqlEntregador = "UPDATE ENTREGADOR SET VEICULO = ?, PLACA = ? WHERE CPF = ?";
        String sqlDelTelefone = "DELETE FROM TELEFONE WHERE CPF = ?";
        String sqlInsTelefone = "INSERT INTO TELEFONE (CPF, NUMERO) VALUES (?, ?)";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement stmtU = conn.prepareStatement(sqlUsuario);
                 PreparedStatement stmtE = conn.prepareStatement(sqlEntregador);
                 PreparedStatement stmtDelT = conn.prepareStatement(sqlDelTelefone);
                 PreparedStatement stmtInsT = conn.prepareStatement(sqlInsTelefone)) {

                stmtU.setString(1, dto.nome());
                stmtU.setString(2, dto.email());
                stmtU.setString(3, dto.cpf());
                stmtU.executeUpdate();

                stmtE.setString(1, dto.veiculo());
                stmtE.setString(2, dto.placa());
                stmtE.setString(3, dto.cpf());
                stmtE.executeUpdate();

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
        String sqlEntregador = "DELETE FROM ENTREGADOR WHERE CPF = ?";
        String sqlUsuario = "DELETE FROM USUARIO WHERE CPF = ?";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement stmtTel = conn.prepareStatement(sqlTelefone);
                 PreparedStatement stmtEnt = conn.prepareStatement(sqlEntregador);
                 PreparedStatement stmtUsu = conn.prepareStatement(sqlUsuario)) {

                stmtTel.setString(1, cpf);
                stmtTel.executeUpdate();

                stmtEnt.setString(1, cpf);
                stmtEnt.executeUpdate();

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