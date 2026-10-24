package com.kisan.algo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests verifying PriceBST insertion, inorder sorted traversal, and range queries.
 */
class PriceBSTTest {

    private PriceBST bst;

    @BeforeEach
    void setUp() {
        bst = new PriceBST();
        bst.insert("Pune APMC", "Pune", "ONION", 2450.0);
        bst.insert("Lasalgaon APMC", "Nashik", "ONION", 2750.0);
        bst.insert("Nashik APMC", "Nashik", "ONION", 2600.0);
        bst.insert("Ahmednagar APMC", "Ahmednagar", "ONION", 2500.0);
        bst.insert("Solapur APMC", "Solapur", "ONION", 2300.0);
    }

    @Test
    @DisplayName("Inorder traversal should return mandis sorted in ascending price order")
    void testInorderTraversalSorted() {
        List<PriceBST.MandiPriceEntry> entries = bst.getInorderList();

        assertEquals(5, entries.size());
        assertEquals(2300.0, entries.get(0).getPricePerQuintal());
        assertEquals("Solapur APMC", entries.get(0).getMandiName());

        assertEquals(2450.0, entries.get(1).getPricePerQuintal());
        assertEquals("Pune APMC", entries.get(1).getMandiName());

        assertEquals(2500.0, entries.get(2).getPricePerQuintal());
        assertEquals(2600.0, entries.get(3).getPricePerQuintal());

        assertEquals(2750.0, entries.get(4).getPricePerQuintal());
        assertEquals("Lasalgaon APMC", entries.get(4).getMandiName());
    }

    @Test
    @DisplayName("Range query should return only mandis within [minPrice, maxPrice]")
    void testPriceRangeQuery() {
        // Query range [2450, 2650] -> Expect Pune (2450), Ahmednagar (2500), Nashik (2600)
        List<PriceBST.MandiPriceEntry> results = bst.findMandisInPriceRange(2450.0, 2650.0);

        assertEquals(3, results.size());
        for (PriceBST.MandiPriceEntry entry : results) {
            assertTrue(entry.getPricePerQuintal() >= 2450.0 && entry.getPricePerQuintal() <= 2650.0,
                    "Price should be within query band");
        }
    }

    @Test
    @DisplayName("Empty range returns empty list")
    void testEmptyRange() {
        List<PriceBST.MandiPriceEntry> results = bst.findMandisInPriceRange(3000.0, 4000.0);
        assertTrue(results.isEmpty());
    }
}
