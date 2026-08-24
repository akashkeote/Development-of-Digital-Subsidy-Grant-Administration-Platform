package com.government.infosys.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class KeepAliveScheduler {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Pings the database every 12 hours to prevent Supabase from pausing the free project
    @Scheduled(cron = "0 0 */12 * * *")
    public void pingDatabase() {
        try {
            jdbcTemplate.execute("SELECT 1");
            System.out.println("Supabase Keep-Alive Ping Successful!");
        } catch (Exception e) {
            System.err.println("Supabase Keep-Alive Ping Failed: " + e.getMessage());
        }
    }
}
