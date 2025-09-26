package com.techelevator.controller;

import com.techelevator.dao.MovieDao;
import com.techelevator.model.Movie;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/")
public class PublicMovieController {

    private final MovieDao movieDao;

    public PublicMovieController(MovieDao movieDao){
        this.movieDao = movieDao;
    }

    @GetMapping("added")
    public List<Movie> getRecentlyAddedMovies() {
        return movieDao.getRecentlyAddedMovies();
    }
}
