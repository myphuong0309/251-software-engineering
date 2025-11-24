package com.project.softwareengbackend.services;

import com.project.softwareengbackend.model.ProgressNote;
import com.project.softwareengbackend.repositories.ProgressNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressNoteService {

    private final ProgressNoteRepository progressNoteRepository;

    public ProgressNote createProgressNote(ProgressNote progressNote) {
        progressNote.setCreatedDate(LocalDateTime.now());
        return progressNoteRepository.save(progressNote);
    }

    public List<ProgressNote> getProgressNotesForSession(String sessionId) {
        return progressNoteRepository.findBySession_SessionId(sessionId);
    }
}
