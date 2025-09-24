package com.techelevator.dao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Movie;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
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
       try{
        ensureMovieExists(movieId);

       Integer liked = jdbcTemplate.query(
               "SELECT liked FROM users_movie WHERE user_id = ? AND movie_id = ?",
               rs -> rs.next() ? rs.getInt(1) : 0,
               userId, movieId
       );

       String sql = "INSERT INTO users_movie (movie_id, user_id, liked, favorited) " +
               "VALUES (?, ?, ?, TRUE) " +
               "ON CONFLICT (movie_id, user_id) DO UPDATE SET favorited = TRUE";

       jdbcTemplate.update(sql, movieId, userId, liked);

   } catch (
    CannotGetJdbcConnectionException e) {
        throw new DaoException("Unable to connect to server or database", e);
    } catch (
    DataIntegrityViolationException e) {
        throw new DaoException("Data integrity violation while setting favorite", e);
    } catch (
    DataAccessException e) {
        throw new DaoException("Database error while setting favorite", e);
    }
}

    private void ensureMovieExists(int movieId) {
        Integer exists = jdbcTemplate.query(
                "SELECT 1 FROM movie WHERE movie_id = ? LIMIT 1",
                rs -> rs.next() ? 1 : null,
                movieId
        );
        if (exists == null) {
            jdbcTemplate.update(
                    "INSERT INTO movie (movie_id, title, overview, poster_path, release_date, vote_average) " +
                            "VALUES (?,?,NULL,NULL,NULL,NULL) " +
                            "ON CONFLICT (movie_id) DO NOTHING",
                    movieId,"(external)"
            );
        }
    }
}
