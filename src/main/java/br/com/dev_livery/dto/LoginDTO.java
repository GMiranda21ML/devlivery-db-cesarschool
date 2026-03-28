package br.com.dev_livery.dto;

public record LoginDTO(
        String email,
        String senha,
        String role
) {
}
