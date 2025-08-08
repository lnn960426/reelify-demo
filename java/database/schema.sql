BEGIN TRANSACTION;

DROP TABLE IF EXISTS users, movie, users_movie, genre, movie_genre, users_genre;



CREATE TABLE users (
	user_id SERIAL,
	username varchar(50) NOT NULL UNIQUE,
	favorite_genre varchar(50) NOT NULL,
	password_hash varchar(200) NOT NULL,
	role varchar(50) NOT NULL,
	CONSTRAINT PK_user PRIMARY KEY (user_id)
);

CREATE TABLE genre (
	genre_id int NOT NULL,
	name varchar(32),
	CONSTRAINT PK_genre PRIMARY KEY (genre_id)
);

CREATE TABLE movie (
    movie_id int NOT NULL, 
    genre_id int NOT NULL, 
    title varchar(50) NOT NULL,
    overview varchar(200),
    poster_path varchar(100),
	release_date varchar(50) NOT NULL,
	vote_average numeric,
	CONSTRAINT PK_movie PRIMARY KEY (movie_id),
	CONSTRAINT FK_genre FOREIGN KEY (genre_id) references genre (genre_id)
);

CREATE TABLE users_movie (
	movie_id int NOT NULL,
	user_id int NOT NULL,
	liked int,
	favorited boolean,
	CONSTRAINT PK_user_movie PRIMARY KEY (movie_id, user_id),
	CONSTRAINT FK_user FOREIGN KEY (user_id) references users (user_id),
	CONSTRAINT FK_movie FOREIGN KEY (movie_id) references movie (movie_id)
);



CREATE TABLE movie_genre (
	movie_id int NOT NULL,
	genre_id int NOT NULL,
	CONSTRAINT PK_movie_genre PRIMARY KEY (movie_id, genre_id),
	CONSTRAINT FK_movie FOREIGN KEY (movie_id) references movie (movie_id),
	CONSTRAINT FK_genre FOREIGN KEY (genre_id) references genre (genre_id)
);

CREATE TABLE users_genre (
	user_id int NOT NULL,
	genre_id int NOT NULL,
	CONSTRAINT PK_users_genre PRIMARY KEY (user_id, genre_id),
	CONSTRAINT FK_user FOREIGN KEY (user_id) references users (user_id),
	CONSTRAINT FK_genre FOREIGN KEY (genre_id) references genre (genre_id)
);


COMMIT TRANSACTION;
