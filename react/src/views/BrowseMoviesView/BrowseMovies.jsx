import { mockMovies } from "./mockMovies";
import { useState } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./BrowseMovies.module.css";
export default function BrowseMovies() {
    
    const movies = mockMovies.results; //change backend data here

    function handleFavorite(movie){
        //TODO:  FAVORITES (POST/DELETE)
        console.log("favorite", movie_id);
    }

    function handleVote(movie,vote){
        //TODO:  RATING
        console.log("vote", movie_id, vote);
    }

    return (
        <div id="browse-movie" className={styles.wrapper}>
            
                  <h2 className={styles.title}>Movie Recommendation Just For You</h2>

            <div className={styles.movieGrid}>
                {mockMovies.results.map(movie => (    //change backend data here
                    <MovieCard 
                    key={movie.id} 
                    movie={movie}
                    onFavorite={handleFavorite}
                    onVote={handleVote}
                     />
                ))}
            </div>
        </div>
    );
}