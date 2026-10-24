package com.kisan.model;

import java.io.Serializable;

/**
 * Represents an individual harvest lot of a crop ready for dispatch.
 * Used by the 0/1 Knapsack dynamic programming algorithm to decide which lots to load
 * onto a truck with a strict weight capacity for maximum net revenue.
 */
public class CropLot implements Serializable {
    private static final long serialVersionUID = 1L;

    private String lotId;
    private String cropName;
    private int weightQuintals;      // Weight in quintals (integer capacity for standard 0/1 knapsack)
    private double profitRupees;     // Net profit expected if this lot is sold
    private String mandiDestination; // Target mandi

    public CropLot() {
    }

    public CropLot(String lotId, String cropName, int weightQuintals, double profitRupees, String mandiDestination) {
        this.lotId = lotId;
        this.cropName = cropName;
        this.weightQuintals = weightQuintals;
        this.profitRupees = profitRupees;
        this.mandiDestination = mandiDestination;
    }

    public String getLotId() {
        return lotId;
    }

    public void setLotId(String lotId) {
        this.lotId = lotId;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public int getWeightQuintals() {
        return weightQuintals;
    }

    public void setWeightQuintals(int weightQuintals) {
        this.weightQuintals = weightQuintals;
    }

    public double getProfitRupees() {
        return profitRupees;
    }

    public void setProfitRupees(double profitRupees) {
        this.profitRupees = profitRupees;
    }

    public String getMandiDestination() {
        return mandiDestination;
    }

    public void setMandiDestination(String mandiDestination) {
        this.mandiDestination = mandiDestination;
    }

    /**
     * Profit density (profit per quintal) - useful heuristic for Knapsack comparison.
     */
    public double getProfitDensity() {
        return weightQuintals > 0 ? (profitRupees / weightQuintals) : 0.0;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s - %d qtl | Net Profit: ₹%.2f (Density: ₹%.2f/qtl) -> %s",
                lotId, cropName, weightQuintals, profitRupees, getProfitDensity(), mandiDestination);
    }
}
