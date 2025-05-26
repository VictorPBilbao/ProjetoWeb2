package com.ufpr.byteassist_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.model.Equipment;
import com.ufpr.byteassist_backend.repository.EquipmentRepoInterface;

@Service
public class EquipmentService {
    private final EquipmentRepoInterface equipmentRepo;

    public EquipmentService(EquipmentRepoInterface equipmentRepo) {
        this.equipmentRepo = equipmentRepo;
    }
    
    public ResponseEntity<List<Equipment>> getAllEquipments() {
        Optional<List<Equipment>> equipments = equipmentRepo.getAllEquipments();
        if (equipments.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving all equipments from database",
                "There was a problem accessing the database to retrieve the list of equipments"
            );
        }
        return ResponseEntity.ok(equipments.get());
    }
    
    public ResponseEntity<Equipment> getEquipmentById(String id) {
        Optional<Equipment> equipment = equipmentRepo.getEquipmentById(id);
        if (equipment.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Equipment not found",
                "No equipment found with the provided ID"
            );
        }
        return ResponseEntity.ok(equipment.get());
    }
    
    public ResponseEntity<Equipment> createEquipment(Equipment equipment) {
        Optional<Equipment> createdEquipment = equipmentRepo.createEquipment(equipment);
        if (createdEquipment.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error creating equipment",
                "There was a problem accessing the database to create the equipment"
            );
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEquipment.get());
    }
    
    public ResponseEntity<Equipment> updateEquipment(String id, Equipment equipment) {
        Equipment updatedEquipment = equipmentRepo.updateEquipment(equipment, id).orElseThrow(
            () -> new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Equipment not found",
                "No equipment found with the provided ID"
            ));
        return ResponseEntity.ok(updatedEquipment);
    }
    
    public ResponseEntity<Void> deleteEquipment(String id) {
        boolean deleted = equipmentRepo.deleteEquipment(id);
        if (!deleted) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Equipment not found",
                "No equipment found with the provided ID"
            );
        }
        return ResponseEntity.noContent().build();
    }
    
    public ResponseEntity<List<Equipment>> getEquipmentsByType(String type) {
        Optional<List<Equipment>> equipments = equipmentRepo.getEquipmentsByType(type);
        if (equipments.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving equipments by type from database",
                "There was a problem accessing the database to retrieve the list of equipments"
            );
        }
        return ResponseEntity.ok(equipments.get());
    }
}
