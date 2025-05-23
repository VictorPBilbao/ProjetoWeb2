package com.ufpr.byteassist_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.ufpr.byteassist_backend.dto.BudgetDTO;


@RestController
@RequestMapping("/budget")
public class BudgetController {
    public BudgetController() {
        // Constructor
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<String> getBudgetById(@PathVariable Long id) {
        // Placeholder for actual implementation
        return ResponseEntity.ok("Budget with ID: " + id);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createBudget(@RequestBody BudgetDTO budgetDTO) {
        // Aqui você pode chamar um serviço para salvar o orçamento
        // budgetService.create(budgetDTO);

        System.out.println("Recebido orçamento de: " + budgetDTO.clientName);

        return ResponseEntity.ok("Orçamento criado com sucesso!");
    }
}
