import React from "react";
import styles from "../MovieCard/MovieCard.module.css";
import MovieService from "../../services/MovieService";


export default function ProfileMovieCard({ movie, onUnfavorite }) {
    const imageBase = "https://image.tmdb.org/t/p/w500";


    function handleUnfavorite() {

        MovieService.removeFavorite(movie.id) //backend change here
            .then(() => {
                console.log("Remove from your favorite");
                onUnfavorite && onUnfavorite(movie.id);
            })
            .catch((e) => {
                console.error("Remove favorite from your list failed:", e);
            });
    }


    return (
        <div className={styles.movieCard}>
            <div className={styles.movieCardImg}>
                <img
                    className={styles.image}
                    src={imageBase + movie.poster_path}
                    alt={movie.title}
                />
            </div>


            <div className={styles.movieInfo}>
                <h3 className={styles.movieTitle}> {movie.title} </h3>
                <p className={styles.releaseDate}> Release: {movie.release_date}</p>
                <p className={styles.rating}> Rating: {movie.vote_average}</p>
                <p className={styles.movieDescription}> {movie.overview} </p>
             


                <div className={styles.favoriteBar}>
                        <button onClick={handleUnfavorite}>
                           Unfavorite
                        </button>
                </div>
            </div>
        </div>
    );
}