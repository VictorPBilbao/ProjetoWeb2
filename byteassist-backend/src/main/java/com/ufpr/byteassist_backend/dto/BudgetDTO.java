package com.ufpr.byteassist_backend.dto;

import java.util.Date;
import java.util.List;
import com.ufpr.byteassist_backend.dto.EquipmentePartsDTO;

public class BudgetDTO {

    public BudgetDTO() {
        this.status = "Orçada"; // Valor padrão como no model TypeScript
        this.date = new Date(); // Data padrão atual
    }

    public String id;
    public String userId;
    public Date date;
    public String time;
    public String equipment;
    public String equipmentBrand;
    public String status;
    public String equipmentCategory;
    public double budgetValue;
    public String partsDescription;
    public String laborDescription;
    public String serviceName;
    public String serviceDescription;
    public double budgetPartsValue;
    public double budgetLaborValue;
    public String treasurerName;
    public String accountantName;
    public String rejectDescription;
    public String defectDescription;
    public String budgetDescription;
    public List<EquipmentePartsDTO> parts;
    public String clientName;
    public String technicalName;
    public double technicalHourValue;
    public double fees;
}
