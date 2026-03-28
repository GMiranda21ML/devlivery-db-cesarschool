package br.com.dev_livery.dto;

public record EntregadorDTO(
        String cpf,
        String nome,
        String email,
        String senha,
        String telefone,
        String veiculo,
        String placa
) {}