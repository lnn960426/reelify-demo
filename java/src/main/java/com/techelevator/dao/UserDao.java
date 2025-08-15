package com.techelevator.dao;

import com.techelevator.model.GenreDto;
import com.techelevator.model.RegisterUserDto;
import com.techelevator.model.User;

import java.security.Principal;
import java.util.List;

public interface UserDao {

    List<User> getUsers();

    User getUserById(int id);

    User getUserByUsername(String username);

    User createUser(RegisterUserDto user);

    void addGenre(User user, GenreDto genres, List<Integer> genreIdList);

    void deleteGenre(User user, GenreDto genres, List<Integer> genreIdList);
}
