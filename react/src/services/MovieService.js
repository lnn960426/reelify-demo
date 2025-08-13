import axios from 'axios';

export default {

  getRandomMoviesByUserGenres() {
    return axios.get("/movies/random")
  },

  addFavoriteMovie(movieId){
    return axios.post("/favorite")
  }

}