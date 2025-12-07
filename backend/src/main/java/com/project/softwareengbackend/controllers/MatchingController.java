package com.project.softwareengbackend.controllers;

import com.project.softwareengbackend.model.MatchingRequest;
import com.project.softwareengbackend.services.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    // TODO: Add security to protect these endpoints

    @PostMapping("/request")
    public ResponseEntity<MatchingRequest> createMatchingRequest(@RequestBody MatchingRequest matchingRequest) {
        return ResponseEntity.ok(matchingService.createMatchingRequest(matchingRequest));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<MatchingRequest>> getMatchingRequestsForStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(matchingService.getMatchingRequestsForStudent(studentId));
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<MatchingRequest>> getMatchingRequestsForTutor(@PathVariable String tutorId) {
        return ResponseEntity.ok(matchingService.getMatchingRequestsForTutor(tutorId));
    }

    @PostMapping("/approve/{requestId}")
    public ResponseEntity<MatchingRequest> approveMatchingRequest(@PathVariable String requestId) {
        return matchingService.approveMatchingRequest(requestId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/reject/{requestId}")
    public ResponseEntity<MatchingRequest> rejectMatchingRequest(@PathVariable String requestId) {
        return matchingService.rejectMatchingRequest(requestId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}