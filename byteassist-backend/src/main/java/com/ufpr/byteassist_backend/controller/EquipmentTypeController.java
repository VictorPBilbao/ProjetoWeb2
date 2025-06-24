package com.ufpr.byteassist_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ufpr.byteassist_backend.model.EquipmentType;
import com.ufpr.byteassist_backend.service.EquipmentTypeService;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

@RestController
@RequestMapping("/api/equipment-type")
public class EquipmentTypeController {
    private final EquipmentTypeService equipmentTypeService;

    public EquipmentTypeController(EquipmentTypeService equipmentTypeService) {
        this.equipmentTypeService = equipmentTypeService;
    }

    @GetMapping()
    public ResponseEntity<List<EquipmentType>> getAllEquipmentTypes() {
        return equipmentTypeService.getAllEquipmentTypes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentType> getEquipmentTypeById(@PathVariable String id) {
        return equipmentTypeService.getEquipmentTypeById(id);
    }

    @GetMapping("/active")
    public ResponseEntity<List<EquipmentType>> getActiveEquipmentTypes() {
        return equipmentTypeService.getActiveEquipmentTypes();
    }

    @PostMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<EquipmentType> createEquipmentType(
            @Validated(ValidationGroups.Create.class) @RequestBody EquipmentType equipmentType,
            @PathVariable String id) {
        return equipmentTypeService.createEquipmentType(equipmentType, id);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<EquipmentType> updateEquipmentType(@PathVariable String id,
            @Validated(ValidationGroups.Update.class) @RequestBody EquipmentType equipmentType) {
        return equipmentTypeService.updateEquipmentType(id, equipmentType);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> deleteEquipmentType(@PathVariable String id) {
        return equipmentTypeService.deleteEquipmentType(id);
    }
}
