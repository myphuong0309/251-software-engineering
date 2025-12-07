package com.project.softwareengbackend.repositories;

import com.project.softwareengbackend.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, String> {
}
