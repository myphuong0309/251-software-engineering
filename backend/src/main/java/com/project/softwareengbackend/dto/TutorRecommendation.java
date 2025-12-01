package com.project.softwareengbackend.dto;

import com.project.softwareengbackend.model.Tutor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorRecommendation {
    private Tutor tutor;
    private String reason;
}
