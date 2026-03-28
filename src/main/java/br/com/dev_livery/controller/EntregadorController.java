package br.com.dev_livery.controller;

import br.com.dev_livery.dao.EntregadorDAO;
import br.com.dev_livery.dto.EntregadorDTO;
import br.com.dev_livery.dto.EntregadorResponseDTO;
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

    @GetMapping("/{cpf}")
    public ResponseEntity<EntregadorResponseDTO> buscarEntregador(@PathVariable String cpf) {
        try {
            EntregadorResponseDTO entregador = entregadorDAO.buscarPorCpf(cpf);

            if (entregador != null) {
                return ResponseEntity.ok(entregador);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/atualizar")
    public ResponseEntity<String> atualizar(@RequestBody EntregadorDTO dto) {
        try {
            entregadorDAO.atualizar(dto);
            return ResponseEntity.ok("Entregador atualizado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro: " + e.getMessage());
        }
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<String> deletar(@PathVariable String cpf) {
        try {
            entregadorDAO.deletar(cpf);
            return ResponseEntity.ok("Conta de entregador excluída.");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro ao excluir: " + e.getMessage());
        }
    }
}