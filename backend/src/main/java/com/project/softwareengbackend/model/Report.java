package com.project.softwareengbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String reportId;

    @ManyToOne
    @JoinColumn(name = "generated_by_coordinator_id")
    private Coordinator generatedBy;

    private LocalDateTime generatedDate;
    private String criteria;

    @Enumerated(EnumType.STRING)
    private ReportType reportType;
}
