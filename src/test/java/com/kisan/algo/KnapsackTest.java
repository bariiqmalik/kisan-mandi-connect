package com.kisan.algo;

import com.kisan.model.CropLot;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests verifying 0/1 Knapsack Dynamic Programming algorithm and lot selection.
 */
class KnapsackTest {

    @Test
    @DisplayName("0/1 Knapsack DP should find maximum profit subset within truck weight limit")
    void testKnapsackDPMaxProfit() {
        List<CropLot> lots = new ArrayList<>();
        lots.add(new CropLot("L1", "Onion Lot A", 10, 20000.0, "Pune APMC"));
        lots.add(new CropLot("L2", "Soybean Lot B", 20, 50000.0, "Latur APMC"));
        lots.add(new CropLot("L3", "Cotton Lot C", 30, 90000.0, "Nagpur APMC"));

        int truckCapacity = 40; // Can take L1 + L3 (10 + 30 = 40 qtl, profit 110,000) vs L2 + L3 (50 > 40)

        KnapsackSolver.KnapsackResult result = KnapsackSolver.solveDP(lots, truckCapacity);

        assertNotNull(result);
        assertEquals(40, result.getTruckCapacityQuintals());
        assertEquals(40, result.getTotalWeightLoaded());
        assertEquals(110000.0, result.getMaxProfitRupees(), 0.001);
        assertEquals(2, result.getSelectedLots().size());

        // Verify selected lots are indeed L1 and L3
        assertTrue(result.getSelectedLots().stream().anyMatch(l -> "L1".equals(l.getLotId())));
        assertTrue(result.getSelectedLots().stream().anyMatch(l -> "L3".equals(l.getLotId())));

        // Verify DP result matches recursive ground-truth solver
        double recursiveProfit = KnapsackSolver.solveRecursive(lots, lots.size(), truckCapacity);
        assertEquals(result.getMaxProfitRupees(), recursiveProfit, 0.001);
    }

    @Test
    @DisplayName("Knapsack handles zero capacity or empty lots gracefully")
    void testKnapsackZeroCapacityOrEmpty() {
        List<CropLot> lots = new ArrayList<>();
        lots.add(new CropLot("L1", "Onion", 10, 15000.0, "Pune APMC"));

        KnapsackSolver.KnapsackResult zeroCap = KnapsackSolver.solveDP(lots, 0);
        assertEquals(0.0, zeroCap.getMaxProfitRupees());
        assertEquals(0, zeroCap.getTotalWeightLoaded());

        KnapsackSolver.KnapsackResult emptyLots = KnapsackSolver.solveDP(Collections.emptyList(), 50);
        assertEquals(0.0, emptyLots.getMaxProfitRupees());
        assertEquals(0, emptyLots.getTotalWeightLoaded());
    }

    @Test
    @DisplayName("Knapsack when all lots exceed capacity")
    void testAllLotsTooHeavy() {
        List<CropLot> lots = new ArrayList<>();
        lots.add(new CropLot("L1", "Heavy Lot", 100, 50000.0, "Mandi"));

        KnapsackSolver.KnapsackResult result = KnapsackSolver.solveDP(lots, 50);
        assertEquals(0.0, result.getMaxProfitRupees());
        assertEquals(0, result.getTotalWeightLoaded());
        assertTrue(result.getSelectedLots().isEmpty());
    }
}
