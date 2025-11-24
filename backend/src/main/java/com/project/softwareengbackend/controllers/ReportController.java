package com.project.softwareengbackend.controllers;

import com.project.softwareengbackend.model.ProgressNote;
import com.project.softwareengbackend.model.Report;
import com.project.softwareengbackend.services.ProgressNoteService;
import com.project.softwareengbackend.services.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final ProgressNoteService progressNoteService;

    // TODO: Add security to protect these endpoints

    @PostMapping("/generate")
    public ResponseEntity<Report> generateReport(@RequestBody Report report) {
        return ResponseEntity.ok(reportService.generateReport(report));
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<Report> getReport(@PathVariable String reportId) {
        return reportService.getReport(reportId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/notes")
    public ResponseEntity<ProgressNote> createProgressNote(@RequestBody ProgressNote progressNote) {
        return ResponseEntity.ok(progressNoteService.createProgressNote(progressNote));
    }

    @GetMapping("/notes/session/{sessionId}")
    public ResponseEntity<List<ProgressNote>> getProgressNotesForSession(@PathVariable String sessionId) {
        return ResponseEntity.ok(progressNoteService.getProgressNotesForSession(sessionId));
    }
}