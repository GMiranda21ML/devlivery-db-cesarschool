
package br.com.dev_livery.controller;

import br.com.dev_livery.dao.ProdutoDAO;
import br.com.dev_livery.dto.ProdutoResponseDTO;
import br.com.dev_livery.dto.ProdutoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoDAO produtoDAO;

    public ProdutoController(ProdutoDAO produtoDAO) {
        this.produtoDAO = produtoDAO;
    }

    @GetMapping("/restaurante/{cdRestaurante}")
    public ResponseEntity<List<ProdutoResponseDTO>> listarPorRestaurante(@PathVariable Integer cdRestaurante) {
        try {
            List<ProdutoResponseDTO> produtos = produtoDAO.listarPorRestaurante(cdRestaurante);
            return ResponseEntity.ok(produtos);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{cdProduto}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Integer cdProduto) {
        try {
            ProdutoResponseDTO produto = produtoDAO.buscarPorId(cdProduto);
            if (produto != null) {
                return ResponseEntity.ok(produto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> inserir(@RequestBody ProdutoDTO produto) {
        try {
            produtoDAO.inserir(produto);
            return ResponseEntity.ok("Produto criado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }

    @PutMapping("/{cdProduto}")
    public ResponseEntity<String> atualizar(@PathVariable Integer cdProduto, @RequestBody ProdutoDTO produto) {
        try {
            produtoDAO.atualizar(cdProduto, produto);
            return ResponseEntity.ok("Produto atualizado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }

    @DeleteMapping("/{cdProduto}")
    public ResponseEntity<String> deletar(@PathVariable Integer cdProduto) {
        try {
            produtoDAO.deletar(cdProduto);
            return ResponseEntity.ok("Produto deletado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }
}
