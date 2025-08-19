package com.techelevator.controller;

import com.techelevator.dao.FavoriteDao;
import com.techelevator.dao.UserDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.GenreDto;
import com.techelevator.model.RegisterUserDto;
import com.techelevator.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * The UserController is a class for handling HTTP Requests related to getting User information.
 *
 * It depends on an instance of a UserDAO for retrieving and storing data. This is provided
 * through dependency injection.
 *
 * Note: This class does not handle authentication (registration/login) of Users. That is
 * handled separately in the AuthenticationController.
 */
@RestController
@CrossOrigin
@RequestMapping( path = "/users")
public class UserController {

    private UserDao userDao;
    private FavoriteDao favoriteDao;

    public UserController(UserDao userDao, FavoriteDao favoriteDao) {
        this.userDao = userDao;
        this.favoriteDao = favoriteDao;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(method = RequestMethod.GET)
    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();

        try {
            users = userDao.getUsers();
        }
        catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return users;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(path = "/{userId}")
    public void deleteUser(@PathVariable int userId) {
        try {
            userDao.deleteUser(userId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @PostMapping
    public User createUser(@RequestBody RegisterUserDto newUser) {
        return userDao.createUser(newUser);
    }

    @RequestMapping(path = "/{userId}", method = RequestMethod.GET)
    public User getById(@PathVariable int userId, Principal principal) {
        User user = null;

        try {
            user = userDao.getUserById(userId);
        }
        catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return user;
    }



    @GetMapping(path = "/genre")
    public List<String> getUserGenres(Principal principal){
        User user = userDao.getUserByUsername(principal.getName());
        List<String> genres = new ArrayList<>();
        try{
           genres = userDao.getUserGenres(user);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        return genres;
    }



    @PutMapping(path = "/genre")
    public void addGenre(@RequestParam String genres, Principal principal) {
        User user = userDao.getUserByUsername(principal.getName());
        List<String> genreList = Arrays.asList(genres.split(","));
        List<Integer> genreIdList = favoriteDao.getFavoriteGenresByUserId(user.getId());
        try{
            userDao.addGenre(user, genreList, genreIdList);
        }catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @DeleteMapping(path = "/genre")
    public void deleteGenre(@RequestParam  String genre, Principal principal){
        User user = userDao.getUserByUsername(principal.getName());
        List<Integer> genreIdList = favoriteDao.getFavoriteGenresByUserId(user.getId());
        try{
            userDao.deleteGenre(user, genre, genreIdList);
        }catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
