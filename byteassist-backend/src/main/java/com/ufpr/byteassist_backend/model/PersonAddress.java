package com.ufpr.byteassist_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonAddress {
    public String zip;
    public String number;
    public String street;
    public String neighborhood;
    public String city;
    public String state;
    public String country;
}
