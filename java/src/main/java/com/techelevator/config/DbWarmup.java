package com.techelevator.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DbWarmup {
    private final JdbcTemplate jdbc;

    public DbWarmup(JdbcTemplate jdbc){
        this.jdbc=jdbc;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void warm(){
        try {
            //warmup the DB to prevent cold-start cost
            jdbc.execute("SELECT 1");
            jdbc.queryForObject("SELECT COUNT(*) FROM movie", Integer.class);
        } catch (Exception ignored){

        }
    }
}
