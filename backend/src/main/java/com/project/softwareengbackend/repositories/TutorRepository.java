package com.project.softwareengbackend.repositories;

import com.project.softwareengbackend.model.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TutorRepository extends JpaRepository<Tutor, String> {
}
