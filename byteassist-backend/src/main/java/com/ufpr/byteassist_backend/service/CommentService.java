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

/**
 * Serviço responsável pela lógica de negócio relacionada a comentários.
 * Realiza operações de criação, busca, atualização e remoção de comentários,
 * delegando o acesso ao banco de dados ao repositório.
 */
@Service
public class CommentService {
    // Interface do repositório de comentários, responsável pelo acesso ao banco de dados
    private final CommentRepoInterface commentRepo;

    /**
     * Construtor que recebe o repositório de comentários via injeção de dependência.
     * @param commentRepo Repositório de comentários
     */
    public CommentService(CommentRepo commentRepo) {
        this.commentRepo = commentRepo;
    }

    /**
     * Busca todos os comentários associados a uma tarefa específica.
     * @param taskId ID da tarefa
     * @return ResponseEntity contendo a lista de comentários encontrados
     * @throws EnhancedStatusException em caso de erro ao acessar o banco de dados
     */
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

    /**
     * Cria um novo comentário no banco de dados.
     * @param comment Objeto Comment a ser criado
     * @return ResponseEntity contendo o comentário criado e status HTTP 201
     * @throws EnhancedStatusException em caso de erro ao criar o comentário
     */
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

    /**
     * Busca um comentário pelo seu ID.
     * @param id ID do comentário
     * @return ResponseEntity contendo o comentário encontrado
     * @throws EnhancedStatusException se o comentário não for encontrado
     */
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

    /**
     * Atualiza um comentário existente.
     * @param comment Objeto Comment com os dados atualizados
     * @param id ID do comentário a ser atualizado
     * @return ResponseEntity contendo o comentário atualizado
     * @throws EnhancedStatusException se o comentário não for encontrado ou não puder ser atualizado
     */
    public ResponseEntity<Comment> updateComment(Comment comment, String id) {
        // Garante que o ID do caminho é utilizado, não o do corpo do comentário
        Optional<Comment> updatedComment = commentRepo.updateComment(comment, id);
        if (updatedComment.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND, // Ou INTERNAL_SERVER_ERROR se a falha for outra
                "Comment not found or update failed",
                "Comment with id " + id + " not found or could not be updated"
            );
        }
        return ResponseEntity.ok(updatedComment.get());
    }

    /**
     * Remove um comentário do banco de dados.
     * @param id ID do comentário a ser removido
     * @return ResponseEntity sem conteúdo (HTTP 204) em caso de sucesso
     * @throws EnhancedStatusException se o comentário não for encontrado ou não puder ser removido
     */
    public ResponseEntity<Void> deleteComment(String id) {
        Boolean deleted = commentRepo.deleteComment(id);
        if (!deleted) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND, // Ou INTERNAL_SERVER_ERROR se a falha for outra
                "Comment not found or delete failed",
                "Comment with id " + id + " not found or could not be deleted"
            );
        }
        return ResponseEntity.noContent().build();
    }
}
