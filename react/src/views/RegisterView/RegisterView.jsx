import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Notification from '../../components/Notification/Notification';
import art from "../../assets/register-art.svg";
import styles from './RegisterView.module.css';
import { faV } from '@fortawesome/free-solid-svg-icons';

export default function RegisterView() {
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);

  // Setup state for the registration data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState([]);

  function handleChange(event) {
    const selectedValues = Array.from(event.target.selectedOptions).map(option => option.value);
    setFavoriteGenre(selectedValues);
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Validate the form data
    if (password !== confirmPassword) {
      // Passwords don't match, so display error notification
      setNotification({ type: 'error', message: 'Passwords do not match.' });
    } else {
      // If no errors, send data to server
      AuthService.register({
        username,
        favoriteGenre,
        password,
        confirmPassword,
        role: 'user',
      })
        .then(() => {
          setNotification({ type: 'success', message: 'Registration successful' });
          navigate('/login');
        })
        .catch((error) => {
          // Check for a response message, but display a default if that doesn't exist
          const message = error.response?.data?.message || 'Registration failed.';
          setNotification({ type: 'error', message: message });
        });
    }
  }

  useEffect(() => {
    console.log(favoriteGenre);
  }, [favoriteGenre]);


  function handleRemoveGenre(g) {
    setFavoriteGenre(prev => prev.filter(x => x !== g));
  }
  return (
    <div className={styles.page}>
      <img src={art} alt="Register illustration" className={styles.art} />

    <div id="view-register" className={styles.container}>
      <h2 className={styles.title}>Register</h2>
      <p className={styles.description}>
        Explore great movies, save your favorites, and get smart suggestions based on your taste.
      </p>

      <Notification notification={notification} clearNotification={() => setNotification(null)} />

      <form onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.formControl}>
          <label htmlFor="username" className={styles.username}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            size="50"
            required
            autoFocus
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div>
          <div className={styles.genres}><label htmlFor="favoriteGenre">Favorite Genres: </label>
          </div>
            <p className={styles.tips}>
              Press Ctrl(Win) / Control(Mac) with click to select mutiple genres 
              </p>

          <select
            id="favoriteGenre"
            name="genres"
            multiple
            size={8}
            className={styles.genreSelect}
            value={favoriteGenre}
            onChange={handleChange}
          >

            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Animation">Animation</option>
            <option value="Comedy">Comedy</option>
            <option value="Crime">Crime</option>
            <option value="Documentary">Documentary</option>
            <option value="Drama">Drama</option>
            <option value="Family">Family</option>
            <option value="Fantasy">Fantasy</option>
            <option value="History">History</option>
            <option value="Horror">Horror</option>
            <option value="Music">Music</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="TV Movie">TV Movie</option>
            <option value="Thriller">Thriller</option>
            <option value="War">War</option>
            <option value="Western">Western</option>
          </select>

          <div className={styles.helper}>
            <span className={styles.count}>Currently Selected: {favoriteGenre.length}</span>
          </div>

          {favoriteGenre.length > 0 && (
            <div className={styles.chips}>
              {favoriteGenre.map(g => (
                <span key={g} className={styles.chip}
                >{g}
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => handleRemoveGenre(g)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}

        </div>


        <div className={styles.formControl}>
          <label htmlFor="password" className={styles.password}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            size="50"
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className={styles.formControl}>
          <label htmlFor="confirmPassword" className={styles.password}>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            size="50"
            required
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>

        <button type="submit" className={`btn-primary ${styles.formButton}`}>
          REGISTER
        </button>
        <p className={styles.registerText}>
          Have an account? <Link to="/login"> Log-in</Link>
        </p>
      </form>
    </div>
    </div>
  );
}

