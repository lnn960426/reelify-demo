import MovieService from "../../services/MovieService";
import { useState } from "react";
import styles from "./AdminAddMovies.module.css";

export default function AdminAddMovies() {
  
        const [formData, setFormData] = useState({
          title: "",
          overview: "",
          posterPath: "",
          releaseDate: "",
          voteAverage: ""
        });
      
        const [message, setMessage] = useState({ type: "", text: "" });
      
        //updates changed fields
        const handleInputChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({
            ...prev,
            [name]: value
          }));
        };
      
        const handleSubmit = async (e) => {
          e.preventDefault(); //prevent page refresh when submitting, will refresh after 2 seconds
      
          try {
            const movieData = {
              title: formData.title.trim(),
              overview: formData.overview.trim() || null,
              poster_path: formData.posterPath.trim() || null,
              release_date: formData.releaseDate || null,
              vote_average: formData.voteAverage ? parseFloat(formData.voteAverage) : null,

            };
      //Calls service function to send the movie data to the backend.
            await MovieService.createNewMovie(movieData);
      
            setMessage({ type: "success", text: "Movie added successfully!" });
            setTimeout(()=>{
            resetForm();
                }, 2000); //wait 2 secs before refreshing
      } catch (error) {
        console.error('Error adding movie:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 400) {
        setMessage({ type: 'error', text: 'Invalid movie data. Please check your inputs.' });
      } else if (error.response?.status === 409) {
        setMessage({ type: 'error', text: 'Movie already exists in the database.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to add movie. Please try again.' });
      }
    }
  };
      
        const resetForm = () => {
          setFormData({
            title: "",
            overview: "",
            posterPath: "",
            releaseDate: "",
            voteAverage: ""
          });
        };
      
        return (
        
          <div className="container">
            <div className={styles.header}>
              <h1>Movie Admin Panel</h1>
              <p>Add a new movie to the database</p>
        <Link to="/admin/users" className={styles.linkButton}>
          Manage Users
        </Link>
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
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
      
                <div className={styles.formGroup}>
                  <label htmlFor="overview">Overview</label>
                  <textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                  />
                </div>
      
                <div className={styles.formGroup}>
                  <label htmlFor="posterPath">Poster Path</label>
                  <input
                    type="text"
                    id="posterPath"
                    name="posterPath"
                    value={formData.posterPath}
                    onChange={handleInputChange}
                  />
                </div>
      
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="releaseDate">Release Date</label>
                    <input
                      type="date"
                      id="releaseDate"
                      name="releaseDate"
                      value={formData.releaseDate}
                      onChange={handleInputChange}
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
                      value={formData.voteAverage}
                      onChange={handleInputChange}
                    
                    />
                  </div>
                 
                
      
                <div className={styles.btnContainer}>
                  <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                    Add Movie
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={resetForm}
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
              };
    