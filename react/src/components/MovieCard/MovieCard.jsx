import React, { useState } from "react";
import styles from "./MovieCard.module.css";
import MovieService from "../../services/MovieService";
import likeIcon from "../../assets/Like.svg";
import likeActiveIcon from "../../assets/LikeActive.svg";
import disLikeIcon from "../../assets/Dislike.svg";
import disLikeActive from "../../assets/DislikeActive.svg";
import mehIcon from "../../assets/Meh.svg";
import mehActiveIcon from "../../assets/MehActive.svg";
import defaultPoster from "../../assets/movieDefaultPoster.jpg"

export default function MovieCard({ movie }) {
    const imageBase = "https://image.tmdb.org/t/p/w500";

    const [isFavorited, setIsFavorite] = useState(Boolean(movie.favoritedByUser));
    const [isVote, setIsVote] = useState(movie.myReaction ?? null);

    const [counts, setCounts] = useState({
        like: movie.likeCount ?? movie.reactions?.like ?? 0,
        meh: movie.mehCount ?? movie.reactions?.meh ?? 0,
        dislike: movie.dislikeCount ?? movie.reactions?.dislike ?? 0,
    });

    function handleFavorite() {
        if (isFavorited) return;
        setIsFavorite(true);

        MovieService.updateMovieFavoriteStatus(movie.id, true)
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

        MovieService.updateMovieFavoriteStatus(movie.id, false)
            .then(() => {
                console.log("Remove from favorite");
            })
            .catch((e) => {
                setIsFavorite(true);
                console.error("Remove favorite failed:", e);
            });
    }

    function handleVote(next) {
        const prevVote = isVote;
        const finalVote = prevVote === next ? null : next;

        setIsVote(finalVote);

        setCounts((prevCounts) => {
            const nextCounts = { ...prevCounts };
            if (prevVote) nextCounts[prevVote] = Math.max(0, nextCounts[prevVote] - 1);
            if (finalVote) nextCounts[finalVote] = (nextCounts[finalVote] ?? 0) + 1;
            return nextCounts;
        });


        const statusMap = {
            like: 1,
            meh: 0,
            dislike: -1,
            null: null
        };

        const statusValue = finalVote == null ? null : statusMap[finalVote];

        MovieService.updateMovieLikeStatus(movie.id, statusValue)
            .then(() => {
                console.log("You vote: ", finalVote);
            })
            .catch((e) => {
                console.error("failed to vote:", e);
                setIsVote(prevVote);
                setCounts((prevCounts) => {
                    const nextCounts = { ...prevCounts };
                    if (finalVote) nextCounts[finalVote] = Math.max(0, nextCounts[finalVote] - 1);
                    if (prevVote) nextCounts[prevVote] = (nextCounts[prevVote] ?? 0) + 1;
                    return nextCounts;
                })
            });
    }

    return (
        <div className={styles.movieCard}>
            <div className={styles.movieCardImg}>
                <img
                    className={styles.image}
                    src={movie.poster_path ? `${imageBase}${movie.poster_path}` : defaultPoster}
                    alt={movie.title}
                    onError={(e) => e.target.src = defaultPoster}
                />
            </div>

            <div className={styles.voteBar}>
                <button
                    className={`${styles.btn} ${styles.like} ${isVote === "like" ? styles.active : ""}`}
                    onClick={() => handleVote("like")}
                >
                    <img src={isVote === "like" ? likeActiveIcon : likeIcon} alt="Like" className={styles.icon} />
                    <span className={styles.count}> {counts.like > 0 ? counts.like : ""}</span>
                </button>

                <button
                    className={`${styles.btn} ${styles.meh} ${isVote === "meh" ? styles.active : ""}`}
                    onClick={() => handleVote("meh")}
                >
                    <img src={isVote === "meh" ? mehActiveIcon : mehIcon}  alt="Meh" className={styles.icon} />
                    <span className={styles.count}> {counts.meh > 0 ? counts.meh : ""}</span>
                </button>

                <button
                    className={`${styles.btn} ${styles.dislike} ${isVote === "dislike" ? styles.active : ""}`}
                    onClick={() => handleVote("dislike")}
                >
                    <img src={isVote === "dislike" ? disLikeActive : disLikeIcon} alt="Dislike" className={styles.icon} />
                    <span className={styles.count}> {counts.dislike > 0 ? counts.dislike : ""}</span>
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