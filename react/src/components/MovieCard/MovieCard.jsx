import React, { useState, useEffect, useContext } from "react";
import styles from "./MovieCard.module.css";
import MovieService from "../../services/MovieService";
import likeIcon from "../../assets/Like.svg";
import likeActiveIcon from "../../assets/LikeActive.svg";
import disLikeIcon from "../../assets/Dislike.svg";
import disLikeActive from "../../assets/DislikeActive.svg";
import mehIcon from "../../assets/Meh.svg";
import mehActiveIcon from "../../assets/MehActive.svg";
import defaultPoster from "../../assets/movieDefaultPoster.jpg"
import { UserContext } from "../../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function MovieCard({ movie, requireAuthForActions = false }) {

    const { user } = useContext(UserContext);
    const authedUser = Boolean(user?.token || user?.id || user?.username);
    const navigate = useNavigate();
    const location = useLocation();
    const gate =() => {
        if(requireAuthForActions && !authedUser){
            navigate("/register", {state: {from:location.pathname + location.search}});
            return true;
        }
        return false;
    };

    const imageBase = "https://image.tmdb.org/t/p/w500";

    const [isFavorited, setIsFavorite] = useState(Boolean(movie.favoritedByUser));
    const [isVote, setIsVote] = useState(movie.myReaction ?? null);

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

    useEffect(() => {
        fetchCounts(); 
    }, [movie.id]);

    function handleFavorite() {
        if(gate()) return;
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
        if(gate()) return;
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
        if(gate()) return;
        const prevVote = isVote;
        const finalVote = prevVote === next ? null : next;
        setIsVote(finalVote);
    
        const statusMap = { like: 1, meh: 0, dislike: -1, null: null };
        const statusValue = finalVote == null ? null : statusMap[finalVote];
    
        MovieService.updateMovieLikeStatus(movie.id, statusValue)
            .then(() => {
                Promise.all([
                    MovieService.getLikes(movie.id),
                    MovieService.getIndifferents(movie.id),
                    MovieService.getDislikes(movie.id)
                ])
                .then(([likesRes, mehsRes, dislikesRes]) => {
                    setCounts({
                        like: likesRes.data,
                        meh: mehsRes.data,
                        dislike: dislikesRes.data
                    });
                })
                .catch((err) => {
                    console.error("Failed to fetch updated counts:", err);
                });
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