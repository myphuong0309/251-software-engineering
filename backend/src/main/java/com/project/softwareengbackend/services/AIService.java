package com.project.softwareengbackend.services;

import com.project.softwareengbackend.dto.TutorRecommendation;

import java.util.List;

public interface AIService {
    List<TutorRecommendation> getRecommendations(String studentId);
}
