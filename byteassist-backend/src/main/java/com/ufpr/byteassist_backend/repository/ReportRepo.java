package com.ufpr.byteassist_backend.repository;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class ReportRepo {
    private final Surreal db;

    public ReportRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }    public Optional<List<Object>> getReport(ZonedDateTime start, ZonedDateTime end) {
        try {
            String query;
            if (start != null && end != null) {
                query = String.format("fn::relatorio(d'%s', d'%s')", start.toLocalDate().toString(), end.toLocalDate().toString());
            } else if (start != null) {
                query = String.format("fn::relatorio(d'%s')", start.toLocalDate().toString());
            } else {
                query = "fn::relatorio()";
            }
            
            
            System.out.println("Executing report query: " + query);
            Response result = db.query(query);
            List<Object> reportData =  new ArrayList<>();

            for (var item : result.take(0).getArray()) {
                reportData.add(item);
            }

            return Optional.ofNullable(reportData);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
