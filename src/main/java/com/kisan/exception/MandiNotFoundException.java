package com.kisan.exception;

/**
 * Custom exception thrown when a requested Mandi or crop listing is not found.
 */
public class MandiNotFoundException extends KisanException {
    private static final long serialVersionUID = 1L;

    private final String identifier;

    public MandiNotFoundException(String identifier) {
        super(String.format("Mandi or crop record not found for identifier: '%s'.", identifier));
        this.identifier = identifier;
    }

    public String getIdentifier() {
        return identifier;
    }
}
