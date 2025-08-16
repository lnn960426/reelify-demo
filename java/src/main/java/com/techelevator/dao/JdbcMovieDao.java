package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Movie;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcMovieDao implements MovieDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcMovieDao(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Movie> getMoviesByUserLikedGenre(int userId){
        List<Movie> movies = new ArrayList<>();
        String sql = "SELECT m.*\n" +
                "FROM movie m\n" +
                "JOIN movie_genre mg ON m.movie_id = mg.movie_id\n" +
                "JOIN users_genre ug ON mg.genre_id = ug.genre_id\n" +
                "WHERE ug.user_id = ?;";
        try{
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, userId);
            while(results.next()){
                movies.add(mapRowToMovie(results));
            }
        }catch (DaoException e){
            throw new DaoException("An error occurred getting movie list: ", e);
        }
        return movies;
    }

    @Override
    public void addNewMovie(Movie movie) {
        String movieSql = "INSERT INTO movie(title, overview, poster_path, release_date, vote_average) " +
                "VALUES (?, ?, ?, ?, ?) RETURNING movie_id;";
        List<Integer> genreIds = movie.getGenreIds();
        int newMovieId;

        try {
            newMovieId = jdbcTemplate.queryForObject(movieSql,
                    int.class,
                    movie.getTitle(),
                    movie.getOverview(),
                    movie.getPosterPath(),
                    movie.getReleaseDate(),
                    movie.getVoteAverage());
        } catch (DaoException e) {
            throw new DaoException("An error occurred updating database movie: ", e);
        }

        String movieGenreSql = "INSERT INTO movie_genre(movie_id, genre_id) VALUES (?,?);";

        try{
            for(Integer id : genreIds){
                jdbcTemplate.update(movieGenreSql, newMovieId, id);
            }
        }catch (DaoException e) {
            throw new DaoException("An error occurred updating database movie: ", e);
        }
    }
    @Override
    public void setMovieLikeStatus(int userId, int movieId, int status){

        String sql = "INSERT INTO users_movie (user_id, movie_id, liked) " +
                "VALUES (?, ?, ?) " +
                "ON CONFLICT (user_id, movie_id) " +
                "DO UPDATE SET liked = EXCLUDED.liked";

        jdbcTemplate.update(sql, userId, movieId, status);
    }

    @Override
    public Integer getMovieLikeStatus(int userId, int movieId) {
        String sql = "SELECT liked FROM users_movie WHERE user_id = ? AND movie_id = ?";
        return jdbcTemplate.query(sql, rs -> {
            if(rs.next()) {
                return rs.getInt("liked");
            }
            return null;
        }, userId, movieId);
    }



    @Override
    public void setMovieFavoriteStatus(int userId, int movieId, boolean favorited){

        String sql = "INSERT INTO users_movie (user_id, movie_id, favorited) " +
                "VALUES (?, ?, ?) " +
                "ON CONFLICT (user_id, movie_id) " +
                "DO UPDATE SET favorited = EXCLUDED.favorited";

        jdbcTemplate.update(sql, userId, movieId, favorited);
    }

    @Override
    public Integer getMovieFavoriteStatus(int userId, int movieId) {
        String sql = "SELECT favorited FROM users_movie WHERE user_id = ? AND movie_id = ?";
        return jdbcTemplate.query(sql, rs -> {
            if(rs.next()) {
                return rs.getInt("favorited");
            }
            return null;
        }, userId, movieId);
    }

    @Override
    public List<Integer> getFavoriteMovieIdsByUser(int userId){
        List<Integer> favorites = new ArrayList<>();

        String sql = "SELECT movie_id FROM users_movie WHERE user_id = ? AND favorited = true";

        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, userId);
        while (results.next()) {
            favorites.add(results.getInt("movie_id"));
        }

        return favorites;
    }

    public int getNumberLikes(int movieId){
        //query local database for number of likes a particular movie has
        int totalLikes = 0;
        String sql = "SELECT liked FROM users_movie WHERE movie_id = ?;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, movieId);
        while (results.next()) {
            if (results.getInt("liked") == 1){
                totalLikes += 1;
            }
        }
        return totalLikes;
    }

    public int getNumberDislikes(int movieId){
        //query local database for number of dislikes a particular movie has
        int totalDislikes = 0;
        String sql = "SELECT liked FROM users_movie WHERE movie_id = ?;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, movieId);
        while (results.next()){
            if (results.getInt("liked") == -1){
                totalDislikes += 1;
            }
        }
        return totalDislikes;
    }

    public int getNumberIndifferents(int movieId){
        //query local database for number of indifferents a particular movie has
        int totalIndifferents = 0;
        String sql = "SELECT liked FROM users_movie WHERE movie_id = ?;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, movieId);
        while (results.next()){
            if (results.getInt("liked") == 0){
                totalIndifferents += 1;
            }
        }
        return totalIndifferents;
    }

    public Movie mapRowToMovie(SqlRowSet results){
        Movie movie = new Movie();

        movie.setTitle(results.getString("title"));
        movie.setMovieId(results.getInt("movie_id"));
        movie.setOverview(results.getString("overview"));
        movie.setPosterPath(results.getString("poster_path"));
        movie.setReleaseDate(results.getString("release_date"));
        movie.setVoteAverage(results.getDouble("vote_average"));
        return movie;
    }
}
