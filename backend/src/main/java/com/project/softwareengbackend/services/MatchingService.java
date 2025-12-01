package com.project.softwareengbackend.services;

import com.project.softwareengbackend.model.MatchingRequest;
import com.project.softwareengbackend.model.MatchingStatus;
import com.project.softwareengbackend.repositories.MatchingRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final MatchingRequestRepository matchingRequestRepository;

    public MatchingRequest createMatchingRequest(MatchingRequest matchingRequest) {
        matchingRequest.setStatus(MatchingStatus.PENDING);
        matchingRequest.setCreatedDate(LocalDateTime.now());
        return matchingRequestRepository.save(matchingRequest);
    }

    public List<MatchingRequest> getMatchingRequestsForStudent(String studentId) {
        return matchingRequestRepository.findByStudent_UserId(studentId);
    }

    public List<MatchingRequest> getMatchingRequestsForTutor(String tutorId) {
        return matchingRequestRepository.findByTutor_UserId(tutorId);
    }

    public Optional<MatchingRequest> approveMatchingRequest(String requestId) {
        return matchingRequestRepository.findById(requestId)
                .map(request -> {
                    request.setStatus(MatchingStatus.ACCEPTED);
                    return matchingRequestRepository.save(request);
                });
    }

    public Optional<MatchingRequest> rejectMatchingRequest(String requestId) {
        return matchingRequestRepository.findById(requestId)
                .map(request -> {
                    request.setStatus(MatchingStatus.REJECTED);
                    return matchingRequestRepository.save(request);
                });
    }
}
