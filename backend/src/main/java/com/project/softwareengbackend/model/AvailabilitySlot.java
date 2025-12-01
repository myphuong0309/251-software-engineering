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
@Table(name = "availability_slots")
public class AvailabilitySlot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String slotId;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean isRecurring;

    @Enumerated(EnumType.STRING)
    private AvailabilityStatus status;
}
