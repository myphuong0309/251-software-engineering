package com.project.softwareengbackend.controllers;

import com.project.softwareengbackend.model.AvailabilitySlot;
import com.project.softwareengbackend.services.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    // TODO: Add security to protect these endpoints

    @PostMapping
    public ResponseEntity<AvailabilitySlot> createAvailability(@RequestBody AvailabilitySlot availabilitySlot) {
        return ResponseEntity.ok(availabilityService.createAvailability(availabilitySlot));
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<AvailabilitySlot>> getAvailabilityForTutor(@PathVariable String tutorId) {
        return ResponseEntity.ok(availabilityService.getAvailabilityForTutor(tutorId));
    }

    @PutMapping("/{slotId}")
    public ResponseEntity<AvailabilitySlot> updateAvailability(@PathVariable String slotId, @RequestBody AvailabilitySlot updatedSlot) {
        return availabilityService.updateAvailability(slotId, updatedSlot)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{slotId}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable String slotId) {
        availabilityService.deleteAvailability(slotId);
        return ResponseEntity.noContent().build();
    }
}