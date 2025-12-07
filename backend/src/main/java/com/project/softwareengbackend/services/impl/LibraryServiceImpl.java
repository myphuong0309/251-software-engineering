package com.project.softwareengbackend.services.impl;

import com.project.softwareengbackend.dto.LibraryItem;
import com.project.softwareengbackend.services.LibraryService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class LibraryServiceImpl implements LibraryService {

    @Override
    public List<LibraryItem> search(String query) {
        // Mock implementation: returns a hardcoded list of items for any query
        return Collections.singletonList(
                LibraryItem.builder()
                        .libraryId(UUID.randomUUID().toString())
                        .title("Example Resource")
                        .description("This is an example resource from the library.")
                        .url("http://example.com/resource/1")
                        .build()
        );
    }

    @Override
    public LibraryItem getResourceDetails(String libraryId) {
        // Mock implementation: returns a hardcoded item for any ID
        return LibraryItem.builder()
                .libraryId(libraryId)
                .title("Example Resource Details")
                .description("Detailed description of the example resource.")
                .url("http://example.com/resource/" + libraryId)
                .build();
    }
}
