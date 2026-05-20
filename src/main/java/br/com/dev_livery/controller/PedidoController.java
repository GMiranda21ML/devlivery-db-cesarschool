
package br.com.dev_livery.controller;

import br.com.dev_livery.dao.PedidoDAO;
import br.com.dev_livery.dto.PedidoDTO;
import br.com.dev_livery.dao.PedidoDAO.PedidoResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoDAO pedidoDAO;

    public PedidoController(PedidoDAO pedidoDAO) {
        this.pedidoDAO = pedidoDAO;
    }

    @PostMapping
    public ResponseEntity<String> criarPedido(@RequestBody PedidoDTO pedido) {
        try {
            pedidoDAO.inserir(pedido);
            return ResponseEntity.ok("Pedido criado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }

    @GetMapping("/restaurante/{cdRestaurante}/pendentes")
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidosPendentes(@PathVariable Integer cdRestaurante) {
        try {
            List<PedidoResponseDTO> pedidos = pedidoDAO.listarPedidosPendentesPorRestaurante(cdRestaurante);
            return ResponseEntity.ok(pedidos);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/restaurante/{cdRestaurante}/faturamento")
    public ResponseEntity<Double> calcularFaturamento(@PathVariable Integer cdRestaurante) {
        try {
            Double faturamento = pedidoDAO.calcularFaturamentoPorRestaurante(cdRestaurante);
            return ResponseEntity.ok(faturamento);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{cdPedido}/status")
    public ResponseEntity<String> atualizarStatus(@PathVariable Integer cdPedido, @RequestBody String status) {
        try {
            pedidoDAO.atualizarStatusPedido(cdPedido, status);
            return ResponseEntity.ok("Status atualizado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }
}
