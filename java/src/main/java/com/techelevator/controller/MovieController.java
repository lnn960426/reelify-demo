package com.techelevator.controller;

import com.techelevator.dao.FavoriteDao;
import com.techelevator.dao.MovieDao;
import com.techelevator.dao.UserDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Movie;
import com.techelevator.model.MovieDocs;
import com.techelevator.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@PreAuthorize("isAuthenticated()")
@RequestMapping(path = "/")
public class MovieController{

    @Value("${api-movie-database}")
    private String API_MOVIE_DATABASE;

    @Value("${api-key}")
    private String API_KEY;

    @Value("${api-read-access-token}")
    private String READ_ACCESS_TOKEN;

    private RestClient restClient = RestClient.create();

    private UserDao userDao;
    private MovieDao movieDao;
    private FavoriteDao favoriteDao;

    public MovieController(UserDao userDao, MovieDao movieDao, FavoriteDao favoriteDao){
        this.userDao = userDao;
        this.movieDao = movieDao;
        this.favoriteDao = favoriteDao;
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

        return movieList.getResults();
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

        return movieList.getResults();
    }

    @GetMapping(path = "movies/random")
    public List<Movie> getMoviesByUserLikedGenres(Principal principal) {

        User user = userDao.getUserByUsername(principal.getName());
        int userId = user.getId();

        List<Integer> genreIdList = favoriteDao.getFavoriteGenresByUserId(userId);

        if(genreIdList.isEmpty()){
            return new ArrayList<>();
        }

        try {
            String genreParam = genreIdList.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining("|"));

            String urlFirstPage = API_MOVIE_DATABASE + "/discover/movie?api_key=" + API_KEY + "&with_genres=" + genreParam;

            MovieDocs firstPageData = restClient.get()
                    .uri(urlFirstPage)
                    .retrieve()
                    .body(MovieDocs.class);

            int totalPages = Math.min(firstPageData.getTotalPages(), 500);
            if (totalPages == 0){
                return new ArrayList<>();
            }

            int randomPage = (int) (Math.random() * totalPages) + 1;

            String urlRandomPage = API_MOVIE_DATABASE + "/discover/movie?api_key=" + API_KEY
                    + "&with_genres=" + genreParam
                    + "&page=" + randomPage;

            MovieDocs randomPageData = restClient.get()
                    .uri(urlRandomPage)
                    .retrieve()
                    .body(MovieDocs.class);


            return randomPageData.getResults();

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch movies from TMDB", e);
        }
    }

    @PostMapping(path="favorite")
    public void addFavoriteMovie(Principal principal, int movieId){
        User targetUser= userDao.getUserByUsername(principal.getName());
        favoriteDao.addFavoriteMovie(targetUser.getId(), movieId);
    }

}
