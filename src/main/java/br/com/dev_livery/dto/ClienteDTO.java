package br.com.dev_livery.dto;

public record ClienteDTO(
        String cpf,
        String nome,
        String email,
        String senha,
        String telefone,
        String cep,
        String rua,
        String numero,
        String bairro,
        String cidade,
        String convidado
) {}