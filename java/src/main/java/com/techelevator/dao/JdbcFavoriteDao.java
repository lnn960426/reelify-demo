package com.techelevator.dao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Movie;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.sql.Types;
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

   @Override
    public void addFavoriteMovie(int userId, int movieId){

        String setFavoriteSql = "INSERT INTO users_movie (movie_id, user_id, liked, favorited) " +
                "VALUES (?, ?, ?, ?)";
        String getLikeSettingSql = "SELECT liked FROM users_movie WHERE user_id=? AND movie_id=?;";

        try{
            int liked = jdbcTemplate.queryForObject(getLikeSettingSql, int.class, userId, movieId);
            jdbcTemplate.update(setFavoriteSql,
                    movieId,
                    userId,
                    liked,
                    true
                    );

            }catch(DaoException e){
                throw new DaoException("There was an error connecting with the database: ",e);
        }
    }
}
