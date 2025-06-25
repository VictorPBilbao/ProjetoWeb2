package com.ufpr.byteassist_backend.repository;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.model.relatorio.CategoryReport;
import com.ufpr.byteassist_backend.model.relatorio.DailyReport;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class ReportRepo implements ReportRepoInterface {
    private final Surreal db;
    
    public ReportRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }
    
    @Override
    public Optional<List<DailyReport>> getDailyReport(ZonedDateTime start, ZonedDateTime end) {
        Response response;
        try {
            if (start != null && end != null) {
                response = db.queryBind("fn::relatorio_por_dia(<datetime>$start, <datetime>$end)", 
                        Map.of("start", start.toLocalDate().toString(), "end", end.toLocalDate().toString()));
            } else {
                response = db.query("fn::relatorio_por_dia()");
            }
            
            List<DailyReport> dailyReports = new ArrayList<>();
            for (var reportRecord : response.take(0).getArray()) {
                DailyReport dailyReport = reportRecord.get(DailyReport.class);
                dailyReports.add(dailyReport);
            }
            
            System.out.println("Daily Report: " + dailyReports);
            
            return Optional.of(dailyReports);
        } catch (Exception e) {
            throw e;
        }
    }
    
    @Override
    public Optional<List<CategoryReport>> getCategoryReport(ZonedDateTime start, ZonedDateTime end) {
        Response response;
        try {
            if (start != null && end != null) {
                response = db.queryBind("fn::relatorio_por_categoria(<datetime>$start, <datetime>$end)", 
                        Map.of("start", start.toLocalDate().toString(), "end", end.toLocalDate().toString()));
            } else {
                response = db.query("fn::relatorio_por_categoria()");
            }
            
            List<CategoryReport> categoryReports = new ArrayList<>();
            for (var reportRecord : response.take(0).getArray()) {
                CategoryReport categoryReport = reportRecord.get(CategoryReport.class);
                categoryReports.add(categoryReport);
            }
            
            System.out.println("Category Report: " + categoryReports);
            
            return Optional.of(categoryReports);
        } catch (Exception e) {
            throw e;
        }
    }
}
