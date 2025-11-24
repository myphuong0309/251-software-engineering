package com.project.softwareengbackend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RescheduleRequest {
    private LocalDateTime newStartTime;
    private LocalDateTime newEndTime;
}
