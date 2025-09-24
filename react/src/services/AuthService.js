import api from './api';

/**
 * This service class is used to interact with the server's Authentication API.
 * All methods return a Promise so that the calling code can handle both success and
 * error responses appropriately.
 */
export default {

  login(user) {
    return api.post('/login', user);
  },

  register(user) {
    return api.post('/register', user);
  },

  getUserProfile(userId) {
    return api.get(`/users/${userId}`);
  },

  getAllUsers() {
    return api.get('/users');
  },

  // Delete a user by ID (admin only)
  deleteUser(userId) {
    return api.delete(`/users/${userId}`);
  }

};
