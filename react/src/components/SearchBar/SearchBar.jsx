import { useState } from "react";
import styles from "./SearchBar.module.css";
import searchIcon from "../../assets/SearchIcon.svg";

export default function SearchBar({ onSearch, id }) {
    const [searchQuery, setSearchQuery] = useState("");

    function handleInputChange(event) {
        setSearchQuery(event.target.value);
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (onSearch) onSearch(trimmedQuery);
    }

    return (
        <form className={styles.searchBar} onSubmit={handleFormSubmit}>
            <div className={styles.searchField}>
                <input
                    id={id}
                    type="text"
                    name="search"
                    placeholder="Search movie by title..."
                    className={styles.input}
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                <button type="submit" className={styles.searchBtn}>
                    <img src={searchIcon} alt="search" className={styles.searchIcon} />
                </button>
            </div>
        </form>
    );
}