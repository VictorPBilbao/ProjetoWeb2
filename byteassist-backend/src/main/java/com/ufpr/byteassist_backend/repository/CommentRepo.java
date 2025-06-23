package com.ufpr.byteassist_backend.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.surrealdb.UpType;
import com.ufpr.byteassist_backend.model.Comment;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class CommentRepo implements CommentRepoInterface {
    private final Surreal db;

    public CommentRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

    @Override
    public Optional<List<Comment>> getAllCommentsByTaskId(String taskId) {
        try {
            String query = "SELECT * FROM Comments_on WHERE out = $taskid ORDER BY comment_date ASC";
            Response response = db.queryBind(query, Map.of("taskid", new RecordId("Task", taskId)));
            
            System.out.println(response.take(0).getArray().toString());
            
            List<Comment> comments = new ArrayList<>();
            for (var commentRecord : response.take(0).getArray()) {
                Comment comment = commentRecord.get(Comment.class);
                comments.add(comment);
            }
            return Optional.of(comments);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Comment> createComment(Comment comment) {
        try {
            return Optional.ofNullable(
                    db.insertRelation(
                            Comment.class,
                            "Comments_on",
                            comment));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Comment> getCommentById(String id) {
        try {
            return db.select(Comment.class, new RecordId("Comments_on", id));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Comment> updateComment(Comment comment, String id) {
        try {
            return Optional.ofNullable(
                db.update(
                    Comment.class,
                    new RecordId("Comments_on", id),
                    UpType.MERGE,
                    comment
                )
            );
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Boolean deleteComment(String id) {
        try {
            db.delete(new RecordId("Comments_on", id));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
