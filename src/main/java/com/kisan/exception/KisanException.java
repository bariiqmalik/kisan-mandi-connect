package com.kisan.exception;

/**
 * Base custom checked exception for Kisan Mandi Connect domain errors.
 * Demonstrates:
 * - Exception hierarchy in Java
 * - Custom error messaging and cause chaining
 */
public class KisanException extends Exception {
    private static final long serialVersionUID = 1L;

    public KisanException(String message) {
        super(message);
    }

    public KisanException(String message, Throwable cause) {
        super(message, cause);
    }
}
