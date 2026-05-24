package br.com.dev_livery.dto;

import java.time.LocalDateTime;

public record FaturamentoDTO(
        Integer cdPedido,
        String restaurante,
        String cliente,
        String formaPagamento,
        Double valorPago,
        LocalDateTime dataHora
) {
}