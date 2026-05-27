
package br.com.dev_livery.dto;

public record RestauranteDTO(
        String cpf,
        String nome,
        String email,
        String senha,
        String telefoneRestaurante,
        String cnpj,
        String numero,
        String cep,
        String bairro,
        String rua,
        String cidade,
        Integer cdCategoria,
        Integer tempoEntrega
) {}