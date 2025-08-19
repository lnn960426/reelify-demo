import { useContext} from 'react';
import styles from './ErrorPage.module.css';
import { UserContext } from '../../context/UserContext';
import errorImage from '../../assets/404NotFound.jpg';

export default function ErrorPage() {

    const { user } = useContext(UserContext);
    return (
      <div className='container'>
        
        <main className={styles.mainContent}>
        <section className={styles.displaySection}>
          <h1 className={styles.displayTitle}>
            404.
            That's an error.
          </h1>
          <p className={styles.displaySubtitle}>
            The requested URL was not found on this server. That's all we know.
          </p>
          <div className={styles.errorImg}>
          <img src={errorImage} alt='404image' />

          </div>
        </section>
        </main>
        </div>
    )
        }