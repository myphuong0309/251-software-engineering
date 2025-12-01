package com.project.softwareengbackend.services.impl;

import com.project.softwareengbackend.dto.UserProfile;
import com.project.softwareengbackend.model.User;
import com.project.softwareengbackend.repositories.UserRepository;
import com.project.softwareengbackend.services.DataCoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DataCoreServiceImpl implements DataCoreService {

    private final UserRepository userRepository;

    @Override
    public UserProfile getUserProfile(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return UserProfile.builder()
                    .userId(user.getUserId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .phoneNumber(user.getPhoneNumber())
                    .role(user.getRole())
                    .isActive(user.isActive())
                    .build();
        }
        // In a real scenario, this would likely involve an API call to a data core service.
        return null;
    }

    @Override
    public boolean syncUserData(String userId) {
        // This method would sync the local user data with the central data core.
        // For this mock, we'll just return true.
        return true;
    }
}
