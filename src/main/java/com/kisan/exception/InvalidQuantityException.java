package com.kisan.exception;

/**
 * Custom exception thrown when a farmer enters an invalid crop quantity (e.g., negative or zero).
 */
public class InvalidQuantityException extends KisanException {
    private static final long serialVersionUID = 1L;

    private final double attemptedQuantity;

    public InvalidQuantityException(double attemptedQuantity) {
        super(String.format("Invalid harvest quantity: %.2f quintals. Quantity must be greater than 0.", attemptedQuantity));
        this.attemptedQuantity = attemptedQuantity;
    }

    public InvalidQuantityException(String message, double attemptedQuantity) {
        super(message);
        this.attemptedQuantity = attemptedQuantity;
    }

    public double getAttemptedQuantity() {
        return attemptedQuantity;
    }
}
