
package br.com.dev_livery.dto;

public record ProdutoDTO(
        Integer cdProduto,
        String nome,
        String descricao,
        Double nota,
        Double preco,
        Integer cdRestaurante
) {}
