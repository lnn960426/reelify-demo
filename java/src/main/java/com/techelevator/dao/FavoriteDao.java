package com.techelevator.dao;

import com.techelevator.model.Movie;

import java.security.Principal;
import java.util.List;

public interface FavoriteDao {
    List<Integer> getFavoriteGenresByUserId(int userId);

    void addFavoriteMovie(int userId, int movieId);

}

