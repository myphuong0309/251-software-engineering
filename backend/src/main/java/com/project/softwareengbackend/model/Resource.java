package com.project.softwareengbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String resourceId;

    private String title;
    private String description;
    private String externalLibraryId;
    private String linkURL;

    @ManyToOne
    @JoinColumn(name = "added_by_tutor_id")
    private Tutor addedByTutor;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;
}
