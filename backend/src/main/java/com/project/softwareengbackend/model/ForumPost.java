package com.project.softwareengbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "forum_posts")
public class ForumPost {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String postId;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    private String title;
    private String content;
    private LocalDateTime createdDate;

    @Enumerated(EnumType.STRING)
    private ForumPostStatus status;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<ForumReply> replies;
}
