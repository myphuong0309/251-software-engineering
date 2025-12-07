package com.project.softwareengbackend.repositories;

import com.project.softwareengbackend.model.MatchingRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchingRequestRepository extends JpaRepository<MatchingRequest, String> {
    List<MatchingRequest> findByStudent_UserId(String studentId);
    List<MatchingRequest> findByTutor_UserId(String tutorId);
}
