import axios from 'axios';

export default {

  getRandomMoviesByUserGenres(userId) {
    return axios.get("/movies/random", {
      params: { userId: userId }
    });
  },


    
  getMovieByTitleSearch(title){
    return axios.get(`/movies/search/${title}`, null,
    {params: { title: title}})
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


}

