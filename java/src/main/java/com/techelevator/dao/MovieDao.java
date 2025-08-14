package com.techelevator.dao;

import com.techelevator.model.Movie;

import java.util.List;

public interface MovieDao {

    List<Movie> getMoviesByUserLikedGenre(int userId);

    //void addMovieByUserLikedGenre(Movie movie);

    void setMovieLikeStatus(int userId, int movieId, int status);

    Integer getMovieLikeStatus(int userId, int movieId);
    
    void addNewMovie(Movie movie);
}
