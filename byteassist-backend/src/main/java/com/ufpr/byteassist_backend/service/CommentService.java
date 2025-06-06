package com.ufpr.byteassist_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.model.Comment;
import com.ufpr.byteassist_backend.repository.CommentRepo;
import com.ufpr.byteassist_backend.repository.CommentRepoInterface;

@Service
public class CommentService {
    private final CommentRepoInterface commentRepo;

    public CommentService(CommentRepo commentRepo) {
        this.commentRepo = commentRepo;
    }

    public ResponseEntity<List<Comment>> getCommentsByTaskId(String taskId) {
        Optional<List<Comment>> comments = commentRepo.getAllCommentsByTaskId(taskId);
        if (comments.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving all comments from database",
                "There was a problem accessing the database to retrieve the list of comments"
            );
        }
        return ResponseEntity.ok(comments.get());
    }

    public ResponseEntity<Comment> createComment(Comment comment) {
        Optional<Comment> createdComment = commentRepo.createComment(comment);
        if (createdComment.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error creating comment",
                "There was a problem creating the comment in the database"
            );
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment.get());
    }

    public ResponseEntity<Comment> getCommentById(String id) {
        Optional<Comment> comment = commentRepo.getCommentById(id);
        if (comment.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Comment not found",
                "Comment with id " + id + " not found"
            );
        }
        return ResponseEntity.ok(comment.get());
    }

    public ResponseEntity<Comment> updateComment(Comment comment, String id) {
        // Ensure the ID in the path is used, not from the comment body if it exists and differs
        Optional<Comment> updatedComment = commentRepo.updateComment(comment, id);
        if (updatedComment.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND, // Or INTERNAL_SERVER_ERROR if update failed for other reasons
                "Comment not found or update failed",
                "Comment with id " + id + " not found or could not be updated"
            );
        }
        return ResponseEntity.ok(updatedComment.get());
    }

    public ResponseEntity<Void> deleteComment(String id) {
        Boolean deleted = commentRepo.deleteComment(id);
        if (!deleted) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND, // Or INTERNAL_SERVER_ERROR if delete failed for other reasons
                "Comment not found or delete failed",
                "Comment with id " + id + " not found or could not be deleted"
            );
        }
        return ResponseEntity.noContent().build();
    }
}
