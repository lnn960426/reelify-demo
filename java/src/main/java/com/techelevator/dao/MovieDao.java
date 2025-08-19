package com.techelevator.dao;

import com.techelevator.model.Movie;

import java.util.List;
import java.util.Map;

public interface MovieDao {

    List<Movie> getMoviesByUserLikedGenre(int userId);

    void setMovieLikeStatus(int userId, int movieId, int status);

    Integer getMovieLikeStatus(int userId, int movieId);
    
    void addNewMovie(Movie movie, int userId);

    public void setMovieFavoriteStatus(int userId, int movieId, boolean favorited);

    public Boolean getMovieFavoriteStatus(int userId, int movieId);

    List<Integer> getFavoriteMovieIdsByUser(int userId);

    public int getNumberIndifferents(int movieId);

    public int getNumberDislikes(int movieId);

    public int getNumberLikes(int movieId);

    public List<Movie> getRecentlyAddedMovies();
    
    public Map<Integer, Integer> getMovieLikeStatuses(int userId, List<Integer> movieIds);

    public Movie getMovieById(int movieId);
}
