import MovieService from "../../services/MovieService";
import { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./BrowseMovies.module.css";
import { UserContext } from "../../context/UserContext"
export default function BrowseMovies() {
    
    const [movies, setMovies] = useState([]);
    const [isLoading,setLoading] = useState(true);

    useEffect(() => {
        MovieService.getRandomMoviesByUserGenres()
            .then(response => {
                setMovies(response.data)
            })
            .catch(error => {
                console.log("Error Fetching Movies: ", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if(isLoading) {
       return <p>Loading........</p>
    }


    return (
        <div id="browse-movie" className={styles.wrapper}>
            
                  <h2 className={styles.title}>Movie Recommendation Just For You</h2>

            <div className={styles.movieGrid}>
                {movies.map(movie => (   
                    <MovieCard 
                    key={movie.id} 
                    movie={movie}
                     />
                ))}
            </div>
        </div>
    );
}