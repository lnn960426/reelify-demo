BEGIN TRANSACTION;

DROP TABLE IF EXISTS users, movie, users_movie, genre, movie_genre, users_genre;



CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	password_hash VARCHAR(200) NOT NULL,
	role VARCHAR(50) NOT NULL
);

CREATE TABLE genre (
	genre_id INT PRIMARY KEY,
	name VARCHAR(32) NOT NULL
);

CREATE TABLE movie (
    movie_id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    overview TEXT,
    poster_path VARCHAR(100),
    release_date DATE,
    vote_average NUMERIC
);

CREATE TABLE movie_genre (
	movie_id INT NOT NULL,
	genre_id INT NOT NULL,
	PRIMARY KEY (movie_id, genre_id),
	FOREIGN KEY (movie_id) REFERENCES movie (movie_id),
	FOREIGN KEY (genre_id) REFERENCES genre (genre_id)
);

CREATE TABLE users_genre (
	user_id INT NOT NULL,
	genre_id INT NOT NULL,
	PRIMARY KEY (user_id, genre_id),
	FOREIGN KEY (user_id) REFERENCES users (user_id),
	FOREIGN KEY (genre_id) REFERENCES genre (genre_id)
);

CREATE TABLE users_movie (
	movie_id INT NOT NULL,
	user_id INT NOT NULL,
	liked INT,
	favorited BOOLEAN,
	PRIMARY KEY (movie_id, user_id),
	FOREIGN KEY (user_id) REFERENCES users (user_id),
	FOREIGN KEY (movie_id) REFERENCES movie (movie_id)
);


COMMIT TRANSACTION;
