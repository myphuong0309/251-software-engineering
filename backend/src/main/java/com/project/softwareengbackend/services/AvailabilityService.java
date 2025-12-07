package com.project.softwareengbackend.services;

import com.project.softwareengbackend.model.AvailabilitySlot;
import com.project.softwareengbackend.repositories.AvailabilitySlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final AvailabilitySlotRepository availabilitySlotRepository;

    public AvailabilitySlot createAvailability(AvailabilitySlot availabilitySlot) {
        return availabilitySlotRepository.save(availabilitySlot);
    }

    public List<AvailabilitySlot> getAvailabilityForTutor(String tutorId) {
        return availabilitySlotRepository.findByTutor_UserId(tutorId);
    }

    public Optional<AvailabilitySlot> updateAvailability(String slotId, AvailabilitySlot updatedSlot) {
        return availabilitySlotRepository.findById(slotId)
                .map(slot -> {
                    slot.setStartTime(updatedSlot.getStartTime());
                    slot.setEndTime(updatedSlot.getEndTime());
                    slot.setRecurring(updatedSlot.isRecurring());
                    slot.setStatus(updatedSlot.getStatus());
                    return availabilitySlotRepository.save(slot);
                });
    }

    public void deleteAvailability(String slotId) {
        availabilitySlotRepository.deleteById(slotId);
    }
}
