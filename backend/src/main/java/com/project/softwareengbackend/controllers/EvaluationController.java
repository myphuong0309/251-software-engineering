package com.project.softwareengbackend.controllers;

import com.project.softwareengbackend.model.Evaluation;
import com.project.softwareengbackend.services.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    // TODO: Add security to protect these endpoints

    @PostMapping
    public ResponseEntity<Evaluation> createEvaluation(@RequestBody Evaluation evaluation) {
        return ResponseEntity.ok(evaluationService.createEvaluation(evaluation));
    }

    @GetMapping("/{evaluationId}")
    public ResponseEntity<Evaluation> getEvaluationById(@PathVariable String evaluationId) {
        return evaluationService.getEvaluationById(evaluationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Evaluation>> getEvaluationsForSession(@PathVariable String sessionId) {
        return ResponseEntity.ok(evaluationService.getEvaluationsForSession(sessionId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Evaluation>> getEvaluationsByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(evaluationService.getEvaluationsByStudent(studentId));
    }
}
