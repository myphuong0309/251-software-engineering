package com.project.softwareengbackend.services;

import com.project.softwareengbackend.dto.LoginRequest;
import com.project.softwareengbackend.dto.LoginResponse;
import com.project.softwareengbackend.model.Role;
import com.project.softwareengbackend.model.User;
import com.project.softwareengbackend.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SsoService ssoService;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .email("test@example.com")
                .fullName("Test User")
                .role(Role.STUDENT)
                .build();
    }

    @Test
    void register_success() {
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = authService.register(user);

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void login_success() {
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password");
        String mockToken = "mock-jwt-token";

        when(ssoService.authenticate("test@example.com", "password")).thenReturn(mockToken);

        LoginResponse result = authService.login(loginRequest);

        assertNotNull(result);
        assertEquals(mockToken, result.getToken());
    }

    @Test
    void login_failure() {
        LoginRequest loginRequest = new LoginRequest("wrong@example.com", "password");

        when(ssoService.authenticate("wrong@example.com", "password")).thenReturn(null);

        LoginResponse result = authService.login(loginRequest);

        assertNull(result);
    }
}
