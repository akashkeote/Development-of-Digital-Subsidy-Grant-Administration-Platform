package com.government.infosys.controller;

import com.government.infosys.dto.ChatRequest;
import com.government.infosys.dto.ChatResponse;
import com.government.infosys.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String reply = chatbotService.generateReply(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
