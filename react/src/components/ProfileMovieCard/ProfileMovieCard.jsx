import React, { useState, useEffect } from "react";
import styles from "../MovieCard/MovieCard.module.css";
import MovieService from "../../services/MovieService";
import defaultPoster from "../../assets/movieDefaultPoster.jpg";

import likeIcon from "../../assets/Like.svg";
import likeActiveIcon from "../../assets/LikeActive.svg";
import disLikeIcon from "../../assets/Dislike.svg";
import disLikeActive from "../../assets/DislikeActive.svg";
import mehIcon from "../../assets/Meh.svg";
import mehActiveIcon from "../../assets/MehActive.svg";

export default function ProfileMovieCard({ movie, onUnfavorite }) {
    const imageBase = "https://image.tmdb.org/t/p/w500";

    const [isVote, setIsVote] = useState(null);
    const [counts, setCounts] = useState({ like: 0, meh: 0, dislike: 0 });

    function fetchCounts() {
        Promise.all([
            MovieService.getLikes(movie.id),
            MovieService.getIndifferents(movie.id),
            MovieService.getDislikes(movie.id)
        ])
            .then(([likesRes, mehsRes, dislikesRes]) => {
                setCounts({
                    like: likesRes.data ?? 0,
                    meh: mehsRes.data ?? 0,
                    dislike: dislikesRes.data ?? 0
                });
            })
            .catch((err) => {
                console.error("Failed to fetch counts:", err);
                setCounts({ like: 0, meh: 0, dislike: 0 });
            });
    }

    function fetchVoteStatus() {
        MovieService.getMovieLikeStatuses([movie.id])
            .then((res) => {
                const status = res.data[movie.id];
                if (status === 1) setIsVote("like");
                else if (status === -1) setIsVote("dislike");
                else if (status === 2) setIsVote("meh");
                else setIsVote(null);
            })
            .catch((err) => {
                console.error("Failed to fetch vote status:", err);
                setIsVote(null);
            });
    }

    useEffect(() => {
        fetchCounts();
        fetchVoteStatus();
    }, [movie.id]);

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

    function handleVote(next) {
        const prevVote = isVote;
        const finalVote = prevVote === next ? null : next;
        setIsVote(finalVote);

        const statusMap = { like: 1, meh: 2, dislike: -1, null: null };
        const statusValue = finalVote == null ? null : statusMap[finalVote];

        MovieService.updateMovieLikeStatus(movie.id, statusValue)
            .then(() => {
                fetchCounts();
            })
            .catch((e) => {
                console.error("Failed to vote:", e);
                setIsVote(prevVote); 
            });
    }

    return (
        <div className={styles.movieCard}>
            <div className={styles.movieCardImg}>
                <img
                    className={styles.image}
                    src={movie.poster_path ? `${imageBase}${movie.poster_path}` : defaultPoster}
                    alt={movie.title}
                    onError={(e) => (e.target.src = defaultPoster)}
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
                    <img src={isVote === "meh" ? mehActiveIcon : mehIcon} alt="Meh" className={styles.icon} />
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
                    <button onClick={handleUnfavorite}>
                        Unfavorite
                    </button>
                </div>
            </div>
        </div>
    );
}