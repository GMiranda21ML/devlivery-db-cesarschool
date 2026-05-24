package br.com.dev_livery.dto;

public record PedidoResponseDTO(
        Integer cdPedido,
        Double valorTotal,
        String status,
        String data,
        Integer cdRestaurante,
        String cpfCliente
) {
}