package com.project.softwareengbackend.services;

import com.project.softwareengbackend.model.Tutor;
import com.project.softwareengbackend.repositories.TutorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorService {

    private final TutorRepository tutorRepository;

    public List<Tutor> getAllTutors() {
        try {
            return tutorRepository.findAll();
        } catch (DataAccessException ex) {
            log.warn("Unable to load tutors from database; returning empty list", ex);
            return Collections.emptyList();
        }
    }

    public Optional<Tutor> getTutorById(String tutorId) {
        try {
            return tutorRepository.findById(tutorId);
        } catch (DataAccessException ex) {
            log.warn("Unable to load tutor {} from database", tutorId, ex);
            return Optional.empty();
        }
    }
}
