import axios from 'axios';

export default {

  getRandomMoviesByUserGenres() {
    return axios.get("/movies/random")
  },

  updateMovieLikeStatus(movieId, status) {
    return axios.put(`/movies/${movieId}/like`, null, {
      params: { status: status }
    })
  },

  createNewMovie() {
    return axios.post("/movie")
  },

  updateMovieFavoriteStatus(movieId, favorited) {
    return axios.put(`/movies/${movieId}/favorite`, null, {
      params: { favorited: favorited }
    })
  },

  getFavorites() {
    return axios.get("/favorites");
  },

  getFavoriteGenres() {
    return axios.get("/favorites/genres");
  },

  getLikes(movieId) {
    return axios.get(`/movies/${movieId}/totalLikes`);
  },

  getDislikes(movieId) {
    return axios.get(`/movies/${movieId}/totalDislikes`);
  },

  getIndifferents(movieId) {
    return axios.get(`/movies/${movieId}/totalIndifferents`);
  }

}