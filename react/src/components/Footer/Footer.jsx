
import styles from './Footer.module.css';
export default function Footer() {
    return (

        <footer className={styles.footer}>
            <div className={styles.footerStyle}>
                <hr />
                <p className={styles.content}>© 2025 Reelify. All rights reserved.</p>
                <p className={styles.content}>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            </div>
        </footer>
    );
}