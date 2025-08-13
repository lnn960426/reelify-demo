BEGIN TRANSACTION;

DROP TABLE IF EXISTS users, movie, users_movie, genre, movie_genre, users_genre;



CREATE TABLE users (
	user_id SERIAL,
	username varchar(50) NOT NULL UNIQUE,
	password_hash varchar(200) NOT NULL,
	role varchar(50) NOT NULL,
	CONSTRAINT PK_user PRIMARY KEY (user_id)
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

ALTER TABLE users_movie
DROP CONSTRAINT users_movie_movie_id_fkey;


COMMIT TRANSACTION;
