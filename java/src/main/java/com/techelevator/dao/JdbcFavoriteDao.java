package com.techelevator.dao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Movie;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.security.Principal;
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

/*        String addFavoriteMovieSql = "INSERT INTO movie (movie_id, title, overview, poster_path, release_date, vote_average" +
                "VALUES (?, ?, ?, ?, ?, ?);";

        try{
            jdbcTemplate.update(addFavoriteMovieSql,
                    movie.getMovieId(),
                    movie.getTitle(),
                    movie.getOverview(),
                    movie.getPosterPath(),
                    movie.getReleaseDate(),
                    movie.getVoteAverage());
            }catch (DaoException e){
                throw new DaoException("Trouble connecting with database: ",e);
            }*/

        String setFavoriteSql = "INSERT INTO users_movie (movie_id, user_id, liked, favorited);" +
                "VALUES (?, ?, ?, ?)";
        String getLikeSettingSql = "SELECT liked FROM users_movie WHERE user_id=? AND movie_id=?;";

        try{
            SqlRowSet liked = jdbcTemplate.queryForRowSet(getLikeSettingSql, userId, movieId);
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
