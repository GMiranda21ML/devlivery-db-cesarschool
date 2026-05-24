package br.com.dev_livery.dto;

public record EntregadorDestaqueDTO(
        String nome,
        String veiculo,
        Double nota,
        String classificacao
) {
}