package com.ufpr.byteassist_backend.repository;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.surrealdb.UpType;
import com.ufpr.byteassist_backend.model.EquipmentType;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class EquipmentTypeRepo implements EquipmentTypeRepoInterface {
    private final Surreal db;

    public EquipmentTypeRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

    @Override
    public Optional<List<EquipmentType>> getAllEquipmentTypes() {
        try {
            Iterator<EquipmentType> equipmentTypes = db.select(EquipmentType.class, "EquipmentType");
            List<EquipmentType> equipmentTypeList = new ArrayList<>();
            equipmentTypes.forEachRemaining(equipmentTypeList::add);
            return Optional.ofNullable(equipmentTypeList);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<EquipmentType> getEquipmentTypeById(String id) {
        try {
            return db.select(EquipmentType.class, new RecordId("EquipmentType", id));
        } catch (Exception e) {
            return Optional.empty();
        }
    }    @Override
    public Optional<EquipmentType> createEquipmentType(EquipmentType equipmentType, String id) {
        try {
            // Set the createdAt timestamp
            equipmentType.setCreatedAt(ZonedDateTime.now());
            // Set active to true by default (since it's a primitive boolean, it defaults to
            // false)
            equipmentType.setActive(true);

            return Optional.ofNullable(db.create(EquipmentType.class,
                    new RecordId("EquipmentType", id),
                    equipmentType));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Boolean deleteEquipmentType(String id) {
        try {
            db.delete(new RecordId("EquipmentType", id));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Optional<EquipmentType> updateEquipmentType(EquipmentType equipmentType, String id) {
        try {
            return Optional.ofNullable(
                    db.update(EquipmentType.class, new RecordId("EquipmentType", id), UpType.MERGE, equipmentType));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<List<EquipmentType>> getActiveEquipmentTypes() {
        try {
            String query = "SELECT * FROM EquipmentType WHERE active = true";
            Response response = db.query(query);

            List<EquipmentType> equipmentTypes = new ArrayList<>();
            for (var equipmentTypeRecord : response.take(0).getArray()) {
                EquipmentType equipmentType = equipmentTypeRecord.get(EquipmentType.class);
                equipmentTypes.add(equipmentType);
            }
            return Optional.of(equipmentTypes);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
