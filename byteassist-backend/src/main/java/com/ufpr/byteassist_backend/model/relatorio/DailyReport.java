package com.ufpr.byteassist_backend.model.relatorio;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyReport {
    private ZonedDateTime createdAt;
    private Long valor;
}
