package br.com.dev_livery.controller;

import br.com.dev_livery.dao.CategoriaDAO;
import br.com.dev_livery.dto.CategoriaResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaDAO categoriaDAO;

    public CategoriaController(CategoriaDAO categoriaDAO) {
        this.categoriaDAO = categoriaDAO;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaResponseDTO>> listarTodas() {
        try {
            return ResponseEntity.ok(categoriaDAO.listarTodas());
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}