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

    private Movie mapRowToMovie(SqlRowSet rs){
        Movie movie = new Movie();
        movie.setTitle(rs.getString("title"));
        movie.setMovieId(rs.getInt("movie_id"));
        movie.setOverview(rs.getString("overview"));
        movie.setPosterPath(rs.getString("poster_path"));
        movie.setReleaseDate(rs.getString("release_date"));
        movie.setVoteAverage(rs.getDouble("vote_average"));
        return movie;
    }
}
