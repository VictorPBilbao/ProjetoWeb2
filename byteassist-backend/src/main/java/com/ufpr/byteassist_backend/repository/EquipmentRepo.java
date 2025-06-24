package com.ufpr.byteassist_backend.repository;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.surrealdb.UpType;
import com.ufpr.byteassist_backend.model.Equipment;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class EquipmentRepo implements EquipmentRepoInterface {
    private final Surreal db;
    
    public EquipmentRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }
    
    @Override
    public Optional<List<Equipment>> getAllEquipments() {
        try {
            Iterator<Equipment> equipments = db.select(Equipment.class, "Equipment");
            List<Equipment> equipmentList = new ArrayList<>();
            equipments.forEachRemaining(equipmentList::add);
            return Optional.ofNullable(equipmentList);
        } catch (Exception e) {
            throw e;
        }
    }
    
    @Override
    public Optional<Equipment> getEquipmentById(String id) {
        try {
            return db.select(Equipment.class, new RecordId("Equipment", id));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Optional<Equipment> createEquipment(Equipment equipment) {
        try {
            return Optional.ofNullable(db.create(Equipment.class, 
                new RecordId("Equipment", "EQ-" + UUID.randomUUID().toString().replace("-", "").substring(0, 5).toUpperCase()), 
                equipment));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Boolean deleteEquipment(String id) {
        try {
            db.delete(new RecordId("Equipment", id));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Optional<Equipment> updateEquipment(Equipment equipment, String id) {
        try {
            return Optional.ofNullable(db.update(Equipment.class, new RecordId("Equipment", id), UpType.MERGE, equipment));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Optional<List<Equipment>> getEquipmentsByType(String type) {
        try {
            String query = "SELECT * FROM Equipment WHERE type = $type";
            Response response = db.queryBind(query, Map.of("type", type));
            
            List<Equipment> equipments = new ArrayList<>();
            for (var equipmentRecord : response.take(0).getArray()) {
                Equipment equipment = equipmentRecord.get(Equipment.class);
                equipments.add(equipment);
            }
            return Optional.of(equipments);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
