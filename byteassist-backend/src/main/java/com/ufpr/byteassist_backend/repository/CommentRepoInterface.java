package com.ufpr.byteassist_backend.repository;

import java.util.List;
import java.util.Optional;

import com.ufpr.byteassist_backend.model.Comment;

public interface CommentRepoInterface {
    public Optional<List<Comment>> getAllCommentsByTaskId(String taskId);
    public Optional<Comment> createComment(Comment comment);
    public Optional<Comment> getCommentById(String id);
    public Optional<Comment> updateComment(Comment comment, String id);
    public Boolean deleteComment(String id);
}
