package br.com.dev_livery.controller;

import br.com.dev_livery.dto.LoginDTO;
import br.com.dev_livery.dto.TokenResponse;
import br.com.dev_livery.security.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final DataSource dataSource;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService, DataSource dataSource) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.dataSource = dataSource;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            // 1. Confere E-mail e Senha na tabela USUARIO
            var usernamePassword = new UsernamePasswordAuthenticationToken(dto.email(), dto.senha());
            var auth = this.authenticationManager.authenticate(usernamePassword);

            String cpf = auth.getName();

            // 2. VERIFICAÇÃO DE SEGURANÇA: A pessoa realmente tem esse perfil?
            String sql;
            if ("cliente".equalsIgnoreCase(dto.role())) {
                sql = "SELECT 1 FROM CLIENTE WHERE CPF = ?";
            } else if ("entregador".equalsIgnoreCase(dto.role())) {
                sql = "SELECT 1 FROM ENTREGADOR WHERE CPF = ?";
            } else {
                return ResponseEntity.badRequest().body("Perfil inválido.");
            }

            try (Connection conn = dataSource.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(sql)) {

                stmt.setString(1, cpf);

                try (ResultSet rs = stmt.executeQuery()) {
                    if (!rs.next()) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Você não possui uma conta de " + dto.role() + ".");
                    }
                }
            }

            // 3. Gera o token JWT com segurança
            var token = tokenService.gerarToken(cpf, dto.role());
            return ResponseEntity.ok(new TokenResponse(token));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha incorretos.");
        }
    }
}