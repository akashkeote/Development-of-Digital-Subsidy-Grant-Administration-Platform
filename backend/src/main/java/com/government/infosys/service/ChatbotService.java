package com.government.infosys.service;

import com.government.infosys.entity.Scheme;
import com.government.infosys.repository.SchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final SchemeRepository schemeRepository;

    public String generateReply(String message) {
        if (message == null || message.trim().isEmpty()) {
            return "Please ask me a question or tell me what kind of scheme you are looking for.";
        }

        String lowerMsg = message.toLowerCase();

        // Greeting check
        if (lowerMsg.matches(".*\\b(hi|hello|hey|namaste|help)\\b.*") && lowerMsg.length() < 20) {
            return "Hello! ?? I am the **DigiGrant Assistant**. I can help you find relevant government schemes, grants, and subsidies directly from our database.\n\nJust tell me what you're looking for (e.g., 'farmer', 'student', 'housing', 'business').";
        }

        // Basic keyword extraction (remove stop words)
        String[] stopWords = {"i", "want", "need", "looking", "for", "a", "an", "the", "scheme", "schemes", "grant", "grants", "subsidy", "please", "help", "me", "with", "is", "there", "any", "what", "how", "can", "get"};
        String keyword = lowerMsg;
        for (String stop : stopWords) {
            keyword = keyword.replaceAll("\\b" + stop + "\\b", " ");
        }
        keyword = keyword.replaceAll("[^a-zA-Z0-9 ]", "").trim().replaceAll("\\s+", " ");

        if (keyword.length() < 3) {
            return "Could you please provide more specific details? Try keywords like **agriculture**, **education**, or **health**.";
        }

        // Pick the first significant word to search
        String searchTerm = keyword.split(" ")[0];

        List<Scheme> schemes = schemeRepository.findTop5ByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchTerm, searchTerm);

        if (schemes.isEmpty()) {
            return "I couldn't find any specific schemes matching **'" + searchTerm + "'** right now. \n\nYou can try searching with different keywords like 'agriculture', 'women', or 'business' on our main portal.";
        }

        StringBuilder reply = new StringBuilder("Here are some real schemes from our database that might help you with **" + searchTerm + "**:\n\n");
        for (int i = 0; i < schemes.size(); i++) {
            Scheme s = schemes.get(i);
            reply.append(i + 1).append(". **").append(s.getName()).append("**\n");
        }
        reply.append("\nYou can copy any of these names and search for them in the main search bar to apply!");

        return reply.toString();
    }
}
