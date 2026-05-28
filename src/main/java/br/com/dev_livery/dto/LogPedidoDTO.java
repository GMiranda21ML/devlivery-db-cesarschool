package br.com.dev_livery.dto;

public record LogPedidoDTO(
        Integer cdLog,
        Integer cdPedido,
        String cpfCliente,
        Double valorTotal,
        String dataHora,
        String operacao
) {
}