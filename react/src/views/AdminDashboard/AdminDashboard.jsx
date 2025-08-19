import { useState } from "react";
import styles from './AdminDashboard.module.css';

import AdminAddMovies from '../AdminAddMovies/AdminAddMovies';
import AdminAccountManagement from '../AdminAccountManagement/AdminAccountManagement';

export default function AdminDashboard() {
    const [tab, setTab] = useState('movies');

    return (
        <div className={styles.wrap}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}> Admin Dashboard</h2>

                <div className={styles.tabs}>

                    <button
                        className={`${styles.tabBtn} ${tab === 'movies' ? styles.active : ''}`}
                        onClick={() => setTab('movies')}
                    >
                        Movie Management
                    </button>

                    <button
                        className={`${styles.tabBtn} ${tab === 'user' ? styles.active : ''}`}
                        onClick={() => setTab('user')}
                    >
                        User Management
                    </button>
                </div>
            </div>

            <div className={styles.panel}>
                {tab === 'movies' ? <AdminAddMovies /> : <AdminAccountManagement />}
            </div>
        </div>
    );
}