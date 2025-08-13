import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import styles from "../UserProfileView/UserProfileView.module.css";
import ProfileMovieCard from "../../components/ProfileMovieCard/ProfileMovieCard";
import MovieService from '../../services/MovieService';
import { mockMovies } from '../BrowseMoviesView/mockMovies';

export default function UserProfileView() {
  const { user } = useContext(UserContext);

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);



  //loading favorite movie

  useEffect(() => {
    setFavoriteMovies(mockMovies.results); //backend change here
    setFavoriteGenres(["Action ", "Adventure ", "Comedy"]); //backend change here
  }, []);

  function removeMovieFromList(movieId) {
    setFavoriteMovies((currentFavoriteMovies) =>
      currentFavoriteMovies.filter(
        (movieItem) => movieItem.id !== movieId
      )
    );
  }

  return (
    <div className="container">
      <h3 className={styles.subtitleProfile}>My Profile</h3>

      <div className={styles.heroSection}>
        <div className={styles.textSection}>
          <h2>Welcome Back! {user.username}</h2>
          <p> Ready to take a rest with some of your movies? </p>
        </div>
      </div>


      <h3 className={styles.subtitleGenres}>Favorite Genres</h3>

      <div className={styles.genreList}>  
        {favoriteGenres.map((genre) => (    
            <span key={genre} className={styles.genreChip}>
              {genre}
            </span>
          ))}
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