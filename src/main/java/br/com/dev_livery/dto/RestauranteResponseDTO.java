
package br.com.dev_livery.dto;

public record RestauranteResponseDTO(
        Integer cdRestaurante,
        String cpf,
        String nome,
        String email,
        String telefone,
        String cnpj,
        String numero,
        String cep,
        String bairro,
        String rua,
        String cidade,
        Double nota,
        Double taxaEntrega,
        Integer tempoEntrega,
        String nomeImagem
) {}
