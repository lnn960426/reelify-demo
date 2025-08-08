package com.techelevator.dao;

import com.techelevator.model.Movie;

import java.util.List;

public interface MovieDao {

    List<Movie> getMoviesByUserLikedGenre(int userId);
}
