
package com.ufpr.byteassist_backend.repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import com.ufpr.byteassist_backend.model.relatorio.CategoryReport;
import com.ufpr.byteassist_backend.model.relatorio.DailyReport;

public interface ReportRepoInterface {
    public Optional<List<DailyReport>> getDailyReport(ZonedDateTime start, ZonedDateTime end);
    public Optional<List<CategoryReport>> getCategoryReport(ZonedDateTime start, ZonedDateTime end);
}