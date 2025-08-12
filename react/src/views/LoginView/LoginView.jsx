import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthService from '../../services/AuthService';
import Notification from '../../components/Notification/Notification';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import art from "../../assets/signin-art.svg";
import styles from './LoginView.module.css';
export default function LoginView() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  // Setup state for the registration data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    AuthService.login({ username, password })
      .then((response) => {
        // Grab the user and token
        const user = response.data.user;
        const token = response.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Add the login data to local storage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        // Use the provided setter to add user to context
        setUser(user);

        // Navigate to the home page
        navigate('/');
      })
      .catch((error) => {
        // Check for a response message, but display a default if that doesn't exist
        const message = error.response?.data?.message || 'Login failed.';
        setNotification({ type: 'error', message: message });
      });
  }

  return (
    <div className={styles.page}>
    <img src={art} alt="Register illustration" className={styles.art} />

    <div id="view-login" className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <p className={styles.description}>
      Explore great movies, save your favorites, and get smart suggestions based on your taste. 
      </p>

      <Notification notification={notification} clearNotification={() => setNotification(null)} />

      <form onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.formControl}>
          <label htmlFor="username" className={styles.username}>Username:</label>
          <input type="text"
            id="username"
            value={username}
            required
            autoFocus
            autoComplete="username"
            onChange={event => setUsername(event.target.value)}
          />
        </div>

        <div className={styles.formControl}>
          <label htmlFor="password" className={styles.password}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            required
            onChange={event => setPassword(event.target.value)} />
        </div>

        <button type="submit" className={`btn-primary ${styles.formButton}`}>
         LOGIN
        </button>
        <p className={styles.registerText}>
          forgot password? <Link to="/forgotPassword"> Reset your password</Link>
        </p>
        <p className={styles.registerText}>
          New? <Link to="/register"> Register here!</Link>
        </p>
      </form>

    </div>
    </div>

  );
}
