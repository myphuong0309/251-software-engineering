package com.project.softwareengbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LibraryItem {
    private String libraryId;
    private String title;
    private String description;
    private String url;
}
