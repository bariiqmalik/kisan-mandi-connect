package com.kisan.model;

/**
 * Concrete subclass representing Grain Crops (e.g. Wheat, Rice, Soybean, Cotton).
 * Demonstrates:
 * - Inheritance (extends Crop)
 * - Method Overriding (@Override calculateTransitLossPerQuintal)
 * - Specific grain attributes (moisture limits, standard bagging costs)
 */
public class GrainCrop extends Crop {
    private static final long serialVersionUID = 1L;

    private double maxMoisturePercentage; // Permissible moisture level (e.g., 12.0%)
    private double bagPackingCostPerQuintal; // Cost for jute/gunny bags per quintal (₹)

    // Default constructor
    public GrainCrop() {
        super();
        setCategory("GRAIN");
    }

    // Overloaded constructor
    public GrainCrop(String id, String name, double basePricePerQuintal, int shelfLifeDays,
                     double maxMoisturePercentage, double bagPackingCostPerQuintal) {
        super(id, name, "GRAIN", basePricePerQuintal, shelfLifeDays);
        this.maxMoisturePercentage = maxMoisturePercentage;
        this.bagPackingCostPerQuintal = bagPackingCostPerQuintal;
    }

    /**
     * Overridden method: Grains have high shelf life, so transit spoilage is zero
     * during normal road trips, but packaging cost per quintal is added to overheads.
     */
    @Override
    public double calculateTransitLossPerQuintal(double hoursInTransit) {
        // Negligible decay during transit for dry grains; 0 deduction
        return 0.0;
    }

    public double getMaxMoisturePercentage() {
        return maxMoisturePercentage;
    }

    public void setMaxMoisturePercentage(double maxMoisturePercentage) {
        this.maxMoisturePercentage = maxMoisturePercentage;
    }

    public double getBagPackingCostPerQuintal() {
        return bagPackingCostPerQuintal;
    }

    public void setBagPackingCostPerQuintal(double bagPackingCostPerQuintal) {
        this.bagPackingCostPerQuintal = bagPackingCostPerQuintal;
    }

    @Override
    public String toString() {
        return super.toString() + String.format(" [Grain, Max Moisture: %.1f%%, Bag Cost: ₹%.2f/qtl]",
                maxMoisturePercentage, bagPackingCostPerQuintal);
    }
}
