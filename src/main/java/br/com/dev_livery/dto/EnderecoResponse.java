package br.com.dev_livery.dto;

public record EnderecoResponse(
        String cep, String rua, String numero, String bairro, String cidade
) {
}
