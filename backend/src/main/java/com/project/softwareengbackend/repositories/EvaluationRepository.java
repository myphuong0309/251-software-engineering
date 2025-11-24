package com.project.softwareengbackend.repositories;

import com.project.softwareengbackend.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, String> {
    List<Evaluation> findBySession_SessionId(String sessionId);
    List<Evaluation> findByStudent_UserId(String studentId);
}
