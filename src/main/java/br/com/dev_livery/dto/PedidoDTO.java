
package br.com.dev_livery.dto;

import java.util.List;

public record PedidoDTO(
        String cpfCliente,
        Integer cdRestaurante,
        List<PedidoItemDTO> items
) {}

