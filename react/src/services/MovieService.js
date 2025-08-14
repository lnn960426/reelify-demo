import axios from 'axios';

export default {

  getRandomMoviesByUserGenres() {
    return axios.get("/movies/random")
  },

  addFavoriteMovie(movieId){
    axios.post('/user', {
      movieId : movieId
    })
      
  }
}
