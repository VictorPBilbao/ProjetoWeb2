package com.ufpr.byteassist_backend.model;

import com.surrealdb.RecordId;

public class User {
    public RecordId id;
    public String name;
    public int age;

    public User() {
    }

    public User(RecordId id, String name, int age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
