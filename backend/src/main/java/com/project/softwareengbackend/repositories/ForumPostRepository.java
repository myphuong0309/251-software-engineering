package com.project.softwareengbackend.repositories;

import com.project.softwareengbackend.model.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForumPostRepository extends JpaRepository<ForumPost, String> {
}
