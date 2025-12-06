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
@Table(name = "students")
public class Student extends User {

    private String major;
    private float gpa;

    @ElementCollection
    @CollectionTable(name = "student_courses", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "course")
    private List<String> enrolledCourses;
}
