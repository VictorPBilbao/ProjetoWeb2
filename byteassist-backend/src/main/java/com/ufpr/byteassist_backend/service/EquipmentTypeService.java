package com.ufpr.byteassist_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.model.EquipmentType;
import com.ufpr.byteassist_backend.repository.EquipmentTypeRepoInterface;

@Service
public class EquipmentTypeService {
    private final EquipmentTypeRepoInterface equipmentTypeRepo;

    public EquipmentTypeService(EquipmentTypeRepoInterface equipmentTypeRepo) {
        this.equipmentTypeRepo = equipmentTypeRepo;
    }
    
    public ResponseEntity<List<EquipmentType>> getAllEquipmentTypes() {
        Optional<List<EquipmentType>> equipmentTypes = equipmentTypeRepo.getAllEquipmentTypes();
        if (equipmentTypes.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving all equipment types from database",
                "There was a problem accessing the database to retrieve the list of equipment types"
            );
        }
        return ResponseEntity.ok(equipmentTypes.get());
    }
    
    public ResponseEntity<EquipmentType> getEquipmentTypeById(String id) {
        Optional<EquipmentType> equipmentType = equipmentTypeRepo.getEquipmentTypeById(id);
        if (equipmentType.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Equipment type not found",
                "No equipment type found with the provided ID"
            );
        }
        return ResponseEntity.ok(equipmentType.get());
    }
      public ResponseEntity<EquipmentType> createEquipmentType(EquipmentType equipmentType, String id) {
        Optional<EquipmentType> createdEquipmentType = equipmentTypeRepo.createEquipmentType(equipmentType, id);
        if (createdEquipmentType.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error creating equipment type",
                "There was a problem accessing the database to create the equipment type"
            );
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEquipmentType.get());
    }
    
    public ResponseEntity<EquipmentType> updateEquipmentType(String id, EquipmentType equipmentType) {
        EquipmentType updatedEquipmentType = equipmentTypeRepo.updateEquipmentType(equipmentType, id).orElseThrow(
            () -> new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Equipment type not found",
                "No equipment type found with the provided ID"
            ));
        return ResponseEntity.ok(updatedEquipmentType);
    }
    
    public ResponseEntity<Void> deleteEquipmentType(String id) {
        boolean deleted = equipmentTypeRepo.deleteEquipmentType(id);
        if (!deleted) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Equipment type not found",
                "No equipment type found with the provided ID"
            );
        }
        return ResponseEntity.noContent().build();
    }
    
    public ResponseEntity<List<EquipmentType>> getActiveEquipmentTypes() {
        Optional<List<EquipmentType>> equipmentTypes = equipmentTypeRepo.getActiveEquipmentTypes();
        if (equipmentTypes.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving active equipment types from database",
                "There was a problem accessing the database to retrieve the list of active equipment types"
            );
        }
        return ResponseEntity.ok(equipmentTypes.get());
    }
}
