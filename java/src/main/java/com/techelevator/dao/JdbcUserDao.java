package com.techelevator.dao;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.techelevator.exception.DaoException;
import com.techelevator.model.GenreDto;
import com.techelevator.model.RegisterUserDto;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.techelevator.model.User;
import org.springframework.web.bind.annotation.RequestParam;

@Component
public class JdbcUserDao implements UserDao {

    private final JdbcTemplate jdbcTemplate;



    public JdbcUserDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public User getUserById(int userId) {
        User user = null;
        String sql = "SELECT user_id, username, password_hash, role FROM users WHERE user_id = ?";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, userId);
            if (results.next()) {
                user = mapRowToUser(results);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return user;
    }

    @Override
    public List<User> getUsers() {
        List<User> users = new ArrayList<>();
        String sql = "SELECT user_id, username, password_hash, role FROM users";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
            while (results.next()) {
                User user = mapRowToUser(results);
                users.add(user);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return users;
    }

    @Override
    public User getUserByUsername(String username) {
        if (username == null) throw new IllegalArgumentException("Username cannot be null");
        User user = null;
        String sql = "SELECT user_id, username, password_hash, role FROM users WHERE username = LOWER(TRIM(?));";
        try {
            SqlRowSet rowSet = jdbcTemplate.queryForRowSet(sql, username);
            if (rowSet.next()) {
                user = mapRowToUser(rowSet);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return user;
    }

    @Override
    public void deleteUser(int userId) throws DaoException {
        String sql = "DELETE FROM users WHERE user_id = ?";  // adjust column/table names
        try {
            int rowsAffected = jdbcTemplate.update(sql, userId);
            if (rowsAffected == 0) {
                throw new DaoException("No user found with id " + userId);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
    }

    public List<String> getUserGenres(User user){
        String userGenreSql = "SELECT genre_id FROM users_genre WHERE user_id = ?;";
        List<Integer> genreIds = new ArrayList<>();
        List<String> genres = new ArrayList<>();
        SqlRowSet results;
        try{
            results = jdbcTemplate.queryForRowSet(userGenreSql, user.getId());
            while(results.next()){
                genreIds.add(results.getInt("genre_id"));
            }
        }catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        String genreNameSql = "SELECT name FROM genre WHERE genre_id = ?;";
        try{
            for(Integer id : genreIds){
                String genreName = jdbcTemplate.queryForObject(genreNameSql, String.class, id);
                genres.add(genreName);
            }
        }catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return genres;
    }

    @Override
    public User createUser(RegisterUserDto user) {
        User newUser = null;
        int newUserId;
        String insertUserSql = "INSERT INTO users (username, password_hash, role) values (LOWER(TRIM(?)), ?, ?) RETURNING user_id";
        String password_hash = new BCryptPasswordEncoder().encode(user.getPassword());
        String ssRole = user.getRole().toUpperCase().startsWith("ROLE_") ? user.getRole().toUpperCase() : "ROLE_" + user.getRole().toUpperCase();
        try {
            newUserId = jdbcTemplate.queryForObject(insertUserSql, int.class, user.getUsername(), password_hash, ssRole);
            newUser = getUserById(newUserId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
        List<String> genres = user.getFavoriteGenre();
        List<Integer> genreIds = new ArrayList<>();
        String getGenreIdsSql = "SELECT genre_id FROM genre WHERE name ILIKE ?;";
        try {
            for (String genre : genres) {
                int genreId = jdbcTemplate.queryForObject(getGenreIdsSql, int.class, genre);
                genreIds.add(genreId);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
        String insertIntoUserGenre = "INSERT INTO users_genre(user_id, genre_id) VALUES (?,?);";
        try{
            for(int id : genreIds){
                jdbcTemplate.update(insertIntoUserGenre, newUserId, id);
            }
        }catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
        return newUser;
    }

    public void addGenre(User user, List<String> genres, List<Integer> genreIdList){
        String getGenreIdsSql = "SELECT genre_id FROM genre WHERE name ILIKE ?;";
        List<Integer> genreIds = new ArrayList<>();

        try{
            for(String genre : genres){
                int genreId = jdbcTemplate.queryForObject(getGenreIdsSql, int.class, genre);
                genreIds.add(genreId);
            }

            for(Integer id : genreIdList){
                if(!genreIds.contains(id)){
                    genreIds.add(id);
                }
            }
        }catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }

        List<Integer> addIds = new ArrayList<>();
        String insertUserGenreSql = "INSERT INTO users_genre(user_id, genre_id) VALUES (?,?);";

        try{
            for(Integer id : genreIds){
                if(!genreIdList.contains(id)){
                    addIds.add(id);
                }
            }

            for(Integer id : addIds){
                jdbcTemplate.update(insertUserGenreSql, user.getId(), id);
            }
        }catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
    }

    public void deleteGenre(User user, String genre, List<Integer> genreIdList){
        String getGenreIdsSql = "SELECT genre_id FROM genre WHERE name ILIKE ?;";
        int genreId;

        try {
            genreId = jdbcTemplate.queryForObject(getGenreIdsSql, int.class, genre);

        }catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
        String deleteGenreSql = "DELETE FROM users_genre WHERE user_id = ? AND genre_id = ?;";
        try{
            if(genreIdList.contains(genreId)) {
                jdbcTemplate.update(deleteGenreSql, user.getId(), genreId);
            }
        }catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
    }

        private User mapRowToUser (SqlRowSet rs){
            User user = new User();
            user.setId(rs.getInt("user_id"));
            user.setUsername(rs.getString("username"));
            user.setPassword(rs.getString("password_hash"));
            user.setAuthorities(Objects.requireNonNull(rs.getString("role")));
            user.setActivated(true);
            return user;
        }

}
