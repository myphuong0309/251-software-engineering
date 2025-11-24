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
