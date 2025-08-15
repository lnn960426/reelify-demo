import React from "react";
import styles from "../MovieCard/MovieCard.module.css";
import MovieService from "../../services/MovieService";


export default function ProfileMovieCard({ movie, onUnfavorite }) {
    const imageBase = "https://image.tmdb.org/t/p/w500";


    function handleUnfavorite() {

        onUnfavorite && onUnfavorite(movie.id);

    MovieService.updateMovieFavoriteStatus(movie.id, false)
        .then(() => {
            console.log("Removed from favorites");
        })
        .catch((e) => {
            console.error("Remove favorite failed:", e);
            onUnfavorite && onUnfavorite(movie.id, true);
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