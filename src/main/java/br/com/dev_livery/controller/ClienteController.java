package br.com.dev_livery.controller;

import br.com.dev_livery.dao.ClienteDAO;
import br.com.dev_livery.dto.ClienteDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.sql.SQLException;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteDAO clienteDAO;
    private final PasswordEncoder passwordEncoder;

    public ClienteController(ClienteDAO clienteDAO, PasswordEncoder passwordEncoder) {
        this.clienteDAO = clienteDAO;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody ClienteDTO dto) {
        try {
            String senhaHash = passwordEncoder.encode(dto.senha());

            clienteDAO.inserir(
                    dto.cpf(), dto.nome(), dto.email(), senhaHash, dto.telefone(),
                    dto.cep(), dto.rua(), dto.numero(), dto.bairro(), dto.cidade(), dto.convidado()
            );

            return ResponseEntity.ok("Cliente cadastrado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }
}