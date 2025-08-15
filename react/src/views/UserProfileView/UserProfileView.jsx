import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import styles from "../UserProfileView/UserProfileView.module.css";
import ProfileMovieCard from "../../components/ProfileMovieCard/ProfileMovieCard";
import MovieService from '../../services/MovieService'; //backend change here
import { mockMovies } from '../BrowseMoviesView/mockMovies';

const ALL_GENRES = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama",
  "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance",
  "Science Fiction", "TV Movie", "Thriller", "War", "Western"]

export default function UserProfileView() {
  const { user } = useContext(UserContext);

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [interestMovies, setInterestMovies] = useState([])
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const GENRE_MAP = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
  };



  //loading favorite movie & genre
  useEffect(() => {
    MovieService.getFavorites()
    .then((response) => {
      setFavoriteMovies(response.data); 
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching favorites:", error);
      setIsLoading(false);
    });


    MovieService.getFavoriteGenres()
  .then((response) => {
    const genreNames = response.data.map(id => GENRE_MAP[id]).filter(Boolean);
    setFavoriteGenres(genreNames);
  })
  .catch((error) => {
    console.error("Error fetching favorite genres:", error);
  });
}, []);

if (isLoading) {
  return <p>Loading........</p>;
}

  function removeMovieFromList(movieId, revert = false) {
    if (revert) {
        MovieService.getFavorites().then((response) => {
            setFavoriteMovies(response.data);
        });
        return;
    }

    setFavoriteMovies((prev) => prev.filter((m) => m.id !== movieId));
}

  function handleRemoveGenre(genre) {

        // TODO: BACKEND
    setFavoriteGenres((prev) => prev.filter((g) => g !== genre)); 
  }

  function handlePickedGenres(e) {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value);
    setSelectedToAdd(values);
  }

  function handleAddSelected() {
    if (selectedToAdd.length === 0) return;
    const mergedGenres = Array.from(new Set([...favoriteGenres, ...selectedToAdd]));
        // TODO: BACKEND

    setFavoriteGenres(mergedGenres);
    setSelectedToAdd([]);
  }

  //show only available genres
  const availableToAdd = ALL_GENRES.filter((g) => !favoriteGenres.includes(g));

  return (
    <div className="container">
      <h3 className={styles.subtitleProfile}>My Profile</h3>

      <div className={styles.heroSection}>
        <div className={styles.textSection}>
          <h2>Welcome Back! {user.username}</h2>
          <p> In the mood for your favorite movies? </p>

      <div className={styles.genresHeader}>
          <h3 className={styles.subtitleGenres}> My Favorite Genres </h3>
          <button
          type="button"
          className={styles.editButton}
          onClick={() => setIsEditing((prevEditing) => !prevEditing)}
          >
            {isEditing ? "Update" : "Add"}
          </button>
          </div>

          <div className={styles.genreList}>
            {favoriteGenres.map((genre) => (
              <span key={genre} className={styles.genreChip}>
               <span className={styles.chipText}> {genre} </span>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => handleRemoveGenre(genre)}
                >
                  x
                </button>
              </span>
            ))}
          </div>

          {isEditing && (

          <div className={styles.editGenres}>
            <select
              multiple
              size={4}
              className={styles.genreSelect}
              value={selectedToAdd}
              onChange={handlePickedGenres}
            >
              {availableToAdd.map((g) => (
                <option key={g} value={g}> {g} </option>
              ))}
            </select>

            <div className={styles.helper}>
              <span className={styles.count}>
                Selected to add: {selectedToAdd.length}
                </span>
            </div>

            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddSelected}
            >
              Add
            </button>
          </div>
          )}
        </div>
      </div>
          

      <h3 className={styles.subtitleFavorite}>Favorite Movie</h3>
      <div className={styles.grid}>
        {favoriteMovies.length === 0 ? (
          <p className={styles.message}>No favorite movies yet.</p>
        ) : (
          favoriteMovies.map((movie) => (
            <ProfileMovieCard
              key={movie.id}
              movie={movie}
              onUnfavorite={removeMovieFromList}
            />
          ))
        )}
      </div>

      </div>
 

  );
}