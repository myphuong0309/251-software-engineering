package com.project.softwareengbackend.services;

import com.project.softwareengbackend.model.ForumPost;
import com.project.softwareengbackend.model.ForumReply;
import com.project.softwareengbackend.repositories.ForumPostRepository;
import com.project.softwareengbackend.repositories.ForumReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ForumService {

    private final ForumPostRepository forumPostRepository;
    private final ForumReplyRepository forumReplyRepository;

    public ForumPost createPost(ForumPost post) {
        post.setCreatedDate(LocalDateTime.now());
        return forumPostRepository.save(post);
    }

    public List<ForumPost> getAllPosts() {
        return forumPostRepository.findAll();
    }

    public Optional<ForumPost> getPostById(String postId) {
        return forumPostRepository.findById(postId);
    }

    public ForumReply createReply(ForumReply reply) {
        reply.setCreatedDate(LocalDateTime.now());
        return forumReplyRepository.save(reply);
    }
}
