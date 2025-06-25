package com.ufpr.byteassist_backend.controller;

import java.io.IOException;
import java.io.InputStream;
import java.time.ZonedDateTime;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ufpr.byteassist_backend.service.ReportService;

import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/report")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/pdf")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<byte[]> getPdfReportMock() {
        try {
            // Load the PDF file from resources/files directory
            ClassPathResource resource = new ClassPathResource("files/Manutenção de Equipamentos - 2024-2.pdf (2).pdf");

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Read the PDF file as bytes
            try (InputStream inputStream = resource.getInputStream()) {
                byte[] pdfBytes = inputStream.readAllBytes();

                // Set appropriate headers for PDF response
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentLength(pdfBytes.length);
                headers.add("Content-Disposition", "inline; filename=\"maintenance-report.pdf\"");

                return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            }

        } catch (IOException e) {
            // Handle file reading errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/test")
    public ResponseEntity<byte[]> getPdfReport(
            @RequestParam(value = "start", required = false) ZonedDateTime start,
            @RequestParam(value = "end", required = false) ZonedDateTime end) {
        try {
            byte[] pdfBytes = reportService.generateDailyReportPdf(start, end);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentLength(pdfBytes.length);
            headers.add("Content-Disposition", "inline; filename=\"daily-report-test.pdf\"");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/daily-report")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<byte[]> getDailyReportPdf(
            @RequestParam(value = "start", required = false) ZonedDateTime start,
            @RequestParam(value = "end", required = false) ZonedDateTime end) {
        try {
            byte[] pdfBytes = reportService.generateDailyReportPdf(start, end);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentLength(pdfBytes.length);
            
            // Generate filename with date range
            String filename = "daily-report";
            if (start != null && end != null) {
                filename += "-" + start.toLocalDate() + "-to-" + end.toLocalDate();
            }
            filename += ".pdf";
            
            headers.add("Content-Disposition", "attachment; filename=\"" + filename + "\"");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
