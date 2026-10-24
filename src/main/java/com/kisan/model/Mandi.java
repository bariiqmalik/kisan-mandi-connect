package com.kisan.model;

import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Represents an APMC Mandi (Agricultural Produce Market Committee wholesale yard).
 * Demonstrates:
 * - Encapsulation (private fields, defensive copying in getters)
 * - Static constant (DEFAULT_MARKET_CESS_PERCENT)
 * - Hashing (stores crop prices in a HashMap for O(1) lookup)
 */
public class Mandi implements Serializable {
    private static final long serialVersionUID = 1L;

    // Static constant: Default state APMC cess / market fee (1.5% = 0.015)
    public static final double DEFAULT_MARKET_CESS_PERCENT = 0.015;

    private String id;
    private String name;
    private String district;
    private String state;
    private double marketCessPercent; // APMC user charge fraction
    private Map<String, Double> cropPrices; // Map of cropId -> price per quintal in ₹

    // Default constructor
    public Mandi() {
        this.cropPrices = new HashMap<>();
        this.marketCessPercent = DEFAULT_MARKET_CESS_PERCENT;
    }

    // Parameterized constructor
    public Mandi(String id, String name, String district, String state) {
        this(id, name, district, state, DEFAULT_MARKET_CESS_PERCENT);
    }

    // Overloaded constructor with custom market cess rate
    public Mandi(String id, String name, String district, String state, double marketCessPercent) {
        this.id = id;
        this.name = name;
        this.district = district;
        this.state = state;
        this.marketCessPercent = marketCessPercent;
        this.cropPrices = new HashMap<>();
    }

    /**
     * Associates a crop with its current prevailing auction price at this Mandi.
     *
     * @param cropId Crop identifier
     * @param pricePerQuintal Market price in ₹ per quintal
     */
    public void setCropPrice(String cropId, double pricePerQuintal) {
        if (cropId != null && pricePerQuintal > 0) {
            this.cropPrices.put(cropId.toUpperCase(), pricePerQuintal);
        }
    }

    /**
     * Fast O(1) lookup of crop price in this mandi using HashMap.
     *
     * @param cropId Crop identifier
     * @return Price per quintal, or -1.0 if crop is not traded here
     */
    public double getCropPrice(String cropId) {
        if (cropId == null) {
            return -1.0;
        }
        return this.cropPrices.getOrDefault(cropId.toUpperCase(), -1.0);
    }

    /**
     * Checks if this mandi trades the specified crop.
     */
    public boolean tradesCrop(String cropId) {
        return cropId != null && this.cropPrices.containsKey(cropId.toUpperCase());
    }

    // Getters and Setters
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

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public double getMarketCessPercent() {
        return marketCessPercent;
    }

    public void setMarketCessPercent(double marketCessPercent) {
        this.marketCessPercent = marketCessPercent;
    }

    /**
     * Returns unmodifiable view of crop prices to maintain encapsulation.
     */
    public Map<String, Double> getCropPrices() {
        return Collections.unmodifiableMap(cropPrices);
    }

    @Override
    public String toString() {
        return String.format("%s (%s, %s) [ID: %s, Cess: %.2f%%]",
                name, district, state, id, marketCessPercent * 100);
    }
}
