package com.project.softwareengbackend.services;

import com.project.softwareengbackend.model.Report;
import com.project.softwareengbackend.repositories.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public Report generateReport(Report report) {
        report.setGeneratedDate(LocalDateTime.now());
        // In a real application, you would have logic here to generate the report
        // based on the criteria and report type.
        return reportRepository.save(report);
    }

    public java.util.Optional<Report> getReport(String reportId) {
        return reportRepository.findById(reportId);
    }
}
