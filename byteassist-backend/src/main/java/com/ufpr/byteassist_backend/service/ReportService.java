package com.ufpr.byteassist_backend.service;

import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.repository.ReportRepo;

@Service
public class ReportService {
    
    private final ReportRepo reportRepo;
    
    public ReportService(ReportRepo reportRepo) {
        this.reportRepo = reportRepo;
    }

    public ResponseEntity<List<Object>> getReport(ZonedDateTime start, ZonedDateTime end) {
        // Set default start date to 2025-01-01 if not provided
        if (start == null) {
            start = ZonedDateTime.of(2025, 1, 1, 0, 0, 0, 0, ZoneId.systemDefault());
        }
        
        // Set default end date to now if not provided
        if (end == null) {
            end = ZonedDateTime.now();
        }

        Optional<List<Object>> reportData = reportRepo.getReport(start, end);

        if (reportData.isPresent()) {
            return ResponseEntity.ok(reportData.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
