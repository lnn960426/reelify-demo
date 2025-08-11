import React, { useState } from "react";
import { mockMovies } from "../../views/BrowseMoviesView/mockMovies";
import styles from "./MovieCard.module.css";

export default function MovieCard({ movie, onFavorite, onVote }) {
    const [favorite, setFavorite] = useState(false);
    const [vote, setVote] = useState(null);

    const imageBase = "https://image.tmdb.org/t/p/w500";

    function toggleFavorite(){

    }

    function setUserVote(next) {
     
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
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
                <p>Release: {movie.release_date}</p>
                <p>Rating: {movie.vote_average}</p>

                <div className="actions">

                    <div className="like-or-not">
                        <button>Like</button>
                        <button>Meh</button>
                        <button>Dislike</button>
                    </div>

                    <button>Add to Favorite</button>
                </div>
                
            </div>
        </div>
    );
}