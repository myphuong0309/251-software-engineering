package com.project.softwareengbackend.services;

import com.project.softwareengbackend.model.Evaluation;
import com.project.softwareengbackend.repositories.EvaluationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;

    public Evaluation createEvaluation(Evaluation evaluation) {
        evaluation.setSubmittedDate(LocalDateTime.now());

        // If this session already has an evaluation, update it instead of failing on the unique constraint
        if (evaluation.getSession() != null && evaluation.getSession().getSessionId() != null) {
            List<Evaluation> existing = evaluationRepository.findBySession_SessionId(evaluation.getSession().getSessionId());
            if (!existing.isEmpty()) {
                Evaluation current = existing.get(0);
                current.setRatingQuality(evaluation.getRatingQuality());
                current.setSatisfactionLevel(evaluation.getSatisfactionLevel());
                current.setComment(evaluation.getComment());
                current.setSubmittedDate(LocalDateTime.now());
                current.setStudent(evaluation.getStudent());
                current.setSession(evaluation.getSession());
                return evaluationRepository.save(current);
            }
        }

        return evaluationRepository.save(evaluation);
    }

    public Optional<Evaluation> getEvaluationById(String evaluationId) {
        return evaluationRepository.findById(evaluationId);
    }

    public List<Evaluation> getEvaluationsForSession(String sessionId) {
        return evaluationRepository.findBySession_SessionId(sessionId);
    }

    public List<Evaluation> getEvaluationsByStudent(String studentId) {
        return evaluationRepository.findByStudent_UserId(studentId);
    }
}
