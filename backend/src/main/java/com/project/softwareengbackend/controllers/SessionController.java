package com.project.softwareengbackend.controllers;

import com.project.softwareengbackend.dto.RescheduleRequest;
import com.project.softwareengbackend.model.Session;
import com.project.softwareengbackend.services.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/schedule")
    @PreAuthorize("hasAnyRole('TUTOR', 'COORDINATOR')")
    public ResponseEntity<Session> scheduleSession(@RequestBody Session session) {
        return ResponseEntity.ok(sessionService.scheduleSession(session));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'COORDINATOR')")
    public ResponseEntity<List<Session>> getSessionsForStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(sessionService.getSessionsForStudent(studentId));
    }

    @GetMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<List<Session>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<Session> getSessionById(@PathVariable String sessionId) {
        return sessionService.getSessionById(sessionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tutor/{tutorId}")
    @PreAuthorize("hasAnyRole('TUTOR', 'COORDINATOR')")
    public ResponseEntity<List<Session>> getSessionsForTutor(@PathVariable String tutorId) {
        return ResponseEntity.ok(sessionService.getSessionsForTutor(tutorId));
    }

    @PostMapping("/cancel/{sessionId}")
    @PreAuthorize("hasAnyRole('TUTOR', 'COORDINATOR')")
    public ResponseEntity<Session> cancelSession(@PathVariable String sessionId) {
        return sessionService.cancelSession(sessionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/reschedule/{sessionId}")
    @PreAuthorize("hasAnyRole('TUTOR', 'COORDINATOR')")
    public ResponseEntity<Session> rescheduleSession(@PathVariable String sessionId, @RequestBody RescheduleRequest request) {
        return sessionService.rescheduleSession(sessionId, request.getNewStartTime(), request.getNewEndTime())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/complete/{sessionId}")
    @PreAuthorize("hasAnyRole('TUTOR', 'COORDINATOR')")
    public ResponseEntity<Session> completeSession(@PathVariable String sessionId) {
        return sessionService.completeSession(sessionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
