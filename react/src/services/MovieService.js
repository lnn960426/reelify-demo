import axios from 'axios';

export default {

  getMovieByTitleSearch(title){
    return axios.get(`/movies/movie?title=${title}`, null,
    {params: { title: title}})
  },

  getRandomMoviesByUserGenres() {
    return axios.get("/movies/random")
  },

  updateMovieLikeStatus(movieId, status) {
    axios.put(`/movies/${movieId}/like`, null, {
      params: { status: status } 
    })
  },
  
  createNewMovie(){
    return axios.post("/movie")
  },

  updateMovieFavoriteStatus(movieId, favorited) {
    axios.put(`/movies/${movieId}/favorite`, null, {
      params: { favorited: favorited } 
    })
  },

  getFavorites() {
    return axios.get("/favorites");
  },

  getNumberLikes(movieId) {
    return axios.get(`/movies/${movieId}/totalLikes`, null, {
      params: {movieId : movieId}
    })
  },

  getNumberLikes(movieId) {
    return axios.get(`/movies/${movieId}/totalDislikes`, null, {
      params: {movieId : movieId}
    })
  },

  getNumberIndifferents(movieId) {
    return axios.get(`/movies/${movieId}/totalIndifferents`, null, {
      params: {movieId : movieId}
    })
  }

}
