package com.kisan.model;

/**
 * Concrete subclass representing Perishable Crops (e.g. Tomato, Onion, Potato).
 * Demonstrates:
 * - Inheritance (extends Crop)
 * - Method Overriding (@Override calculateTransitLossPerQuintal)
 * - Constructor chaining via super()
 */
public class PerishableCrop extends Crop {
    private static final long serialVersionUID = 1L;

    private double spoilageRatePerHour; // Rate of quality loss per hour during transit (e.g., 0.002 = 0.2%/hr)
    private boolean requiresColdStorage; // Cold chain requirement

    // Default constructor
    public PerishableCrop() {
        super();
        setCategory("PERISHABLE");
    }

    // Overloaded constructor with basic details
    public PerishableCrop(String id, String name, double basePricePerQuintal, int shelfLifeDays) {
        super(id, name, "PERISHABLE", basePricePerQuintal, shelfLifeDays);
        this.spoilageRatePerHour = 0.0015; // default 0.15% per hour
        this.requiresColdStorage = false;
    }

    // Fully parameterized constructor
    public PerishableCrop(String id, String name, double basePricePerQuintal, int shelfLifeDays,
                         double spoilageRatePerHour, boolean requiresColdStorage) {
        super(id, name, "PERISHABLE", basePricePerQuintal, shelfLifeDays);
        this.spoilageRatePerHour = spoilageRatePerHour;
        this.requiresColdStorage = requiresColdStorage;
    }

    /**
     * Overridden method: calculates loss in rupee value due to transit heat/delay.
     * Formula: loss = basePrice * (hours * spoilageRatePerHour)
     */
    @Override
    public double calculateTransitLossPerQuintal(double hoursInTransit) {
        if (hoursInTransit <= 0) {
            return 0.0;
        }
        // If cold storage is active, loss is mitigated by 60%
        double effectiveRate = requiresColdStorage ? (spoilageRatePerHour * 0.4) : spoilageRatePerHour;
        double lossFraction = Math.min(0.25, hoursInTransit * effectiveRate); // cap at 25% max loss
        return getBasePricePerQuintal() * lossFraction;
    }

    public double getSpoilageRatePerHour() {
        return spoilageRatePerHour;
    }

    public void setSpoilageRatePerHour(double spoilageRatePerHour) {
        this.spoilageRatePerHour = spoilageRatePerHour;
    }

    public boolean isRequiresColdStorage() {
        return requiresColdStorage;
    }

    public void setRequiresColdStorage(boolean requiresColdStorage) {
        this.requiresColdStorage = requiresColdStorage;
    }

    @Override
    public String toString() {
        return super.toString() + String.format(" [Perishable, Spoilage/hr: %.3f%%, Cold Storage: %s]",
                spoilageRatePerHour * 100, requiresColdStorage ? "Yes" : "No");
    }
}
