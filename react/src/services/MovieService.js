import axios from 'axios';
import api from './api';

export default {

  getMovieByTitleSearch(title) {
    return api.get(`/movies/search/${encodeURIComponent(title)}`);
  },

  getRandomMoviesByUserGenres() {
    return api.get("/movies/random")
  },

  updateMovieLikeStatus(movieId, status) {
    return api.put(`/movies/${movieId}/like`, null, { params: { status: status }
    })
  },

  createNewMovie(movieData) {
    return api.post("/movie", movieData);
  },

  updateMovieFavoriteStatus(movieId, favorited) {
    return api.put(`/movies/${movieId}/favorite`, null, {
      params: { favorited: favorited }
    })
  },

  getFavorites() {
    return api.get("/favorites");
  },

  getFavoriteGenres() {
    return api.get("/favorites/genres");
  },

  getLikes(movieId) {
    return api.get(`/movies/${movieId}/totalLikes`);

  },

  getDislikes(movieId) {
    return api.get(`/movies/${movieId}/totalDislikes`);
  },

  getIndifferents(movieId) {
    return api.get(`/movies/${movieId}/totalIndifferents`);
  },

  getRecentlyAddedMovies() {
    return api.get("/added");
  },

  getMovieLikeStatuses(movieIds) {
    return api.post("/movies/likeStatuses", movieIds);
  },

  getMoviesFavoriteStatuses(movieIds) {
    return api.post("/movies/favorites", movieIds);
}



}
