package com.project.softwareengbackend.services;

import com.project.softwareengbackend.model.Role;
import com.project.softwareengbackend.model.User;
import com.project.softwareengbackend.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user1;
    private User user2;

    @BeforeEach
    void setUp() {
        user1 = User.builder()
                .userId("1")
                .email("user1@example.com")
                .fullName("User One")
                .role(Role.STUDENT)
                .isActive(true)
                .build();

        user2 = User.builder()
                .userId("2")
                .email("user2@example.com")
                .fullName("User Two")
                .role(Role.TUTOR)
                .isActive(false)
                .build();
    }

    @Test
    void getAllUsers() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getUserById_found() {
        when(userRepository.findById("1")).thenReturn(Optional.of(user1));

        Optional<User> result = userService.getUserById("1");

        assertTrue(result.isPresent());
        assertEquals("User One", result.get().getFullName());
    }

    @Test
    void getUserById_notFound() {
        when(userRepository.findById("99")).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserById("99");

        assertFalse(result.isPresent());
    }

    @Test
    void getUserByEmail_found() {
        when(userRepository.findByEmail("user1@example.com")).thenReturn(Optional.of(user1));

        Optional<User> result = userService.getUserByEmail("user1@example.com");

        assertTrue(result.isPresent());
        assertEquals("1", result.get().getUserId());
    }

    @Test
    void updateUser_success() {
        User updatedInfo = User.builder()
                .fullName("User One Updated")
                .email("newemail@example.com")
                .phoneNumber("1234567890")
                .build();

        when(userRepository.findById("1")).thenReturn(Optional.of(user1));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<User> result = userService.updateUser("1", updatedInfo);

        assertTrue(result.isPresent());
        assertEquals("User One Updated", result.get().getFullName());
        assertEquals("newemail@example.com", result.get().getEmail());
        assertEquals("1234567890", result.get().getPhoneNumber());
    }

    @Test
    void updateUser_notFound() {
        User updatedInfo = User.builder().fullName("New Name").build();
        when(userRepository.findById("99")).thenReturn(Optional.empty());

        Optional<User> result = userService.updateUser("99", updatedInfo);

        assertFalse(result.isPresent());
        verify(userRepository, never()).save(any());
    }

    @Test
    void setUserActive_success() {
        when(userRepository.findById("2")).thenReturn(Optional.of(user2));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<User> result = userService.setUserActive("2", true);

        assertTrue(result.isPresent());
        assertTrue(result.get().isActive());
    }
}
