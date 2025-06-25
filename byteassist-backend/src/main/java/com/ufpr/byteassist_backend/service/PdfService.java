package com.ufpr.byteassist_backend.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.ufpr.byteassist_backend.model.relatorio.CategoryReport;
import com.ufpr.byteassist_backend.model.relatorio.DailyReport;

@Service
public class PdfService {
    
    private final TemplateEngine templateEngine;
    
    public PdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }
    
    public byte[] generateDailyReportPdf(List<DailyReport> dailyReports, List<CategoryReport> categoryReports, ZonedDateTime startDate, ZonedDateTime endDate) throws IOException {
        // Create Thymeleaf context with data
        Context context = new Context();
        context.setVariable("dailyReports", dailyReports);
        context.setVariable("categoryReports", categoryReports);
        context.setVariable("startDate", startDate);
        context.setVariable("endDate", endDate);
        
        // Process the HTML template
        String htmlContent = templateEngine.process("daily-report", context);
        
        // Convert HTML to PDF
        return convertHtmlToPdf(htmlContent);
    }
    
    private byte[] convertHtmlToPdf(String htmlContent) throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.run();
            
            return outputStream.toByteArray();
        }
    }
}
