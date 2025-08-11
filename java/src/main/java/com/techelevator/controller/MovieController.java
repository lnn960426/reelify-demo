package com.techelevator.controller;

import com.techelevator.dao.MovieDao;
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
@RequestMapping(path = "/")
public class MovieController{

    @Value("${api-movie-database}")
    private String API_MOVIE_DATABASE;

    @Value("${api-key}")
    private String API_KEY;

    private RestClient restClient = RestClient.create();

    private MovieDao movieDao;


    @GetMapping(path = "discover/movie?with_genres={genreId}")
    public List<Movie> getMoviesByGenreId(@PathVariable int genreId, int userId){
        List<Movie> movies = new ArrayList<>();

        try{
            movies = movieDao.getMoviesByUserLikedGenre(userId);
        }
        catch(DaoException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        return movies;
    }
}
