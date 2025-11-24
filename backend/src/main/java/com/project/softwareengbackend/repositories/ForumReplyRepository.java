package com.project.softwareengbackend.repositories;

import com.project.softwareengbackend.model.ForumReply;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForumReplyRepository extends JpaRepository<ForumReply, String> {
}
