package com.ufpr.byteassist_backend.repository;

import java.util.List;
import java.util.Optional;

import com.ufpr.byteassist_backend.model.EquipmentType;

public interface EquipmentTypeRepoInterface {
    public Optional<List<EquipmentType>> getAllEquipmentTypes();
    public Optional<EquipmentType> getEquipmentTypeById(String id);
    public Optional<EquipmentType> createEquipmentType(EquipmentType equipmentType, String id);
    public Boolean deleteEquipmentType(String id);
    public Optional<EquipmentType> updateEquipmentType(EquipmentType equipmentType, String id);
    public Optional<List<EquipmentType>> getActiveEquipmentTypes();
}
