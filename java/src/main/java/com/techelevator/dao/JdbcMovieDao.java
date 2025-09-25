package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Movie;
import com.techelevator.service.MovieHydrator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class JdbcMovieDao implements MovieDao{

    private final JdbcTemplate jdbcTemplate;
    private final MovieHydrator hydrator;

    public JdbcMovieDao(JdbcTemplate jdbcTemplate, MovieHydrator hydrator){

        this.jdbcTemplate = jdbcTemplate;
        this.hydrator = hydrator;
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
    public void addNewMovie(Movie movie, int userId) {
        Integer maxLocalId = jdbcTemplate.queryForObject(
                "SELECT MIN(movie_id) FROM movie WHERE movie_id < 0",
                Integer.class
        );
        int newMovieId = (maxLocalId != null ? maxLocalId : 0) - 1;

        String movieSql = "INSERT INTO movie(movie_id, title, overview, poster_path, release_date, vote_average) " +
                "VALUES (?, ?, ?, ?, ?, ?);";
        try {
            jdbcTemplate.update(movieSql,
                    newMovieId,
                    movie.getTitle(),
                    movie.getOverview(),
                    movie.getPosterPath(),
                    movie.getReleaseDate(),
                    movie.getVoteAverage()
            );
        } catch (DaoException e) {
            throw new DaoException("An error occurred updating database movie: ", e);
        }

        List<Integer> genreIds = movie.getGenreIds();
        String movieGenreSql = "INSERT INTO movie_genre(movie_id, genre_id) VALUES (?,?);";
        try {
            for (Integer id : genreIds) {
                jdbcTemplate.update(movieGenreSql, newMovieId, id);
            }
        } catch (DaoException e) {
            throw new DaoException("An error occurred updating database movie genres: ", e);
        }
    }
    @Override
    public void setMovieLikeStatus(int userId, int movieId, int status){
        hydrator.hydrateIfNeeded(movieId);
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
        hydrator.hydrateIfNeeded(movieId);
        String sql = "INSERT INTO users_movie (user_id, movie_id, favorited) " +
                "VALUES (?, ?, ?) " +
                "ON CONFLICT (user_id, movie_id) " +
                "DO UPDATE SET favorited = EXCLUDED.favorited";

        jdbcTemplate.update(sql, userId, movieId, favorited);
    }

    @Override
    public Boolean getMovieFavoriteStatus(int userId, int movieId) {
        String sql = "SELECT favorited FROM users_movie WHERE user_id = ? AND movie_id = ?";
        return jdbcTemplate.query(sql, rs -> {
            if(rs.next()) {
                return rs.getBoolean("favorited");
            }
            return false;
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
            if (results.getInt("liked") == 2){
                totalIndifferents += 1;
            }
        }
        return totalIndifferents;
    }

    public List<Movie> getRecentlyAddedMovies(){
        List<Movie> movies = new ArrayList<>();
        //only admin add movie will display
        String getMoviesSql = "SELECT * FROM movie WHERE movie_id < 0 ORDER BY movie_id DESC";
        try{
            SqlRowSet results = jdbcTemplate.queryForRowSet(getMoviesSql);
            while(results.next()){
                movies.add(mapRowToMovie(results));
            }
        }catch (DaoException e) {
            throw new DaoException("An error occurred updating database movie: ", e);
        }
        return movies;
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

    @Override
    public Map<Integer, Integer> getMovieLikeStatuses(int userId, List<Integer> movieIds) {
        if (movieIds.isEmpty()) {
            return Collections.emptyMap();
        }

        String sql = "SELECT movie_id, liked FROM users_movie " +
                "WHERE user_id = ? AND movie_id IN (" +
                String.join(",", Collections.nCopies(movieIds.size(), "?")) + ")";

        Object[] params = new Object[movieIds.size() + 1];
        params[0] = userId;
        for (int i = 0; i < movieIds.size(); i++) {
            params[i + 1] = movieIds.get(i);
        }

        Map<Integer, Integer> statuses = new HashMap<>();
        SqlRowSet rs = jdbcTemplate.queryForRowSet(sql, params);
        while (rs.next()) {
            statuses.put(rs.getInt("movie_id"), rs.getInt("liked")); // -1, 2, 1
        }
        return statuses;
    }

    @Override
    public Movie getMovieById(int movieId) {
        String sql = "SELECT * FROM movie WHERE movie_id = ?;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, movieId);

        if (results.next()) {
            return mapRowToMovie(results);
        } else {
            return null;
        }
    }

    /*private void ensureMovieExists(int movieId) {
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
    */

}
