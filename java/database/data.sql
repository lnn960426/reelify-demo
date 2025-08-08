BEGIN TRANSACTION;

-- the password for all users is "password"
INSERT INTO users (username,password_hash,role) VALUES ('user','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_USER');
INSERT INTO users (username,password_hash,role) VALUES ('admin','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_ADMIN');
INSERT INTO users (username,password_hash,role) VALUES ('jan','$2a$10$Itsk1QnUchSShksl0MFQS.9PttCT7oogCTbfohTe0FE/r37Rr53Q','ROLE_USER');
INSERT INTO genre (genre_id, name) VALUES (99, 'documentary');
INSERT INTO users_genre (user_id, genre_id) VALUES (3, 99);
COMMIT TRANSACTION;
