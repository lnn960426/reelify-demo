import React, { useState } from "react";
import styles from "./MovieCard.module.css";
import MovieService from "../../services/MovieService";
import likeIcon from "../../assets/Like.svg";
import likeActiveIcon from "../../assets/LikeActive.svg";
import disLikeIcon from "../../assets/Dislike.svg";
import disLikeActive from "../../assets/DislikeActive.svg";
import mehIcon from "../../assets/Meh.svg";
import mehActiveIcon from "../../assets/MehActive.svg";

export default function MovieCard({ movie }) {
    const imageBase = "https://image.tmdb.org/t/p/w500";

    const [isFavorited, setIsFavorite] = useState(Boolean(movie.favoritedByUser));
    const [isVote, setIsVote] = useState(movie.myReaction ?? null);

    function handleFavorite() {
        if (isFavorited) return;
        setIsFavorite(true);

        MovieService.addFavoriteMovie(movie) //backend change here
            .then(() => {
                console.log("Added to favorite");
            })
            .catch((e) => {
                setIsFavorite(false);
                console.error("Failed to add favorite", e)
            });
    }

    function handleUnfavorite() {
        if (!isFavorited) return;
        setIsFavorite(false);

        MovieService.removeFavorite(movie.id) //backend change here
            .then(() => {
                console.log("Remove from favorite");
            })
            .catch((e) => {
                setIsFavorite(true);
                console.error("Remove favorite failed:", e);
            });
    }

    function handleVote(next) {
        let finalVote;

        if (isVote === next) {
            finalVote = null;
        } else {
            finalVote = next;
        }
        setIsVote(finalVote);

        MovieService.setVote(movie.id, finalVote) //backend change here
            .then(() => {
                console.log("You vote: ", finalVote);
            })
            .catch((e) => {

                console.error("failed to vote:", e);
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

            <div className={styles.voteBar}>
                    <button
                        className={`${styles.btn} ${styles.like} ${isVote === "like" ? styles.active : ""}`}
                        onClick={() => handleVote("like")}
                    > 
                    <img src={isVote === "like" ? likeActiveIcon : likeIcon} 
                        alt="Like" 
                        className={styles.icon}
                        />
                    </button>

                    <button
                        className={`${styles.btn} ${styles.meh} ${isVote === "meh" ? styles.active : ""}`}
                        onClick={() => handleVote("meh")}
                    > 
                     <img src={isVote === "meh" ? mehActiveIcon : mehIcon} 
                        alt="Meh" 
                        className={styles.icon}
                        />
                    </button>

                    <button
                        className={`${styles.btn} ${styles.dislike} ${isVote === "dislike" ? styles.active : ""}`}
                        onClick={() => handleVote("dislike")}
                    >
                         <img src={isVote === "dislike" ? disLikeActive : disLikeIcon} 
                        alt="Dislike" 
                        className={styles.icon}
                        />
                    </button>
                </div>

            <div className={styles.movieInfo}>
                <h3 className={styles.movieTitle}> {movie.title} </h3>
                <p className={styles.releaseDate}> Release: {movie.release_date}</p>
                <p className={styles.rating}> Rating: {movie.vote_average}</p>
                <p className={styles.movieDescription}> {movie.overview} </p>
             


                <div className={styles.favoriteBar}>
                    {isFavorited ? (
                        <button onClick={handleUnfavorite}>
                            Unfavorite
                        </button>
                    ) : (
                        <button onClick={handleFavorite}>
                            Add to Favorite
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}