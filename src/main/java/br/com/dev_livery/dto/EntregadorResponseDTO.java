package br.com.dev_livery.dto;

public record EntregadorResponseDTO(
        String cpf, String nome, String email, String telefone,
        String veiculo, String placa, Double nota
) {}