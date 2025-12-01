package com.project.softwareengbackend.services.impl;

import com.project.softwareengbackend.dto.TutorRecommendation;
import com.project.softwareengbackend.model.Tutor;
import com.project.softwareengbackend.repositories.TutorRepository;
import com.project.softwareengbackend.services.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {

    private final TutorRepository tutorRepository;

    @Override
    public List<TutorRecommendation> getRecommendations(String studentId) {
        // Mock implementation: returns a hardcoded list of recommendations
        // In a real application, this would involve a call to an AI model,
        // passing student data and getting back tutor recommendations.

        List<Tutor> tutors = tutorRepository.findAll();

        return tutors.stream()
                .map(tutor -> TutorRecommendation.builder()
                        .tutor(tutor)
                        .reason("This tutor is a good match based on your profile.")
                        .build())
                .collect(Collectors.toList());
    }
}
