package com.project.softwareengbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "matching_requests")
public class MatchingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String requestId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    private String subject;

    @ElementCollection
    @CollectionTable(
            name = "matching_request_preferred_time_slots",
            joinColumns = @JoinColumn(name = "request_id")
    )
    @Column(name = "time_slot")
    private List<LocalDateTime> preferredTimeSlots;

    @Enumerated(EnumType.STRING)
    private MatchingStatus status;

    private LocalDateTime createdDate;
}
