import MovieService from "../../services/MovieService";
import { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./BrowseMovies.module.css";
import { UserContext } from "../../context/UserContext"
import refreshButton from "../../assets/RefreshButton.svg";
import SearchBar from "../../components/SearchBar/SearchBar";

export default function BrowseMovies() {

    const [movies, setMovies] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [userVotes, setUserVotes] = useState({});

    const voteMap = { "1": "like", "0": "meh", "-1": "dislike" };

    useEffect(() => {
        fetchMovies();
    }, []);

    function fetchMovies() {
        setLoading(true);
        MovieService.getRandomMoviesByUserGenres()
            .then(response => {
                const movieList = response.data;
                setMovies(movieList);

                const movieIds = movieList.map(m => m.id);
                if (movieIds.length > 0) {
                    MovieService.getMovieLikeStatuses(movieIds)
                        .then(voteRes => {
                            const mappedVotes = {};
                            for (const [id, voteValue] of Object.entries(voteRes.data)) {
                                mappedVotes[id] = voteMap[String(voteValue)] ?? null;
                            }
                            setUserVotes(mappedVotes);
                        })
                        .catch(err => console.error("Failed to fetch user votes:", err));
                }
            })
            .catch(error => {console.log("Error Fetching Movies: ", error)})
            .finally(() => {setLoading(false)});
    }

    function handleRefresh() {
        fetchMovies();
        window.scrollTo(0, 0);
    }

    function handleSearchSubmit(searchQuery) {
        const keyword = (searchQuery || "").trim();
        if (!keyword) {
            handleRefresh();
            return;
        }

        setLoading(true);

        MovieService.getMovieByTitleSearch(keyword)
            .then(res => {
                const movieList = res.data || [];
                setMovies(movieList);

                const movieIds = movieList.map(m => m.id);
                if (movieIds.length > 0) {
                    MovieService.getMovieLikeStatuses(movieIds)
                        .then(voteRes => {
                            const mappedVotes = {};
                            for (const [id, voteValue] of Object.entries(voteRes.data)) {
                                mappedVotes[id] = voteMap[String(voteValue)] ?? null;
                            }
                            setUserVotes(mappedVotes);
                        })
                        .catch(err => {
                            console.error("Failed to fetch user votes:", err);
                            setUserVotes({});
                        });
                } else {
                    setUserVotes({});
                }
            })
            .catch(err => {
                console.error("Search error:", err);
                setMovies([]);
                setUserVotes({});
            })
            .finally(() => setLoading(false));
    }

    if (isLoading) {
        return (
            <div className={`container ${styles.loadingWrap}`}>
                <div className={styles.loadingBox}>
                    <div className={styles.dotSpinner}>
                        <div className={styles.dotSpinnerDot}></div>
                        <div className={styles.dotSpinnerDot}></div>
                        <div className={styles.dotSpinnerDot}></div>
                        <div className={styles.dotSpinnerDot}></div>
                        <div className={styles.dotSpinnerDot}></div>
                        <div className={styles.dotSpinnerDot}></div>
                        <div className={styles.dotSpinnerDot}></div>
                        <div className={styles.dotSpinnerDot}></div>
                    </div>
                    <p className={styles.loadingText}>Loading, please wait......</p>
                </div>
            </div>
        );
    }



    return (
        <div className="container">
            <div id="browse-movie" className={styles.wrapper}>
                <div className={styles.titleSection}>
                    <h2 className={styles.title}>Movie Recommendation Just For You</h2>
                    <SearchBar onSearch={handleSearchSubmit} />
                    <button className={styles.refreshButton} onClick={handleRefresh}>
                        <img src={refreshButton} alt="refreshButton" className={styles.icon}></img>
                        Show me more
                    </button>

                </div>


                <div className={styles.movieGrid}>
                    {movies.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            userVote={userVotes[movie.id] ?? null}
                        />
                    ))}
                </div>

                <div className={styles.footerButton}>
                    <button className={styles.refreshButton} onClick={handleRefresh}>
                        <img src={refreshButton} alt="refreshButton" className={styles.icon}></img>
                        Nothing interesting? Get a new list
                    </button>
                </div>

            </div>
        </div>
    );
}