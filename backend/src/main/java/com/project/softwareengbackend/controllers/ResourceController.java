package com.project.softwareengbackend.controllers;

import com.project.softwareengbackend.model.Resource;
import com.project.softwareengbackend.services.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    // TODO: Add security to protect these endpoints

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{resourceId}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String resourceId) {
        return resourceService.getResourceById(resourceId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Resource> addResourceToSession(@RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.addResourceToSession(resource));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Resource>> getResourcesForSession(@PathVariable String sessionId) {
        return ResponseEntity.ok(resourceService.getResourcesForSession(sessionId));
    }

    @DeleteMapping("/{resourceId}")
    public ResponseEntity<Void> removeResourceFromSession(@PathVariable String resourceId) {
        resourceService.removeResourceFromSession(resourceId);
        return ResponseEntity.noContent().build();
    }
}
