
package br.com.dev_livery.controller;

import br.com.dev_livery.dao.ParceiroDAO;
import br.com.dev_livery.dto.ParceiroDTO;
import br.com.dev_livery.dto.ParceiroResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.sql.SQLException;

@RestController
@RequestMapping("/api/parceiros")
public class ParceiroController {

    private final ParceiroDAO parceiroDAO;
    private final PasswordEncoder passwordEncoder;

    public ParceiroController(ParceiroDAO parceiroDAO, PasswordEncoder passwordEncoder) {
        this.parceiroDAO = parceiroDAO;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody ParceiroDTO dto) {
        try {
            String senhaHash = passwordEncoder.encode(dto.senha());

            parceiroDAO.inserir(
                    dto.cpf(), dto.nome(), dto.email(), senhaHash, dto.telefone()
            );

            return ResponseEntity.ok("Parceiro cadastrado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<ParceiroResponseDTO> buscarParceiro(@PathVariable String cpf) {
        try {
            ParceiroResponseDTO parceiro = parceiroDAO.buscarPorCpf(cpf);

            if (parceiro != null) {
                return ResponseEntity.ok(parceiro);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/atualizar")
    public ResponseEntity<String> atualizar(@RequestBody ParceiroDTO dto) {
        try {
            parceiroDAO.atualizar(dto);
            return ResponseEntity.ok("Parceiro atualizado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro: " + e.getMessage());
        }
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<String> deletar(@PathVariable String cpf) {
        try {
            parceiroDAO.deletar(cpf);
            return ResponseEntity.ok("Conta de parceiro excluída.");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro ao excluir: " + e.getMessage());
        }
    }
}
