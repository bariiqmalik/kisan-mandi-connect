package com.kisan.algo;

import com.kisan.model.CropLot;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Handcrafted 0/1 Knapsack Dynamic Programming Algorithm for optimizing truck loading.
 *
 * Problem Formulation (Viva explanation):
 * - A farmer has 'N' distinct crop harvest lots.
 * - Each lot 'i' has:
 *     - Weight in quintals: weight[i]
 *     - Net profit value: profit[i]
 * - A transport vehicle (e.g. pickup, tractor or truck) has a strict maximum weight capacity 'W' quintals.
 * - Decision: For each lot, choose 0 (exclude) or 1 (include) such that:
 *     Total weight <= W and Total net profit is MAXIMIZED.
 *
 * Dynamic Programming Recurrence:
 *   dp[i][w] = maximum profit using a subset of first 'i' items with truck capacity 'w'
 *   Base Case:
 *     dp[0][w] = 0 for all w
 *     dp[i][0] = 0 for all i
 *   Transitions:
 *     If weight[i - 1] > w:
 *         dp[i][w] = dp[i - 1][w]   (Cannot include this lot)
 *     Else:
 *         dp[i][w] = Math.max(dp[i - 1][w], profit[i - 1] + dp[i - 1][w - weight[i - 1]])
 *
 * Time Complexity: O(N * W) pseudo-polynomial time.
 * Space Complexity: O(N * W) for the DP memoization table.
 */
public class KnapsackSolver {

    /**
     * Inner class representing the optimal loading solution.
     */
    public static class KnapsackResult {
        private final int truckCapacityQuintals;
        private final int totalWeightLoaded;
        private final double maxProfitRupees;
        private final List<CropLot> selectedLots;

        public KnapsackResult(int truckCapacityQuintals, int totalWeightLoaded,
                              double maxProfitRupees, List<CropLot> selectedLots) {
            this.truckCapacityQuintals = truckCapacityQuintals;
            this.totalWeightLoaded = totalWeightLoaded;
            this.maxProfitRupees = maxProfitRupees;
            this.selectedLots = selectedLots;
        }

        public int getTruckCapacityQuintals() {
            return truckCapacityQuintals;
        }

        public int getTotalWeightLoaded() {
            return totalWeightLoaded;
        }

        public double getMaxProfitRupees() {
            return maxProfitRupees;
        }

        public List<CropLot> getSelectedLots() {
            return Collections.unmodifiableList(selectedLots);
        }

        public int getRemainingCapacity() {
            return truckCapacityQuintals - totalWeightLoaded;
        }

        @Override
        public String toString() {
            return String.format("Capacity: %d qtl | Loaded: %d qtl | Max Profit: ₹%.2f | Lots: %d",
                    truckCapacityQuintals, totalWeightLoaded, maxProfitRupees, selectedLots.size());
        }
    }

    /**
     * Solves the 0/1 Knapsack problem using Dynamic Programming (Bottom-Up Tabulation).
     *
     * @param lots Available crop lots
     * @param capacity Maximum weight capacity of the truck (in quintals)
     * @return KnapsackResult containing max profit and the chosen crop lots
     */
    public static KnapsackResult solveDP(List<CropLot> lots, int capacity) {
        if (lots == null || lots.isEmpty() || capacity <= 0) {
            return new KnapsackResult(capacity, 0, 0.0, Collections.emptyList());
        }

        int n = lots.size();
        // 2D DP table: dp[i][w] stores maximum profit with first i items and weight limit w
        double[][] dp = new double[n + 1][capacity + 1];

        // 1. Fill the DP table iteratively
        for (int i = 1; i <= n; i++) {
            CropLot currentLot = lots.get(i - 1);
            int itemWeight = currentLot.getWeightQuintals();
            double itemProfit = currentLot.getProfitRupees();

            for (int w = 1; w <= capacity; w++) {
                if (itemWeight <= w) {
                    // Option 1: Exclude item i
                    double excludeProfit = dp[i - 1][w];
                    // Option 2: Include item i
                    double includeProfit = itemProfit + dp[i - 1][w - itemWeight];
                    dp[i][w] = Math.max(excludeProfit, includeProfit);
                } else {
                    // Item too heavy for current capacity w
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        double maxProfit = dp[n][capacity];

        // 2. Backtrack through DP table to identify which specific lots were selected
        List<CropLot> selectedLots = new ArrayList<>();
        int w = capacity;
        int totalLoadedWeight = 0;

        for (int i = n; i > 0; i--) {
            // If the profit differs from the cell directly above, item i-1 was included!
            if (Double.compare(dp[i][w], dp[i - 1][w]) != 0) {
                CropLot includedLot = lots.get(i - 1);
                selectedLots.add(includedLot);
                w -= includedLot.getWeightQuintals();
                totalLoadedWeight += includedLot.getWeightQuintals();
            }
        }

        // Reverse to retain natural order
        Collections.reverse(selectedLots);

        return new KnapsackResult(capacity, totalLoadedWeight, maxProfit, selectedLots);
    }

    /**
     * Pure recursive formulation of 0/1 Knapsack (Demonstrates recursion syllabus topic).
     * Illustrates the decision tree: at each step we branch into 2 sub-problems:
     * 1. Exclude the current lot
     * 2. Include the current lot (if it fits)
     *
     * Recurrence relation:
     *   T(n, w) = max( T(n - 1, w), profit[n] + T(n - 1, w - weight[n]) )
     */
    public static double solveRecursive(List<CropLot> lots, int n, int capacity) {
        // Base Case: No items left or capacity exhausted
        if (n == 0 || capacity == 0) {
            return 0.0;
        }

        CropLot last = lots.get(n - 1);

        // If weight of current item exceeds remaining capacity, it cannot be included
        if (last.getWeightQuintals() > capacity) {
            return solveRecursive(lots, n - 1, capacity);
        }

        // Return maximum of: (1) item included, (2) item not included
        double include = last.getProfitRupees() +
                solveRecursive(lots, n - 1, capacity - last.getWeightQuintals());
        double exclude = solveRecursive(lots, n - 1, capacity);

        return Math.max(include, exclude);
    }
}
