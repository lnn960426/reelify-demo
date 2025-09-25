package com.techelevator.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class MovieHydrator {

    private final JdbcTemplate jdbc;
    private final RestTemplate restTemplate;
    private final String apiBase; // https://api.themoviedb.org/3
    private final String apiKey;  // TMDB API key

    public MovieHydrator(
            JdbcTemplate jdbc,
            @Value("${api-movie-database}") String apiBase,
            @Value("${api-key}") String apiKey
    ) {
        this.jdbc = jdbc;
        this.apiBase = apiBase;
        this.apiKey = apiKey;
        this.restTemplate = new RestTemplate();
    }


     // If the movie is missing or only a placeholder (title='(external)'),
    // fetch details from TMDB and upsert movie + genres.

    @Transactional
    public void hydrateIfNeeded(int movieId) {
        // 1) Check if we already have a non-placeholder title.
        String titleInDb = jdbc.query(
                "SELECT title FROM movie WHERE movie_id = ?",
                rs -> rs.next() ? rs.getString(1) : null,
                movieId
        );
        if (titleInDb != null && !"(external)".equals(titleInDb)) {
            return; // already hydrated
        }

        // 2) Call TMDB
        String url = apiBase + "/movie/" + movieId + "?api_key=" + apiKey;
        @SuppressWarnings("unchecked")
        Map<String, Object> body = restTemplate.getForObject(url, Map.class);

        // 3) If TMDB has nothing, at least insert a placeholder row
        if (body == null || body.isEmpty()) {
            jdbc.update(
                    "INSERT INTO movie (movie_id, title) VALUES (?, '(external)') " +
                            "ON CONFLICT (movie_id) DO NOTHING",
                    movieId
            );
            return;
        }

        // 4) Extract common fields (null-safe)
        String title       = (String) body.getOrDefault("title", "(external)");
        String overview    = (String) body.get("overview");
        String posterPath  = (String) body.get("poster_path");
        String releaseDate = (String) body.get("release_date");
        Double voteAverage = body.get("vote_average") instanceof Number
                ? ((Number) body.get("vote_average")).doubleValue()
                : null;

        // 5) Upsert movie (simple approach: overwrite with TMDB values)
        jdbc.update(
                "INSERT INTO movie (movie_id, title, overview, poster_path, release_date, vote_average) " +
                        "VALUES (?,?,?,?,?,?) " +
                        "ON CONFLICT (movie_id) DO UPDATE SET " +
                        "  title = EXCLUDED.title, " +
                        "  overview = EXCLUDED.overview, " +
                        "  poster_path = EXCLUDED.poster_path, " +
                        "  release_date = EXCLUDED.release_date, " +
                        "  vote_average = EXCLUDED.vote_average",
                movieId, title, overview, posterPath, releaseDate, voteAverage
        );

        // 6) Upsert genres and the movie_genre link
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> genres = (List<Map<String, Object>>) body.get("genres");
        if (genres != null) {
            for (Map<String, Object> g : genres) {
                Integer gid = g.get("id") instanceof Number ? ((Number) g.get("id")).intValue() : null;
                String gname = (String) g.get("name");
                if (gid == null) continue;

                jdbc.update(
                        "INSERT INTO genre (genre_id, name) VALUES (?, ?) " +
                                "ON CONFLICT (genre_id) DO NOTHING",
                        gid, gname
                );
                jdbc.update(
                        "INSERT INTO movie_genre (movie_id, genre_id) VALUES (?, ?) " +
                                "ON CONFLICT DO NOTHING",
                        movieId, gid
                );
            }
        }
    }
}