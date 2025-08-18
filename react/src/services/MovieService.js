import axios from 'axios';

export default {

<<<<<<< HEAD
  getRandomMoviesByUserGenres(userId) {
    return axios.get("/movies/random", {
      params: { userId: userId }
    });
=======
  getMovieByTitleSearch(title){
    return axios.get(`/movies/search/${title}`, null,
    {params: { title: title}})
  },

  getRandomMoviesByUserGenres() {
    return axios.get("/movies/random")
>>>>>>> 48b4ad9b34d4c72242ff5e559a9d3adf029af549
  },

  updateMovieLikeStatus(movieId, status) {
    return axios.put(`/movies/${movieId}/like`, null, {
      params: { status: status }
    })
  },

  createNewMovie(movieData) {
    return axios.post("/movie", movieData);
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

<<<<<<< HEAD

}
=======
}
>>>>>>> 48b4ad9b34d4c72242ff5e559a9d3adf029af549
