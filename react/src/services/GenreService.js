import axios from 'axios';

export default{

    addGenre(genreParam){
        return axios.put(`/users/genre?genres=${genreParam}`);
    },

    deleteGenre(genre){
        return axios.delete(`/users/genre?genre=${genre}`);
    }
}