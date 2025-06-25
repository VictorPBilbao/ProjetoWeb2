package com.ufpr.byteassist_backend.model.relatorio;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryReport {
    private String categoria;
    private Long valor;
}
