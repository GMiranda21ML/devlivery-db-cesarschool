package br.com.dev_livery.controller;

import br.com.dev_livery.dao.AvaliacaoDAO;
import br.com.dev_livery.dto.AvaliacaoDTO;
import br.com.dev_livery.dto.LogPedidoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
public class AvaliacaoController {

    private final AvaliacaoDAO avaliacaoDAO;

    public AvaliacaoController(AvaliacaoDAO avaliacaoDAO) {
        this.avaliacaoDAO = avaliacaoDAO;
    }

    // ------------------------------------------------------------------
    // POST /api/avaliacoes
    // Insere uma avaliação → dispara trg_atualizar_nota_entregador
    // ------------------------------------------------------------------
    @PostMapping("/api/avaliacoes")
    public ResponseEntity<String> avaliar(@RequestBody AvaliacaoDTO dto) {
        try {
            if (dto.nota() < 0 || dto.nota() > 5) {
                return ResponseEntity.badRequest().body("Nota deve ser entre 0 e 5.");
            }
            if (avaliacaoDAO.jaAvaliou(dto.cpfCliente(), dto.cdPedido(), dto.cdProduto())) {
                return ResponseEntity.badRequest().body("Você já avaliou este produto neste pedido.");
            }
            avaliacaoDAO.inserir(dto);
            return ResponseEntity.ok("Avaliação registrada com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }

    // ------------------------------------------------------------------
    // GET /api/pedidos/{cdPedido}/produtos
    // Retorna produtos de um pedido concluído para montar o form
    // ------------------------------------------------------------------
    @GetMapping("/api/pedidos/{cdPedido}/produtos")
    public ResponseEntity<List<Map<String, Object>>> produtosDoPedido(@PathVariable Integer cdPedido) {
        try {
            return ResponseEntity.ok(avaliacaoDAO.listarProdutosDoPedido(cdPedido));
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ------------------------------------------------------------------
    // GET /api/logs/pedidos
    // Retorna todos os registros de LOG_PEDIDOS (efeito do trigger)
    // ------------------------------------------------------------------
    @GetMapping("/api/logs/pedidos")
    public ResponseEntity<List<LogPedidoDTO>> listarLogs() {
        try {
            return ResponseEntity.ok(avaliacaoDAO.listarLogs());
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}