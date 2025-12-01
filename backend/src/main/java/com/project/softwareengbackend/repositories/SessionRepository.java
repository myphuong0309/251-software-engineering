package com.project.softwareengbackend.repositories;

import com.project.softwareengbackend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, String> {
    List<Session> findByStudent_UserId(String studentId);
    List<Session> findByTutor_UserId(String tutorId);
}
