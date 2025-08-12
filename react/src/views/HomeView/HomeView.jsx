import { useContext} from 'react';
import styles from './HomeView.module.css';
import { UserContext } from '../../context/UserContext';


export default function HomeView() {

  const { user } = useContext(UserContext);
  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <nav className={styles.nav}></nav>
        <a href="/browseMovies" className={styles.navLink}>Browse Movie</a>
      

      </header>

      <main className={styles.mainContent}>
        <section className={styles.displaySection}>
          <h1 className={styles.displayTitle}>
            Your Taste<br/>
            Your Movies
          </h1>
          <p className={styles.displaySubtitle}>
            Smart suggestions, based on what you already enjoy
          </p>
        </section>
        </main>
        <section className={styles.featuresSection}>
          <div id= "featureCard1"className={styles.featureCard}>
            <div className={styles.featureIcon}>
            <img src="/css/recommendation image.png"></img>
            </div>
            <h3 className={styles.featureTitle}>Recommendations</h3>
            <p className={styles.featureDescription}>
              Get movie suggestions based on your favorite genres
            </p>
          </div>

          <div id= "featureCard2" className={styles.featureCard}>
            <div className={styles.featureIcon}>
            <img src="/css/profile icon.png"/>

            </div>
            <h3 className={styles.featureTitle}>Profiles</h3>
            <p className={styles.featureDescription}>
              Create an account to save your preferences and favorites
            </p>
          </div>

          <div id= "featureCard3" className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <img src="/css/browse movie icon.jpg" />
            </div>
            <h3 className={styles.featureTitle}>Browse Movies</h3>
            <p className={styles.featureDescription}>
              View films that match your taste
            </p>
          </div>
        </section>
      </div>
  );
};

