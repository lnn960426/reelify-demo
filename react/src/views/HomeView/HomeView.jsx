import { useContext} from 'react';
import styles from './HomeView.module.css';
import { UserContext } from '../../context/UserContext';


export default function HomeView() {

  const { user } = useContext(UserContext);
  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>      
      <a href="/admin/Add-Movies" className={styles.AddMoviesBtn}>Add Movies
      <a href="/errorPage" className={styles.ErrorPage}>Error Page</a>
    
    </a>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.displaySection}>
          <h1 className={styles.displayTitle}>
            Your Taste<br/>
            Your Movies
          </h1>
          <p className={styles.displaySubtitle}>
            Smart suggestions, based on what you already enjoy!
          </p>
        </section>
        </main>
        <section className={styles.featuresSection}>
          <div id= "featureCard1"className={styles.featureCard}>
            <div className={styles.featureIcon}>
            <img src="/css/recommendation image.png"></img>
            </div>
            <div className={styles.featureContent}>

            <h3 className={styles.featureTitle}>Recommendations</h3>
            <p className={styles.featureDescription}>
              Get movie suggestions based on your favorite genres
            </p>
          </div>
          </div>

          <div id= "featureCard2" className={styles.featureCard}>
            <div className={styles.featureIcon}>
            <img src="/css/profile icon.png"/>

            </div>
            <div className={styles.featureContent}>

            <h3 className={styles.featureTitle}>Profiles</h3>
            <p className={styles.featureDescription}>
              Create an account to save your preferences and favorites
            </p>
          </div>
          </div>

          <div id= "featureCard3" className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <img src="/css/browse movie icon.jpg" />
            </div>
            <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Browse Movies</h3>
            <p className={styles.featureDescription}>
              View films that match your taste
            </p>
          </div>
          </div>
          </section>
        <section className={styles.recommendationsSection}>
        <h3
                className={styles.recommendationsTitle}>Recent Added Recommendation
              </h3> 
              <div className={styles.movieGrid}></div>

  
        </section>
        <section className={styles.ctaSection}>
          <div className={styles.ctaOverlay}>
            <div className={styles.ctaContent}>
              <h4 className={styles.ctaTitle}>Start Watching Smarter</h4>
              <p className={styles.ctaSubtitle}>
                Explore great movies, save your favorites, and get smart suggestions based on your taste.
              </p>
              <a href="/register" className={styles.registerBtn}>Register Now
    
              </a>
            </div>
          </div>
          
        </section>
        

      </div>

  );
};

