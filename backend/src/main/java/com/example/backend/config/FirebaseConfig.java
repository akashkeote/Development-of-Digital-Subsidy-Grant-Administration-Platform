package com.example.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;

/**
 * Firebase initialization for real-time Application status updates.
 * Firebase is used ONLY for Application events — NOT for scheme reads.
 * This ensures quota stays within free tier limits.
 */
@Component
public class FirebaseConfig {

    @PostConstruct
    public void initFirebase() {
        try {
            if (!FirebaseApp.getApps().isEmpty()) {
                return; // Already initialized
            }

            InputStream serviceAccount;
            try {
                serviceAccount = new ClassPathResource("serviceAccountKey.json").getInputStream();
            } catch (Exception e) {
                System.err.println("[Firebase] serviceAccountKey.json not found — Firebase disabled.");
                System.err.println("[Firebase] Schemes still served from local JSON (unaffected).");
                return;
            }

            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

            FirebaseApp.initializeApp(options);
            System.out.println("[Firebase] Initialized. Real-time application updates enabled.");

        } catch (Exception e) {
            // Firebase failure is NON-FATAL. Supabase is primary DB.
            System.err.println("[Firebase] Init failed (non-fatal): " + e.getMessage());
            System.err.println("[Firebase] Applications will be saved to Supabase only.");
        }
    }
}
