package com.project.softwareengbackend.services;

import com.project.softwareengbackend.dto.UserProfile;

public interface DataCoreService {
    UserProfile getUserProfile(String userId);
    boolean syncUserData(String userId);
}
