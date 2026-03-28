package br.com.dev_livery.dto;

public record ClienteResponseDTO(
        String cpf, String nome, String email, String telefone,
        String cep, String rua, String numero, String bairro, String cidade, String convidado
) {}