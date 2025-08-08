BEGIN TRANSACTION;

-- the password for all users is "password"
INSERT INTO users (username,password_hash,role) VALUES ('user','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_USER');
INSERT INTO users (username,password_hash,role) VALUES ('admin','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_ADMIN');
INSERT INTO users (username,password_hash,role) VALUES ('jan','$2a$10$Itsk1QnUchSShksl0MFQS.9PttCT7oogCTbfohTe0FE/r37Rr53Q','ROLE_USER');
INSERT INTO genre (genre_id, name) VALUES (99, 'Documentary'), (28, 'Action'), (12, 'Adventure'), (16, 'Animation'), (35, 'Comedy'), (80, 'Crime'),
    (18, 'Drama'), (10751, 'Family'), (14, 'Fantasy'), (36, 'History'), (27, 'Horror'), (10402, 'Music'), (9648, 'Mystery'), (10749, 'Romance'),
    (878, 'Science Fiction'), (10770, 'TV Movie'), (53, 'Thriller'), (10752, 'War'), (37, 'Western');
INSERT INTO users_genre (user_id, genre_id) VALUES (3, 99);
COMMIT TRANSACTION;
