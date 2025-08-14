import { useContext } from 'react';
import styles from './HomeView.module.css';
import { UserContext } from '../../context/UserContext';
import RecommendationIcon from'../../assets/Recommendation.svg';
import ProfileIcon from '../../assets/Profile.svg';
import BrowseMoviesIcon from '../../assets/BrowseMovie.svg';
import MovieCard from '../../components/MovieCard/MovieCard';

import { mockMovies } from '../BrowseMoviesView/mockMovies';



export default function HomeView() {

  const { user } = useContext(UserContext);

  const all = Array.isArray(mockMovies?.results)
  ?mockMovies.results
  :Array.isArray(mockMovies)
  ?mockMovies
  : [];
  
  const firstFive = all.slice(0,5);

  return (

    <div id="home" className="container">

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Your taste.<br />
          Your movies.
        </h1>
        <p className={styles.heroSubtitle}>
          Smart suggestions, based on what you already enjoy!
        </p>
      </section>

      <section className={styles.features}>
        <article id="featureCard1" className={styles.featureCard}>
          <div className={styles.featureIcon}>
           <img src={RecommendationIcon} alt="Recommendation" />
          </div>

          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Recommendations</h3>
            <p className={styles.featureDescription}>
            Personalized picks curated from your genres and ratings—refreshed to match your mood
            </p>
          </div>
        </article>

        <article id="featureCard2" className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <img src={ProfileIcon} alt="Profiles" />
          </div>

          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Profiles</h3>
            <p className={styles.featureDescription}>
            Save favorites and let your profile power smarter suggestions over time
            </p>
          </div>
        </article>

        <article id="featureCard3" className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <img src={BrowseMoviesIcon} alt="BrowseMovie" />
          </div>
          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Browse Movies</h3>
            <p className={styles.featureDescription}>
            Search by genre, mood, year, or rating to quickly land on the perfect film
            </p>
          </div>
        </article>
      </section>

      <section className={styles.recommendationsSection}>
        <h2 className={styles.recommendationsTitle}>Recent Added Recommendation </h2>
        <div className={styles.movieGrid}>

        {firstFive.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaOverlay}>
          <div className={styles.ctaContent}>
            <h4 className={styles.ctaTitle}>Start Watching Smarter</h4>
            <p className={styles.ctaSubtitle}>
            Explore a curated feed of films chosen from your favorite genres—fresh titles every time you browse
            </p>
            <a href="/register" className={styles.registerBtn}>Register Now</a>
          </div>
        </div>
      </section>
    </div>

  );
};

