package com.ufpr.byteassist_backend.service;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.model.relatorio.CategoryReport;
import com.ufpr.byteassist_backend.model.relatorio.DailyReport;
import com.ufpr.byteassist_backend.repository.ReportRepoInterface;

@Service
public class ReportService {
    private final ReportRepoInterface reportRepo;
    private final PdfService pdfService;
    
    public ReportService(ReportRepoInterface reportRepo, PdfService pdfService) {
        this.reportRepo = reportRepo;
        this.pdfService = pdfService;
    }

    public String getPdfReport(ZonedDateTime start, ZonedDateTime end) {
        reportRepo.getDailyReport(start, end);
        return "PDF Report";
    }
    
    public byte[] generateDailyReportPdf(ZonedDateTime start, ZonedDateTime end) throws IOException {
        Optional<List<DailyReport>> dailyReportsOpt = reportRepo.getDailyReport(start, end);
        List<DailyReport> dailyReports = dailyReportsOpt.orElse(List.of());
        
        Optional<List<CategoryReport>> categoryReportsOpt = reportRepo.getCategoryReport(start, end);
        List<CategoryReport> categoryReports = categoryReportsOpt.orElse(List.of());
        
        return pdfService.generateDailyReportPdf(dailyReports, categoryReports, start, end);
    }
    
}
