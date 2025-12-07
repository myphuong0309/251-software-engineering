package com.project.softwareengbackend.controllers;

import com.project.softwareengbackend.model.ForumPost;
import com.project.softwareengbackend.model.ForumReply;
import com.project.softwareengbackend.services.ForumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;

    // TODO: Add security to protect these endpoints

    @PostMapping("/posts")
    public ResponseEntity<ForumPost> createPost(@RequestBody ForumPost post) {
        return ResponseEntity.ok(forumService.createPost(post));
    }

    @GetMapping("/posts")
    public ResponseEntity<List<ForumPost>> getAllPosts() {
        return ResponseEntity.ok(forumService.getAllPosts());
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<ForumPost> getPostById(@PathVariable String postId) {
        return forumService.getPostById(postId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/replies")
    public ResponseEntity<ForumReply> createReply(@RequestBody ForumReply reply) {
        return ResponseEntity.ok(forumService.createReply(reply));
    }
}