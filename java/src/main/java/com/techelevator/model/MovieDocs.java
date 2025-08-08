package com.techelevator.model;

import java.util.ArrayList;
import java.util.List;

public class MovieDocs {

    private List<Movie> movieList = new ArrayList<>();

    public List<Movie> getMovies(){
        return movieList;
    }

    public void setMovieList(List<Movie> movieList){
        this.movieList = movieList;
    }
}
