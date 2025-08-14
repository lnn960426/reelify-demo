import axios from 'axios';

export default {

  getRandomMoviesByUserGenres() {
    return axios.get("/movies/random")
  },

  createNewMovie(){
    return axios.post("/movie")
  },

  addFavoriteMovie(movieId){
    axios.post('/user', {
      movieId : movieId
    })
      
  }
}
