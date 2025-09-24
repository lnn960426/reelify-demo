import api from './api';

export default {

    addGenre(genreParam) {
        return api.put(`/users/genre?genres=${encodeURIComponent(genreParam)}`);
    },

    deleteGenre(genre){
        return api.delete(`/users/genre?genre=${encodeURIComponent(genre)}`);
    }
}