package com.ufpr.byteassist_backend.controller;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ufpr.byteassist_backend.service.ReportService;


@Controller
@RequestMapping("/api/report")
public class ReportController {

    private final ReportService reportService;
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }
    @GetMapping("")
    public ResponseEntity<List<Object>> getReport(
            @RequestParam(required = false) ZonedDateTime start, 
            @RequestParam(required = false) ZonedDateTime end) {
        System.out.println("Received request for report with start: " + start + " and end: " + end);
        return reportService.getReport(start, end);
    }
    
}
