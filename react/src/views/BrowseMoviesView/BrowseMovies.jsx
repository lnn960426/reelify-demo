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

    useEffect(() => {
        MovieService.getRandomMoviesByUserGenres()
            .then(response => {
                setMovies(response.data)
            })
            .catch(error => {
                console.log("Error Fetching Movies: ", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    function handleRefresh() {
        setLoading(true);
        MovieService.getRandomMoviesByUserGenres()
            .then(response => {
                setMovies(response.data)
            })
            .catch(error => {
                console.log("Error Fetching Movies: ", error);
            })
            .finally(() => {
                setLoading(false);
                window.scrollTo(0, 0)
            });
    }

    function handleSearchSubmit(searchQuery) {

        //if the user type in empty keyword to search, it will only refresh the page
        const keyword = (searchQuery || "").trim();
        if (!keyword) {
            handleRefresh();
            return;
        }

        setLoading(true);
        MovieService.searchMoviesByTitle(keyword) //make sure the method name matches
            .then(res => setMovies(res.data))
            .catch(err => console.log("Search error:", err))
            .finally(() => setLoading(false));
    }

    if (isLoading) {
        return <p>Loading........</p>
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