package br.com.dev_livery.controller;

import br.com.dev_livery.dao.RestauranteDAO;
import br.com.dev_livery.dto.RestauranteDTO;
import br.com.dev_livery.dto.RestauranteResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/restaurantes")
public class RestauranteController {

    private final RestauranteDAO restauranteDAO;

    public RestauranteController(RestauranteDAO restauranteDAO) {
        this.restauranteDAO = restauranteDAO;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody RestauranteDTO dto) {
        try {
            Long id = restauranteDAO.salvar(dto);
            return ResponseEntity.ok(id.toString());
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/imagem")
    public ResponseEntity<String> uploadImagemRestaurante(@PathVariable Long id, @RequestParam("imagem") MultipartFile imagem) {
        try {
            Path caminho = Paths.get("src/main/resources/static/images/rest/rest_" + id + ".jpg");
            Files.copy(imagem.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);
            return ResponseEntity.ok("Imagem salva!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao salvar a imagem");
        }
    }

    @GetMapping
    public ResponseEntity<List<RestauranteResponseDTO>> listarTodos() {
        try {
            List<RestauranteResponseDTO> restaurantes = restauranteDAO.listarTodos();
            return ResponseEntity.ok(restaurantes);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<RestauranteResponseDTO> buscarRestaurante(@PathVariable String cpf) {
        try {
            RestauranteResponseDTO restaurante = restauranteDAO.buscarPorCpf(cpf);
            if (restaurante != null) {
                return ResponseEntity.ok(restaurante);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/categoria/{nomeCategoria}")
    public ResponseEntity<List<RestauranteResponseDTO>> listarPorCategoria(@PathVariable String nomeCategoria) {
        try {
            List<RestauranteResponseDTO> restaurantes = restauranteDAO.listarPorCategoria(nomeCategoria);
            return ResponseEntity.ok(restaurantes);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}