package com.techelevator.controller;

import com.techelevator.dao.MovieDao;
import com.techelevator.dao.UserDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Movie;
import com.techelevator.model.MovieDocs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@PreAuthorize("isAuthenticated()")
@RequestMapping(path = "API_MOVIE_DATABASE/")
public class MovieController{

    @Value("${api-movie-database}")
    private String API_MOVIE_DATABASE;

    @Value("${api-key}")
    private String API_KEY;

    private RestClient restClient = RestClient.create();

    private UserDao userDao;
    private MovieDao movieDao;

    public MovieController(UserDao userDao, MovieDao movieDao){
        this.userDao = userDao;
        this.movieDao = movieDao;
    }

    @GetMapping(path = "discover/movie?with_genres={genreId}")
    public List<Movie> getMoviesByGenreId(@PathVariable int genreId, int userId){
        //holding container for restClient return
        MovieDocs movieList = new MovieDocs();
        //reach out to external api for list of movies

        try{
            movieList = restClient.get()
                    .uri(API_MOVIE_DATABASE + "discover/movie?with_genres={genreId}")
                    .header("Authorization", "Bearer " + API_KEY)
                    .retrieve()
                    .body(MovieDocs.class);
        }
        catch(DaoException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return movieList.getMovies();
    }

    @GetMapping(path = "discover/movie?with_genres={genreId}&page={pageNum}")
    public List<Movie> getMoviesByGenreId(@PathVariable int genreId, int userId, int pageNum){
        //holding container for restClient return
        MovieDocs movieList = new MovieDocs();
        //reach out to external api for list of movies

        try{
            movieList = restClient.get()
                    .uri(API_MOVIE_DATABASE + "discover/movie?with_genres={genreId}&page={pageNum}")
                    .header("Authorization", "Bearer " + API_KEY)
                    .retrieve()
                    .body(MovieDocs.class);
        }
        catch(DaoException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return movieList.getMovies();
    }
}
