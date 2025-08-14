import MovieService from "../../services/MovieService";
import { useState, useEffect, useContext } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./AdminAddMovies.module.css";
import { UserContext } from "../../context/UserContext";



export default function AdminAddMovies() {
    
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [isLoading, setLoading] = useState(true);
    const [isUsersLoading, setUsersLoading] = useState(true);
    const [selectedMovies, setSelectedMovies] = useState(new Set());
    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState("");


    const { user } = useContext(UserContext);

    //fetching all users
    useEffect(()=>{
        MovieService.getAllUsers()
        .then(response=>{
            setUsers(response.data);
        })
        .finally(()=>{
            setUsersLoading(false);
        });
    }, []);

    //fetching all movies by user
    useEffect(() => {
        if (selectedUser) {
            setLoading(true);
            setMovies([]);

            //get movies based on users selected genre
        MovieService.getRandomMoviesByUserGenres(selectedUser)
            .then(response => {
                setMovies(response.data)
                setSelectedMovies(new Set());
            })
            .catch(error => {
                console.log("Error Fetching Movies: ", error);
                setMessage("Error loading movies for selected user");
            })
            .finally(() => {
                setLoading(false);
            });
    }
}, [selectedUser]);


    const handleAddMoviesToUser= async () => {
        if (!selectedUser || selectedMovies.size === 0){
            setMessage("Please select a user to add movies");
            return;
        }
        setIsAdding(true);
        setMessage("");
        try {
            await MovieService.addMoviesToUser(selectedUser, Array.from(selectedMovies));
            setMessage("Movies added successfully!");
            setSelectedMovies(new Set());
        } catch (error) {
            console.error("Error adding movies:", error);
            setMessage("Failed to add movies");
        } finally {
            setIsAdding(false);
        }
    };

if (isUsersLoading) {
    return <p>Loading users...</p>;
}



    return (
        //user list
        <div id="admin-add-movies" className={styles.wrapper}>
            
                  <h2 className={styles.title}>Admin: Add Movies to User Site</h2>

            <div className={styles.userSelection}>
                <label htmlFor="user-select" className = {styles.label}>
                    Select User:
                    </label>
                    <select
                    id="user-select"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className={styles.userSelect}>
                        <option value="" > -- Select a User --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name || user.username} 
                            </option>
                        ))}
                    </select>
                    </div>
                        {/*movie list*/}

                    {selectedUser && (
                <>
                    {isLoading ? (
                        <p>Loading movies...</p>
                    ) : (
                        <>
                        {/*movie selection controls*/}
                        <div className={styles.controls}>
                                <button
                                    onClick={handleAddMoviesToUser}
                                    className={styles.addBtn}
                                    disabled={movies.length === 0 || isAdding}
                                >
                                    {isAdding
                                        ? "Adding..."
                                        : `Add All ${movies.length} Movies to User Site`}
                                </button>
                            </div>
                    {/*movie cards*/}

                    <div className={styles.movieGrid}>
                                {movies.map(movie => (
                                    <div
                                        key={movie.id}
                                        className={styles.movieCardWrapper}
                                    >
                                        <MovieCard movie={movie} />
                                    </div>
                                ))}
                            </div>
                            

                            {movies.length === 0 && (
                                <p className={styles.noMovies}>
                                    No movies available for the selected user's genres.
                                </p>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    )};
