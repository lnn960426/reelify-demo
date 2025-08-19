import MovieService from "../../services/MovieService";
import { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./BrowseMovies.module.css";
import refreshButton from "../../assets/RefreshButton.svg";
import SearchBar from "../../components/SearchBar/SearchBar";

export default function BrowseMovies() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [userVotes, setUserVotes] = useState({});

    const voteMap = { "1": "like", "2": "meh", "-1": "dislike" }; // 2 = meh now

    useEffect(() => {
        fetchMovies();
    }, []);

    function fetchMovies() {
        setLoading(true);

        MovieService.getRandomMoviesByUserGenres()
            .then(response => {
                const movieList = response.data || [];
                handleMovieData(movieList);
            })
            .catch(error => {
                console.error("Error fetching movies:", error);
                setMovies([]);
                setUserVotes({});
                setLoading(false);
            });
    }

    function handleMovieData(movieList) {
        const movieIds = movieList.map(m => m.id);

        Promise.all([
            movieIds.length > 0 ? MovieService.getMovieLikeStatuses(movieIds) : Promise.resolve({ data: {} }),
            movieIds.length > 0 ? MovieService.getMoviesFavoriteStatuses(movieIds) : Promise.resolve({ data: {} })
        ])
            .then(([voteRes, favRes]) => {
                const mappedVotes = {};
                for (const [id, voteValue] of Object.entries(voteRes.data)) {
                    mappedVotes[id] = voteMap[String(voteValue)] ?? null;
                }
                setUserVotes(mappedVotes);

                const moviesWithFav = movieList.map(m => ({
                    ...m,
                    favoritedByUser: !!favRes.data[m.id]
                }));

                setMovies(moviesWithFav);
            })
            .catch(err => {
                console.error("Failed to fetch votes or favorites:", err);
                setMovies(movieList);
                setUserVotes({});
            })
            .finally(() => setLoading(false));
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
                handleMovieData(movieList);
            })
            .catch(err => {
                console.error("Search error:", err);
                setMovies([]);
                setUserVotes({});
                setLoading(false);
            });
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
                    <h2 className={styles.title}>Movie Recommendations Just For You</h2>
                    <div className={styles.searchContainer}>
                        <label htmlFor="movie-search" className={styles.searchLabel}>
                            <span className={styles.searchLabelText}>
                                Looking for a<br />
                                specific movie?
                            </span>
                        </label>
                        <SearchBar id="movie-search" onSearch={handleSearchSubmit} />
                    </div>
                    <button className={styles.refreshButton} onClick={handleRefresh}>
                        <img src={refreshButton} alt="refreshButton" className={styles.icon} />
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
                        <img src={refreshButton} alt="refreshButton" className={styles.icon} />
                        Nothing interesting? Get a new list
                    </button>
                </div>
            </div>
        </div>
    );
}