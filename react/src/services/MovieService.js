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


// New admin methods
  
  /**
   * Add selected movies to a specific user's site
   * @param {string} userId - The ID of the user to add movies to
   * @param {Array} movieIds - Array of movie IDs to add
   * @returns {Promise} Axios response
   */
  addMoviesToUserSite(userId, movieIds) {
    return axios.post("/admin/add-movies-to-user", {
      userId: userId,
      movieIds: movieIds
    });
  },

  /**
   * Alternative method - Add a single movie to a user's site
   * @param {string} userId - The ID of the user
   * @param {string} movieId - The ID of the movie to add
   * @returns {Promise} Axios response
   */
  addMovieToUserSite(userId, movieId) {
    return axios.post(`/admin/add-movie-to-user/${userId}/${movieId}`);
  },

  /**
   * Remove movies from a user's site
   * @param {string} userId - The ID of the user
   * @param {Array} movieIds - Array of movie IDs to remove
   * @returns {Promise} Axios response
   */
  removeMoviesFromUserSite(userId, movieIds) {
    return axios.delete("/admin/remove-movies-from-user", {
      data: {
        userId: userId,
        movieIds: movieIds
      }
    });
  },

  /**
   * Get movies currently on a specific user's site
   * @param {string} userId - The ID of the user
   * @returns {Promise} Axios response with user's movies
   */
  getUserMovies(userId) {
    return axios.get(`/admin/user-movies/${userId}`);
  },

  /**
   * Get all movies from the database (for admin management)
   * @returns {Promise} Axios response with all movies
   */
  getAllMovies() {
    return axios.get("/admin/movies");
  },

  /**
   * Search movies by criteria (for admin)
   * @param {Object} searchParams - Search parameters (title, genre, year, etc.)
   * @returns {Promise} Axios response with matching movies
   */
  searchMovies(searchParams) {
    return axios.get("/admin/movies/search", {
      params: searchParams
    });
  }
};


