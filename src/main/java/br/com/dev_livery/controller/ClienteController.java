package br.com.dev_livery.controller;

import br.com.dev_livery.dao.ClienteDAO;
import br.com.dev_livery.dto.ClienteDTO;
import br.com.dev_livery.dto.ClienteResponseDTO;
import br.com.dev_livery.dto.EnderecoResponse;
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

    @GetMapping("/{cpf}")
    public ResponseEntity<ClienteResponseDTO> buscarCliente(@PathVariable String cpf) {
        try {
            ClienteResponseDTO cliente = clienteDAO.buscarPorCpf(cpf);

            if (cliente != null) {
                return ResponseEntity.ok(cliente);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/buscar-endereco/{cpf}")
    public ResponseEntity<EnderecoResponse> buscarEndereco(@PathVariable String cpf) {
        try {
            EnderecoResponse endereco = clienteDAO.buscarEndereco(cpf);

            if (endereco != null) {
                return ResponseEntity.ok(endereco);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/atualizar")
    public ResponseEntity<String> atualizar(@RequestBody ClienteDTO dto) {
        try {
            clienteDAO.atualizar(dto);
            return ResponseEntity.ok("Cliente atualizado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro: " + e.getMessage());
        }
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<String> deletar(@PathVariable String cpf) {
        try {
            clienteDAO.deletar(cpf);
            return ResponseEntity.ok("Conta de cliente excluída.");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro ao excluir: " + e.getMessage());
        }
    }
}