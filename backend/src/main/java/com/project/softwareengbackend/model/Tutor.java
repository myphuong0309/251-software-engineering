package com.project.softwareengbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tutors")
public class Tutor extends User {

    @ElementCollection
    @CollectionTable(name = "tutor_expertise", joinColumns = @JoinColumn(name = "tutor_id"))
    @Column(name = "expertise_area")
    private List<String> expertiseAreas;
    private String biography;
    private float averageRating;
}
