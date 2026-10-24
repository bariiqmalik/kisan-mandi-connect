package com.kisan.model;

import java.io.Serializable;

/**
 * Abstract base class representing a Crop in the agricultural trading system.
 * Demonstrates OOP concepts:
 * - Abstraction: abstract class with both concrete and abstract methods.
 * - Encapsulation: private and protected fields with public accessors.
 * - Polymorphism: overridden behavior in PerishableCrop and GrainCrop.
 */
public abstract class Crop implements Serializable {
    private static final long serialVersionUID = 1L;

    // Encapsulated properties
    private String id;
    private String name;
    private String category; // e.g. "PERISHABLE", "GRAIN", "CASH_CROP"
    protected double basePricePerQuintal; // In Indian Rupees (INR) per Quintal (100 kg)
    protected int shelfLifeDays;          // Maximum days before deterioration

    // Default constructor
    public Crop() {
    }

    // Parameterized constructor (Constructor Overloading)
    public Crop(String id, String name, String category, double basePricePerQuintal, int shelfLifeDays) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.basePricePerQuintal = basePricePerQuintal;
        this.shelfLifeDays = shelfLifeDays;
    }

    /**
     * Abstract method to calculate spoilage/handling deduction based on transit time.
     * Concrete subclasses must provide their specific crop-type implementation.
     *
     * @param hoursInTransit Estimated transit time in hours
     * @return Deducted amount or discount factor per quintal
     */
    public abstract double calculateTransitLossPerQuintal(double hoursInTransit);

    /**
     * Concrete method to check if crop is perishable.
     */
    public boolean isPerishable() {
        return "PERISHABLE".equalsIgnoreCase(this.category);
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getBasePricePerQuintal() {
        return basePricePerQuintal;
    }

    public void setBasePricePerQuintal(double basePricePerQuintal) {
        this.basePricePerQuintal = basePricePerQuintal;
    }

    public int getShelfLifeDays() {
        return shelfLifeDays;
    }

    public void setShelfLifeDays(int shelfLifeDays) {
        this.shelfLifeDays = shelfLifeDays;
    }

    @Override
    public String toString() {
        return String.format("%s (ID: %s, Category: %s, Base: ₹%.2f/qtl, Shelf Life: %d days)",
                name, id, category, basePricePerQuintal, shelfLifeDays);
    }
}
