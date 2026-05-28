package br.com.dev_livery.dto;

public record AvaliacaoDTO(
        String cpfCliente,
        Integer cdPedido,
        Integer cdProduto,
        Float nota,
        String comentario
) {
}