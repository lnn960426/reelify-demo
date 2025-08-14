import { useContext} from 'react';
import styles from './ErrorPageView.module.css';
import { UserContext } from '../../context/UserContext';

export default function HomeView() {

    const { user } = useContext(UserContext);
    return (
      <div className={styles.homeContainer}>
        <header className={styles.header}>      
           
        </header>
        
        <main className={styles.mainContent}>
        <section className={styles.displaySection}>
          <h1 className={styles.displayTitle}>
            404. <br/>
            That's an error.
          </h1>
          <p className={styles.displaySubtitle}>
            The requested URL was not found on this server. That's all we know.
          </p>
          <div className={styles.errorImg}>
          <img src="/css/404img.jpg"></img>

          </div>
        </section>
        </main>
        </div>
    )
        }