package br.com.dev_livery.dao;

import br.com.dev_livery.dto.CategoriaResponseDTO;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class CategoriaDAO {

    private final DataSource dataSource;

    public CategoriaDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<CategoriaResponseDTO> listarTodas() throws SQLException {
        String sql = "SELECT CD_CATEGORIA, NOME FROM CATEGORIA";
        List<CategoriaResponseDTO> categorias = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                categorias.add(new CategoriaResponseDTO(
                        rs.getInt("CD_CATEGORIA"),
                        rs.getString("NOME")
                ));
            }
        }
        return categorias;
    }
}