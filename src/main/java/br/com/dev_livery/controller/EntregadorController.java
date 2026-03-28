package br.com.dev_livery.controller;

import br.com.dev_livery.dao.EntregadorDAO;
import br.com.dev_livery.dto.EntregadorDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.sql.SQLException;

@RestController
@RequestMapping("/api/entregadores")
public class EntregadorController {

    private final EntregadorDAO entregadorDAO;
    private final PasswordEncoder passwordEncoder;

    public EntregadorController(EntregadorDAO entregadorDAO, PasswordEncoder passwordEncoder) {
        this.entregadorDAO = entregadorDAO;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody EntregadorDTO dto) {
        try {
            // Criptografa a senha antes de mandar para o DAO
            String senhaHash = passwordEncoder.encode(dto.senha());

            entregadorDAO.inserir(
                    dto.cpf(), dto.nome(), dto.email(), senhaHash,
                    dto.telefone(), dto.veiculo(), dto.placa()
            );

            return ResponseEntity.ok("Entregador cadastrado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }
}