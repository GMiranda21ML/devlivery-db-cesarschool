package br.com.dev_livery.controller;

import br.com.dev_livery.dao.PedidoDAO;
import br.com.dev_livery.dto.PedidoDTO;
import br.com.dev_livery.dto.PedidoResponseDTO;
import br.com.dev_livery.security.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoDAO pedidoDAO;
    private final TokenService tokenService;

    public PedidoController(PedidoDAO pedidoDAO, TokenService tokenService) {
        this.pedidoDAO = pedidoDAO;
        this.tokenService = tokenService;
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

    /**
     * Lista pedidos de um restaurante filtrados por status.
     * Aceita: "Pendente", "Em preparo", "Saiu para entrega" ou "todos".
     */
    @GetMapping("/restaurante/{cdRestaurante}/status/{status}")
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidosPorStatus(
            @PathVariable Integer cdRestaurante,
            @PathVariable String status,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String cpfSolicitante = tokenService.validarToken(token);
            String role = tokenService.obterRole(token);

            if (!"admin".equals(role)) {
                boolean ehDono = pedidoDAO.validarDonoRestaurante(cdRestaurante, cpfSolicitante);
                if (!ehDono) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            }

            List<PedidoResponseDTO> pedidos = pedidoDAO.listarPedidosPorRestauranteEStatus(cdRestaurante, status);
            return ResponseEntity.ok(pedidos);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Mantido para compatibilidade retroativa
    @GetMapping("/restaurante/{cdRestaurante}/pendentes")
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidosPendentes(
            @PathVariable Integer cdRestaurante) {
        try {
            List<PedidoResponseDTO> pedidos = pedidoDAO.listarPedidosPorRestauranteEStatus(cdRestaurante, "Pendente");
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

    /**
     * Atualiza o status de um pedido.
     * Fluxo: Pendente → Em preparo → Saiu para entrega → Concluido
     * Apenas o parceiro dono do restaurante daquele pedido (ou admin) pode alterar.
     */
    @PutMapping("/{cdPedido}/status")
    public ResponseEntity<String> atualizarStatus(
            @PathVariable Integer cdPedido,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String novoStatus = body.get("status");

            if (!isStatusValido(novoStatus)) {
                return ResponseEntity.badRequest()
                        .body("Status inválido. Permitidos: 'Em preparo', 'Saiu para entrega', 'Concluido'.");
            }

            String token = authHeader.replace("Bearer ", "");
            String cpfSolicitante = tokenService.validarToken(token);
            String role = tokenService.obterRole(token);

            if (!"admin".equals(role)) {
                boolean ehDono = pedidoDAO.validarDonoPedido(cdPedido, cpfSolicitante);
                if (!ehDono) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Acesso negado: você não é o dono deste pedido.");
                }
            }

            PedidoResponseDTO pedidoAtual = pedidoDAO.buscarPedidoPorId(cdPedido);
            if (pedidoAtual == null) {
                return ResponseEntity.notFound().build();
            }

            String statusAtual = pedidoAtual.status();
            if (!isTransicaoValida(statusAtual, novoStatus)) {
                return ResponseEntity.badRequest()
                        .body("Transição inválida: '" + statusAtual + "' → '" + novoStatus + "' não é permitida.");
            }

            pedidoDAO.atualizarStatusPedido(cdPedido, novoStatus);
            return ResponseEntity.ok("Status atualizado para '" + novoStatus + "' com sucesso!");

        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }

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

    @PutMapping("/{cdPedido}/confirmar-entrega")
    public ResponseEntity<String> confirmarEntrega(
            @PathVariable Integer cdPedido,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String cpfEntregador = tokenService.validarToken(token);

            PedidoResponseDTO pedido = pedidoDAO.buscarPedidoPorId(cdPedido);
            if (pedido == null) {
                return ResponseEntity.notFound().build();
            }
            if (!"Saiu para entrega".equals(pedido.status())) {
                return ResponseEntity.badRequest()
                        .body("Pedido não está em rota de entrega. Status atual: " + pedido.status());
            }

            pedidoDAO.confirmarEntrega(cdPedido, cpfEntregador);
            return ResponseEntity.ok("Entrega confirmada! Pedido concluído.");

        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body("Erro no banco: " + e.getMessage());
        }
    }

    @GetMapping("/disponiveis-entrega")
    public ResponseEntity<List<PedidoResponseDTO>> listarDisponiveisEntrega(
            @RequestHeader("Authorization") String authHeader) {
        try {
            List<PedidoResponseDTO> pedidos = pedidoDAO.listarPedidosParaEntrega();
            return ResponseEntity.ok(pedidos);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    private boolean isStatusValido(String status) {
        return status != null && (
                status.equals("Em preparo") ||
                        status.equals("Saiu para entrega") ||
                        status.equals("Concluido")
        );
    }

    private boolean isTransicaoValida(String atual, String novo) {
        return switch (atual) {
            case "Pendente"          -> "Em preparo".equals(novo);
            case "Em preparo"        -> "Saiu para entrega".equals(novo);
            case "Saiu para entrega" -> "Concluido".equals(novo);
            default                  -> false;
        };
    }
}
