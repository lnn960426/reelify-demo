package com.techelevator.dao;

import com.techelevator.model.Movie;

import java.util.List;

public interface MovieDao {

    List<Movie> getMoviesByUserLikedGenre(int userId);


    void setMovieLikeStatus(int userId, int movieId, int status);

    Integer getMovieLikeStatus(int userId, int movieId);
    
    void addNewMovie(Movie movie);

    public void setMovieFavoriteStatus(int userId, int movieId, boolean favorited);

    public Integer getMovieFavoriteStatus(int userId, int movieId);

    List<Integer> getFavoriteMovieIdsByUser(int userId);
}
