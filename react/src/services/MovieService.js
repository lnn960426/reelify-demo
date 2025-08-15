import axios from 'axios';

export default {

  getRandomMoviesByUserGenres(userId) {
    return axios.get("/movies/random", {
      params: { userId: userId }
    });
  },

  updateMovieLikeStatus(movieId, status) {
    return axios.put(`/movies/${movieId}/like`, null, {
      params: { status: status } 
    });
  },
  
  
  createNewMovie(movieData){
    return axios.post("/movie", movieData);
    headers: { Authorization: `Bearer ${token}` }
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
}


}