package br.com.dev_livery.dao;

import br.com.dev_livery.dto.ClienteDTO;
import br.com.dev_livery.dto.ClienteResponseDTO;
import br.com.dev_livery.dto.EnderecoResponse;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class ClienteDAO {

    private final DataSource dataSource;

    public ClienteDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void inserir(String cpf, String nome, String email, String senhaHash, String telefone,
                        String cep, String rua, String numero, String bairro, String cidade, String convidado) throws SQLException {

        String sqlUsuario = "INSERT INTO USUARIO (CPF, NOME, EMAIL, SENHA) VALUES (?, ?, ?, ?)";
        String sqlTelefone = "INSERT INTO TELEFONE (CPF, NUMERO) VALUES (?, ?)";
        String sqlCliente = "INSERT INTO CLIENTE (CPF, RUA, CIDADE, NUMERO, BAIRRO, CEP, CONVIDADO) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);

            try (PreparedStatement usuario = conn.prepareStatement(sqlUsuario);
                 PreparedStatement numTelefone = conn.prepareStatement(sqlTelefone);
                 PreparedStatement cliente = conn.prepareStatement(sqlCliente)) {

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

                // 3. Tabela CLIENTE
                cliente.setString(1, cpf);
                cliente.setString(2, rua);
                cliente.setString(3, cidade);
                cliente.setString(4, numero);
                cliente.setString(5, bairro);
                cliente.setString(6, cep);
                // Lida com o convidado (pode ser null)
                if (convidado != null && !convidado.isBlank()) {
                    cliente.setString(7, convidado);
                } else {
                    cliente.setNull(7, java.sql.Types.VARCHAR);
                }
                cliente.executeUpdate();

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }

    public ClienteResponseDTO buscarPorCpf(String cpf) throws SQLException {
        // Usamos JOIN para juntar as 3 tabelas baseadas no CPF
        String sql = """
                SELECT
                	U.NOME, U.EMAIL, U.CPF,
                	C.CEP, C.RUA, C.NUMERO AS NUM_ENDERECO, C.BAIRRO, C.CIDADE, C.CONVIDADO,
                	T.NUMERO AS TELEFONE
                FROM USUARIO U
                INNER JOIN CLIENTE C ON U.CPF = C.CPF
                INNER JOIN TELEFONE T ON U.CPF = T.CPF
                WHERE U.CPF = ?
                """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, cpf);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new ClienteResponseDTO(
                            rs.getString("CPF"),
                            rs.getString("NOME"),
                            rs.getString("EMAIL"),
                            rs.getString("TELEFONE"),
                            rs.getString("CEP"),
                            rs.getString("RUA"),
                            rs.getString("NUM_ENDERECO"),
                            rs.getString("BAIRRO"),
                            rs.getString("CIDADE"),
                            rs.getString("CONVIDADO")
                    );
                }
            }
        }
        return null;
    }

    public EnderecoResponse buscarEndereco(String cpf) throws SQLException {
        String sql = """
                SELECT C.CEP, C.RUA, C.NUMERO, C.BAIRRO, C.CIDADE
                FROM USUARIO U
                INNER JOIN CLIENTE C ON U.CPF = C.CPF
                WHERE U.CPF = ?
                """;


        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, cpf);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new EnderecoResponse(
                            rs.getString("CEP"),
                            rs.getString("RUA"),
                            rs.getString("NUMERO"),
                            rs.getString("BAIRRO"),
                            rs.getString("CIDADE")
                    );
                }
            }
        }
        return null;
    }

// MÉTODOS PARA ADICIONAR NO ClienteDAO.java

    public void atualizar(ClienteDTO dto) throws SQLException {
        String sqlUsuario = "UPDATE USUARIO SET NOME = ?, EMAIL = ? WHERE CPF = ?";
        String sqlCliente = "UPDATE CLIENTE SET RUA = ?, CIDADE = ?, NUMERO = ?, BAIRRO = ?, CEP = ? WHERE CPF = ?";
        String sqlDelTelefone = "DELETE FROM TELEFONE WHERE CPF = ?";
        String sqlInsTelefone = "INSERT INTO TELEFONE (CPF, NUMERO) VALUES (?, ?)";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement stmtU = conn.prepareStatement(sqlUsuario);
                 PreparedStatement stmtC = conn.prepareStatement(sqlCliente);
                 PreparedStatement stmtDelT = conn.prepareStatement(sqlDelTelefone);
                 PreparedStatement stmtInsT = conn.prepareStatement(sqlInsTelefone)) {

                // 1. Atualiza Usuário
                stmtU.setString(1, dto.nome());
                stmtU.setString(2, dto.email());
                stmtU.setString(3, dto.cpf());
                stmtU.executeUpdate();

                // 2. Atualiza Cliente
                stmtC.setString(1, dto.rua());
                stmtC.setString(2, dto.cidade());
                stmtC.setString(3, dto.numero());
                stmtC.setString(4, dto.bairro());
                stmtC.setString(5, dto.cep());
                stmtC.setString(6, dto.cpf());
                stmtC.executeUpdate();

                // 3. Atualiza Telefone (Deleta o antigo e insere o novo)
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
        String sqlLimpaConvite = "UPDATE CLIENTE SET CONVIDADO = NULL WHERE CONVIDADO = ?";
        String sqlTelefone = "DELETE FROM TELEFONE WHERE CPF = ?";
        String sqlCliente = "DELETE FROM CLIENTE WHERE CPF = ?";
        String sqlUsuario = "DELETE FROM USUARIO WHERE CPF = ?";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement stmtLimpa = conn.prepareStatement(sqlLimpaConvite);
                 PreparedStatement stmtTel = conn.prepareStatement(sqlTelefone);
                 PreparedStatement stmtCli = conn.prepareStatement(sqlCliente);
                 PreparedStatement stmtUsu = conn.prepareStatement(sqlUsuario)) {

                stmtLimpa.setString(1, cpf);
                stmtLimpa.executeUpdate();

                stmtTel.setString(1, cpf);
                stmtTel.executeUpdate();

                stmtCli.setString(1, cpf);
                stmtCli.executeUpdate();

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