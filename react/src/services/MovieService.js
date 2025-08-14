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
  
  
  createNewMovie(){
    return axios.post("/movie")
  },


getAllUsers(){
  return axios.get("admin/users");
},


createNewMovie(movieData) {
  return axios.post("/admin/movie", movieData);
},
}