import MovieService from "../../services/MovieService";
import { useState, useEffect } from "react";
import styles from "./AdminAddMovies.module.css";
import { NavLink } from "react-router-dom";
import AdminAccountManagement from "../AdminAccountManagement/AdminAccountManagement";

export default function AdminAddMovies() {

  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [poster_path, setPosterPath] = useState('');
  const [release_date, setReleaseDate] = useState('');
  const [vote_average, setVoteAverage] = useState(null);
  const [genre_ids, setGenreIds] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  function handleChange(event) {
    let selectedValues = Array.from(event.target.selectedOptions).map(option => parseInt(option.value));
    setGenreIds(selectedValues);
  }

  function handleSubmit(event) {
    event.preventDefault();

    MovieService.createNewMovie({
      title,
      overview,
      poster_path,
      release_date,
      vote_average,
      genre_ids
    })
    .then(() => {
      console.log("Movie added");
    }).catch((error) => {
      // Handle different error scenarios
    if (error.response?.status === 400) {
      setMessage({ type: 'error', text: 'Invalid movie data. Please check your inputs.' });
    } else if (error.response?.status === 409) {
      setMessage({ type: 'error', text: 'Movie already exists in the database.' });
    } else {
      setMessage({ type: 'error', text: 'Failed to add movie. Please try again.' });
    }
    })
  }



  return (

    <>
      <header>
        <NavLink
          to="/admin/account-management"
          className={({ isActive }) =>
            isActive ? `${styles.linkButton} ${styles.active}` : styles.linkButton
          }
        >
          Account Management
        </NavLink>
      </header>


      <div className="container">
        <div className={styles.header}>
          <h1>Movie Admin Panel</h1>
          <p>Add a new movie to the database</p>

        </div>


        <div className={styles.formContainer}>
          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Movie Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="overview">Overview</label>
              <textarea
                id="overview"
                name="overview"
                value={overview}
                onChange={(event) => setOverview(event.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="posterPath">Poster Path</label>
              <input
                type="text"
                id="posterPath"
                name="posterPath"
                value={poster_path}
                onChange={(event) => setPosterPath(event.target.value)}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="releaseDate">Release Date</label>
                <input
                  type="date"
                  id="releaseDate"
                  name="releaseDate"
                  value={release_date}
                  onChange={(event) => setReleaseDate(event.target.value)}
                />

              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="voteAverage">Vote Average</label>
              <input
                type="number"
                step="0.1"
                id="voteAverage"
                name="voteAverage"
                value={vote_average}
                onChange={(event) => setVoteAverage(parseFloat(event.target.value))}

              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="genreId">Genre IDs</label>
              <select
                id="genreId"
                name="ids"
                multiple
                size={8}
                className={styles.idSelect}
                value={genre_ids}
                onChange={handleChange}
              >
                <option value="28">Action</option>
                <option value="12">Adventure</option>
                <option value="16">Animation</option>
                <option value="35">Comedy</option>
                <option value="80">Crime</option>
                <option value="99">Documentary</option>
                <option value="18">Drama</option>
                <option value="10751">Family</option>
                <option value="14">Fantasy</option>
                <option value="36">History</option>
                <option value="27">Horror</option>
                <option value="10402">Music</option>
                <option value="9648">Mystery</option>
                <option value="10749">Romance</option>
                <option value="878">Science Fiction</option>
                <option value="10770">TV Movie</option>
                <option value="53">Thriller</option>
                <option value="10752">War</option>
                <option value="37">Western</option>
              </select>
            </div>
            <div className={styles.btnContainer}>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                Add Movie
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

}