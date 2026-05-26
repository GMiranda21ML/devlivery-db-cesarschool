package br.com.dev_livery.controller;

import br.com.dev_livery.dao.PedidoDAO;
import br.com.dev_livery.dto.PedidoDTO;
import br.com.dev_livery.dto.PedidoResponseDTO; // <-- AQUI ESTÁ A CORREÇÃO DO ERRO!
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.SQLException;
import java.util.List;
import java.util.Map; // <-- Importante para ler o JSON do status

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
    public ResponseEntity<String> atualizarStatus(@PathVariable Integer cdPedido, @RequestBody Map<String, String> body) {
        try {
            String novoStatus = body.get("status");
            pedidoDAO.atualizarStatusPedido(cdPedido, novoStatus);
            return ResponseEntity.ok("Status atualizado e histórico registrado com sucesso!");
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }

    // Nova Rota para acionar a Function de Cupom de Desconto
    @PostMapping("/simular-desconto")
    public ResponseEntity<Double> simularDesconto(
            @RequestParam Double valorPedido,
            @RequestParam String tipoCupom,
            @RequestParam Double valorDesconto) {
        try {
            Double valorFinal = pedidoDAO.simularDescontoCupom(valorPedido, tipoCupom, valorDesconto);
            return ResponseEntity.ok(valorFinal);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/cliente/{cpf}")
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidosDoCliente(@PathVariable String cpf) {
        try {
            return ResponseEntity.ok(pedidoDAO.listarPedidosPorCliente(cpf));
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}