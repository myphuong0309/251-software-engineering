package com.project.softwareengbackend.dto;

import com.project.softwareengbackend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    private String userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private boolean isActive;
}
