import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import styles from "../UserProfileView/UserProfileView.module.css";
import ProfileMovieCard from "../../components/ProfileMovieCard/ProfileMovieCard";
import MovieService from '../../services/MovieService'; //backend change here
import GenreService from '../../services/GenreService';
import { mockMovies } from '../BrowseMoviesView/mockMovies';

const ALL_GENRES = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama",
  "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance",
  "Science Fiction", "TV Movie", "Thriller", "War", "Western"]

export default function UserProfileView() {
  const { user } = useContext(UserContext);

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [isEditing, setIsEditing] = useState(false);



  //loading favorite movie & genre
  useEffect(() => {
    setFavoriteMovies(mockMovies.results); //backend change here
    GenreService.getUserGenres()
      .then(response => {
        setFavoriteGenres(response.data)
      })
      .catch(error => {
        console.log("Error fetching user genres: ", error);
      })
  }, []);


  function removeMovieFromList(movieId) {

    // TODO: BACKEND
    setFavoriteMovies((currentFavoriteMovies) =>
      currentFavoriteMovies.filter(
        (movieItem) => movieItem.id !== movieId
      )
    );
  }

  function handleRemoveGenre(genre) {

    GenreService.deleteGenre(genre)
      .then(response => {
        setFavoriteGenres((prev) => prev.filter((g) => g !== genre));
      })
      .catch(error => {
        console.log("Error deleting genre: ", error);
      }); 
  }

  function handlePickedGenres(e) {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value);
    setSelectedToAdd(values);
  }

  function handleAddSelected() {
    if (selectedToAdd.length === 0) return;
    const mergedGenres = Array.from(new Set([...favoriteGenres, ...selectedToAdd]));
    const genreParam = selectedToAdd.join(",");
    GenreService.addGenre(genreParam)
      .then(response => {
        setFavoriteGenres(mergedGenres);
        setSelectedToAdd([]);
      })
      .catch(error => {
        console.log("Error adding new genres: ", error);
      })
  }

  //show only available genres
  const availableToAdd = ALL_GENRES.filter((g) => !favoriteGenres.includes(g));

  return (
    <div className="container">
      <h3 className={styles.subtitleProfile}>My Profile</h3>

      <div className={styles.heroSection}>
        <div className={styles.textSection}>
          <h2>Welcome Back! {user.username}</h2>
          <p> Ready to take a rest with some of your movies? </p>

      <div className={styles.genresHeader}>
          <h3 className={styles.subtitleGenres}> My Favorite Genres </h3>
          <button
          type="button"
          className={styles.editButton}
          onClick={() => setIsEditing((prevEditing) => !prevEditing)}
          >
            {isEditing ? "Done" : "Edit"}
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