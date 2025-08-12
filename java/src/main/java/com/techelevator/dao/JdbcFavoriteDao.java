package com.techelevator.dao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class JdbcFavoriteDao implements FavoriteDao {

    private final JdbcTemplate jdbcTemplate;

    public JdbcFavoriteDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Integer> getFavoriteGenresByUserId(int userId) {
        String sql = "SELECT genre_id FROM users_genre WHERE user_id = ?";
        return jdbcTemplate.queryForList(sql, Integer.class, userId);
    }
}
