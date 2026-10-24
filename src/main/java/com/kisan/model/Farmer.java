package com.kisan.model;

import java.io.Serializable;

/**
 * Represents a Farmer using the Kisan Mandi Connect platform.
 */
public class Farmer implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String village;
    private String district;
    private String contactNumber;

    public Farmer() {
    }

    public Farmer(String id, String name, String village, String district, String contactNumber) {
        this.id = id;
        this.name = name;
        this.village = village;
        this.district = district;
        this.contactNumber = contactNumber;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    @Override
    public String toString() {
        return String.format("Farmer: %s (Village: %s, District: %s, Ph: %s)",
                name, village, district, contactNumber);
    }
}
