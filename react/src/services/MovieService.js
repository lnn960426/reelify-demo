import axios from 'axios';

export default {

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

  addFavoriteMovie(movieId){
    alert(movieId)
    axios.post("/favorite", null,
    {params: {movieId:movieId}})
  }
}
