package com.project.softwareengbackend.services;

import com.project.softwareengbackend.dto.LibraryItem;

import java.util.List;

public interface LibraryService {
    List<LibraryItem> search(String query);
    LibraryItem getResourceDetails(String libraryId);
}
