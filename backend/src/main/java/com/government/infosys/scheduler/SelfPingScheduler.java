package com.government.infosys.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class SelfPingScheduler {

    // Runs every 14 minutes (14 * 60 * 1000 milliseconds)
    @Scheduled(fixedRate = 840000)
    public void keepRenderAlive() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            // Ping its own public Render URL to simulate external traffic and prevent sleep
            String url = "https://subsidy-backend-4jzy.onrender.com/api/subsidies";
            restTemplate.getForObject(url, String.class);
            System.out.println("Render Keep-Alive Self-Ping Successful!");
        } catch (Exception e) {
            System.err.println("Render Keep-Alive Self-Ping Failed: " + e.getMessage());
        }
    }
}
