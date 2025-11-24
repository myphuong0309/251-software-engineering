package com.project.softwareengbackend.repositories;

import com.project.softwareengbackend.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, String> {
    List<Resource> findBySession_SessionId(String sessionId);
}
