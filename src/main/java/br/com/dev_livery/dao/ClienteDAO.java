package br.com.dev_livery.dao;

import br.com.dev_livery.dto.ClienteResponseDTO;
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
                	C.CEP, C.CEP, C.RUA, C.NUMERO AS NUM_ENDERECO, C.BAIRRO, C.CIDADE, C.CONVIDADO,
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

    public void atualizarEndereco(String cpf, String rua, String numero, String bairro, String cidade, String cep) throws SQLException {
        String sql = "UPDATE CLIENTE SET RUA = ?, NUMERO = ?, BAIRRO = ?, CIDADE = ?, CEP = ? WHERE CPF = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement cliente = conn.prepareStatement(sql)) {

            cliente.setString(1, rua);
            cliente.setString(2, numero);
            cliente.setString(3, bairro);
            cliente.setString(4, cidade);
            cliente.setString(5, cep);
            cliente.setString(6, cpf);
            cliente.executeUpdate();
        }
    }

    public void deletar(String cpf) throws SQLException {
        String sqlCliente = "DELETE FROM CLIENTE WHERE CPF = ?";
        String sqlTelefone = "DELETE FROM TELEFONE WHERE CPF = ?";
        String sqlUsuario = "DELETE FROM USUARIO WHERE CPF = ?";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);

            try (PreparedStatement cliente = conn.prepareStatement(sqlCliente);
                 PreparedStatement numTelefone = conn.prepareStatement(sqlTelefone);
                 PreparedStatement usuario = conn.prepareStatement(sqlUsuario)) {

                cliente.setString(1, cpf);
                cliente.executeUpdate();

                numTelefone.setString(1, cpf);
                numTelefone.executeUpdate();

                usuario.setString(1, cpf);
                usuario.executeUpdate();

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }
}