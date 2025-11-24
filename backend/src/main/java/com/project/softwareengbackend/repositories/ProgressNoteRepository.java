package com.project.softwareengbackend.repositories;

import com.project.softwareengbackend.model.ProgressNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressNoteRepository extends JpaRepository<ProgressNote, String> {
    List<ProgressNote> findBySession_SessionId(String sessionId);
}
