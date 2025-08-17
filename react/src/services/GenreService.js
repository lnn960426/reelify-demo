import axios from 'axios';

export default{

    getUserGenres(){
        return axios.get("/users/genre");
    },

    addGenre(genreParam){
        return axios.put(`/users/genre?genres=${genreParam}`);
    },

    deleteGenre(genre){
        return axios.delete(`/users/genre?genre=${genre}`);
    }
}