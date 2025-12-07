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
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String sessionId;

    private String meetingLink;
    private String location;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    private String topic;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int duration;

    @Enumerated(EnumType.STRING)
    private SessionMode mode;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;
}
