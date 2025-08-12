package com.techelevator.dao;

import java.util.List;

public interface FavoriteDao {
    List<Integer> getFavoriteGenresByUserId(int userId);
}