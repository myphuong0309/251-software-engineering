package com.project.softwareengbackend.services;

import com.project.softwareengbackend.model.Resource;
import com.project.softwareengbackend.repositories.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public Resource addResourceToSession(Resource resource) {
        return resourceRepository.save(resource);
    }

    public List<Resource> getResourcesForSession(String sessionId) {
        return resourceRepository.findBySession_SessionId(sessionId);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(String resourceId) {
        return resourceRepository.findById(resourceId);
    }

    public void removeResourceFromSession(String resourceId) {
        resourceRepository.deleteById(resourceId);
    }
}
