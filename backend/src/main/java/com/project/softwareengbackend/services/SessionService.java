package com.project.softwareengbackend.services;

import com.project.softwareengbackend.model.Session;
import com.project.softwareengbackend.model.SessionStatus;
import com.project.softwareengbackend.repositories.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;

    public Session scheduleSession(Session session) {
        session.setStatus(SessionStatus.SCHEDULED);
        return sessionRepository.save(session);
    }

    public List<Session> getSessionsForStudent(String studentId) {
        return sessionRepository.findByStudent_UserId(studentId);
    }

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    public Optional<Session> getSessionById(String sessionId) {
        return sessionRepository.findById(sessionId);
    }

    public List<Session> getSessionsForTutor(String tutorId) {
        return sessionRepository.findByTutor_UserId(tutorId);
    }

    public Optional<Session> cancelSession(String sessionId) {
        return sessionRepository.findById(sessionId)
                .map(session -> {
                    session.setStatus(SessionStatus.CANCELED);
                    return sessionRepository.save(session);
                });
    }

    public Optional<Session> rescheduleSession(String sessionId, LocalDateTime newStartTime, LocalDateTime newEndTime) {
        return sessionRepository.findById(sessionId)
                .map(session -> {
                    session.setStartTime(newStartTime);
                    session.setEndTime(newEndTime);
                    session.setStatus(SessionStatus.RESCHEDULED);
                    return sessionRepository.save(session);
                });
    }

    public Optional<Session> completeSession(String sessionId) {
        return sessionRepository.findById(sessionId)
                .map(session -> {
                    session.setStatus(SessionStatus.COMPLETED);
                    return sessionRepository.save(session);
                });
    }
}
