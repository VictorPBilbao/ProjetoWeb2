package com.ufpr.byteassist_backend.repository;

import java.util.List;
import java.util.Optional;

import com.ufpr.byteassist_backend.model.Equipment;

public interface EquipmentRepoInterface {
    public Optional<List<Equipment>> getAllEquipments();
    public Optional<Equipment> getEquipmentById(String id);
    public Optional<Equipment> createEquipment(Equipment equipment);
    public Boolean deleteEquipment(String id);
    public Optional<Equipment> updateEquipment(Equipment equipment, String id);
    public Optional<List<Equipment>> getEquipmentsByType(String type);
}
