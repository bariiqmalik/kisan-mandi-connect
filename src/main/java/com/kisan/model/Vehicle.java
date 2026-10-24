package com.kisan.model;

import java.io.Serializable;

/**
 * Represents a transport vehicle used by farmers to haul produce to a mandi.
 * Demonstrates:
 * - Static factory presets for standard rural transport modes
 * - Encapsulation and business calculation methods
 */
public class Vehicle implements Serializable {
    private static final long serialVersionUID = 1L;

    private String vehicleType;
    private double capacityQuintals;          // Max load in quintals
    private double costPerKmPerQuintal;       // Rupee cost per km for 1 quintal
    private double fixedLoadingCharge;        // Fixed labor/loading charge in ₹

    // Standard presets for Indian farm transport
    public static final Vehicle BOLERO_PICKUP =
            new Vehicle("Small Pickup (Bolero)", 25.0, 4.00, 200.0);

    public static final Vehicle TRACTOR_TROLLEY =
            new Vehicle("Tractor Trolley", 45.0, 3.80, 300.0);

    public static final Vehicle EICHER_MEDIUM_TRUCK =
            new Vehicle("Medium Truck (Eicher 6-Wheeler)", 90.0, 3.20, 500.0);

    public static final Vehicle HEAVY_TRUCK =
            new Vehicle("Heavy Multi-Axle Truck", 180.0, 2.50, 800.0);

    public Vehicle() {
    }

    public Vehicle(String vehicleType, double capacityQuintals, double costPerKmPerQuintal, double fixedLoadingCharge) {
        this.vehicleType = vehicleType;
        this.capacityQuintals = capacityQuintals;
        this.costPerKmPerQuintal = costPerKmPerQuintal;
        this.fixedLoadingCharge = fixedLoadingCharge;
    }

    /**
     * Calculates the total freight transport cost for hauling a given quantity over a distance.
     *
     * @param distanceKm Shortest road distance in km
     * @param quantityQuintals Quantity of crop in quintals
     * @return Total transport cost in Indian Rupees (₹)
     */
    public double calculateFreightCost(double distanceKm, double quantityQuintals) {
        if (distanceKm <= 0 || quantityQuintals <= 0) {
            return 0.0;
        }
        // Transport cost = (distance * rate per km per quintal * quantity) + fixed loading fee
        return (distanceKm * this.costPerKmPerQuintal * quantityQuintals) + this.fixedLoadingCharge;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public double getCapacityQuintals() {
        return capacityQuintals;
    }

    public void setCapacityQuintals(double capacityQuintals) {
        this.capacityQuintals = capacityQuintals;
    }

    public double getCostPerKmPerQuintal() {
        return costPerKmPerQuintal;
    }

    public void setCostPerKmPerQuintal(double costPerKmPerQuintal) {
        this.costPerKmPerQuintal = costPerKmPerQuintal;
    }

    public double getFixedLoadingCharge() {
        return fixedLoadingCharge;
    }

    public void setFixedLoadingCharge(double fixedLoadingCharge) {
        this.fixedLoadingCharge = fixedLoadingCharge;
    }

    @Override
    public String toString() {
        return String.format("%s (Capacity: %.1f qtl, Rate: ₹%.2f/km/qtl, Loading: ₹%.2f)",
                vehicleType, capacityQuintals, costPerKmPerQuintal, fixedLoadingCharge);
    }
}
