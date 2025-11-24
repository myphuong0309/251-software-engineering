package com.project.softwareengbackend.repositories;

import com.project.softwareengbackend.model.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, String> {
    List<AvailabilitySlot> findByTutor_UserId(String tutorId);
}
