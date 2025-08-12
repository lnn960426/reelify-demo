import axios from 'axios';

export default {

  getRandomMoviesByUserGenres() {
    return axios.get("/movies/random")
      .then(response => response.data);
  }

}