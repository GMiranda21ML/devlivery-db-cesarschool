package br.com.dev_livery.controller;

import br.com.dev_livery.dao.RelatorioDAO;
import br.com.dev_livery.dto.ClienteInativoDTO;
import br.com.dev_livery.dto.FaturamentoDTO;
import br.com.dev_livery.dto.ProdutoPremiumDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioDAO relatorioDAO;

    public RelatorioController(RelatorioDAO relatorioDAO) {
        this.relatorioDAO = relatorioDAO;
    }

    @GetMapping("/faturamento")
    public ResponseEntity<List<FaturamentoDTO>> getFaturamento() {
        try {
            return ResponseEntity.ok(relatorioDAO.listarFaturamento());
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/clientes-inativos")
    public ResponseEntity<List<ClienteInativoDTO>> getClientesInativos() {
        try {
            return ResponseEntity.ok(relatorioDAO.listarClientesInativos());
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }



    @GetMapping("/produtos-premium")
    public ResponseEntity<List<ProdutoPremiumDTO>> getProdutosPremium() {
        try {
            return ResponseEntity.ok(relatorioDAO.listarProdutosPremium());
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/super-restaurantes")
    public ResponseEntity<List<Integer>> getSuperRestaurantes() {
        try {
            return ResponseEntity.ok(relatorioDAO.listarSuperRestaurantes());
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}