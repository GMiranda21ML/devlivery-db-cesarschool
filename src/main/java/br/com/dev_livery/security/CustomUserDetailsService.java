package br.com.dev_livery.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final DataSource dataSource;

    public CustomUserDetailsService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String sql = "SELECT EMAIL, SENHA FROM USUARIO WHERE EMAIL = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement usuario = conn.prepareStatement(sql)) {

            usuario.setString(1, email);

            try (ResultSet rs = usuario.executeQuery()) {
                if (rs.next()) {
                    String emailBanco = rs.getString("EMAIL");
                    String senhaBanco = rs.getString("SENHA");

                    // Retorna um usuário no formato que o Spring Security entende
                    return new User(emailBanco, senhaBanco, new ArrayList<>());
                } else {
                    throw new UsernameNotFoundException("Usuário não encontrado com o e-mail: " + email);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar usuário no banco", e);
        }
    }
}