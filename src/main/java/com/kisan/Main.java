package com.kisan;

import com.kisan.algo.KnapsackSolver;
import com.kisan.algo.PriceBST;
import com.kisan.algo.QuickSort;
import com.kisan.algo.MergeSort;
import com.kisan.algo.RoadNetworkGraph;
import com.kisan.exception.InvalidQuantityException;
import com.kisan.exception.KisanException;
import com.kisan.io.ProfitReportWriter;
import com.kisan.io.RoadNetworkSerializer;
import com.kisan.model.Crop;
import com.kisan.model.CropLot;
import com.kisan.model.MandiProfitResult;
import com.kisan.model.Vehicle;
import com.kisan.service.MandiRecommendationService;

import java.io.File;
import java.io.IOException;
import java.util.*;

/**
 * Console Application Interface for Kisan Mandi Connect (Phase 1).
 * Features an interactive menu demonstrating:
 * 1. Mandi Profit Comparison & Ranking (using handcrafted QuickSort or MergeSort)
 * 2. Top-K Best Mandis using Handcrafted Min-Heap (O(N log K))
 * 3. Mandi Search by Crop Price Range using Handcrafted BST
 * 4. Optimal Truck Load Planning using 0/1 Knapsack Dynamic Programming
 * 5. Exporting Results to CSV and Formatted Text Reports
 * 6. Road Network Save & Load using Java Object Serialization
 * 7. Live Algorithm Benchmark (QuickSort vs MergeSort step counts)
 */
public class Main {

    private static final Scanner scanner = new Scanner(System.in);
    private static final MandiRecommendationService service = new MandiRecommendationService();
    private static List<MandiProfitResult> lastResults = null;
    private static String lastSourceVillage = "";

    public static void main(String[] args) {
        printBanner();

        boolean running = true;
        while (running) {
            printMenu();
            System.out.print("Enter your choice (1-8): ");
            String input = scanner.nextLine().trim();

            switch (input) {
                case "1":
                    handleMandiRecommendation();
                    break;
                case "2":
                    handleTopKMandis();
                    break;
                case "3":
                    handlePriceRangeSearchBST();
                    break;
                case "4":
                    handleTruckLoadingKnapsack();
                    break;
                case "5":
                    handleExportReport();
                    break;
                case "6":
                    handleSerializationDemo();
                    break;
                case "7":
                    handleAlgorithmBenchmark();
                    break;
                case "8":
                    System.out.println("\nThank you for using Kisan Mandi Connect. Jai Kisan! Exiting...");
                    running = false;
                    break;
                default:
                    System.out.println("Invalid selection. Please choose an option between 1 and 8.\n");
            }
        }
    }

    private static void printBanner() {
        System.out.println("=========================================================================================");
        System.out.println("                          KISAN MANDI CONNECT - PHASE 1                                 ");
        System.out.println("             Agricultural Decision Support System for Indian Farmers                     ");
        System.out.println("             State: Maharashtra APMC Network | Core Java & DSA Engine                    ");
        System.out.println("=========================================================================================");
    }

    private static void printMenu() {
        System.out.println("\n---------------------------------- MAIN MENU --------------------------------------------");
        System.out.println(" 1. Recommend & Rank Best Mandis for a Crop (Dijkstra + Handcrafted Sort)");
        System.out.println(" 2. Get Top-K Best Mandis (Handcrafted Min-Heap - O(N log K))");
        System.out.println(" 3. Find Mandis in Crop Price Range (Handcrafted Binary Search Tree)");
        System.out.println(" 4. Optimize Truck Loading (0/1 Knapsack Dynamic Programming)");
        System.out.println(" 5. Export Latest Analysis to CSV / Text File (Java IO Package)");
        System.out.println(" 6. Save & Load Road Network via Object Serialization (IO Package)");
        System.out.println(" 7. Algorithm Benchmark & Viva Concepts (QuickSort vs MergeSort Step Counters)");
        System.out.println(" 8. Exit");
        System.out.println("-----------------------------------------------------------------------------------------");
    }

    /**
     * Menu Option 1: Core recommendation flow.
     */
    private static void handleMandiRecommendation() {
        System.out.println("\n--- Option 1: Mandi Net Profit Recommendation ---");

        // 1. Select Crop
        String cropId = promptCropSelection();
        if (cropId == null) return;

        // 2. Select Source Village
        String village = promptVillageSelection();
        if (village == null) return;

        // 3. Enter Quantity
        double quantity = promptQuantity();
        if (quantity <= 0) return;

        // 4. Choose Sorting Algorithm
        System.out.println("\nChoose Sorting Algorithm to rank mandis:");
        System.out.println("  [1] Handcrafted QuickSort (Divide-and-Conquer Lomuto Partition)");
        System.out.println("  [2] Handcrafted MergeSort (Divide-and-Conquer Stable Merge)");
        System.out.print("Select algorithm (default 1): ");
        String algoChoice = scanner.nextLine().trim();
        String sortAlgo = "2".equals(algoChoice) ? "MERGE" : "QUICK";

        try {
            System.out.println("\n[INFO] Running Dijkstra's algorithm to compute shortest road paths from " + village + "...");
            System.out.println("[INFO] Calculating Gross Revenue, Transport Cost, Market Cess, and Spoilage...");
            System.out.println("[INFO] Ranking mandis using Handcrafted " + ("MERGE".equals(sortAlgo) ? "MergeSort" : "QuickSort") + "...");

            List<MandiProfitResult> results = service.rankMandis(cropId, quantity, village, sortAlgo);
            lastResults = results;
            lastSourceVillage = village;

            displayRankedResults(results, village);

        } catch (KisanException e) {
            System.err.println("[ERROR] " + e.getMessage());
        } catch (Exception e) {
            System.err.println("[UNEXPECTED ERROR] " + e.getMessage());
        }
    }

    /**
     * Menu Option 2: Top-K using Heap.
     */
    private static void handleTopKMandis() {
        System.out.println("\n--- Option 2: Top-K Mandis Selection via Handcrafted Heap ---");

        String cropId = promptCropSelection();
        if (cropId == null) return;

        String village = promptVillageSelection();
        if (village == null) return;

        double quantity = promptQuantity();
        if (quantity <= 0) return;

        System.out.print("Enter number of Top Mandis to retrieve (K, e.g. 3): ");
        int k;
        try {
            k = Integer.parseInt(scanner.nextLine().trim());
            if (k <= 0) {
                System.out.println("K must be positive. Defaulting to K = 3.");
                k = 3;
            }
        } catch (NumberFormatException e) {
            System.out.println("Invalid input. Defaulting to K = 3.");
            k = 3;
        }

        try {
            System.out.println("\n[INFO] Running Handcrafted Min-Heap Top-K algorithm (O(N log K))...");
            List<MandiProfitResult> topK = service.getTopKMandis(cropId, quantity, village, k);
            lastResults = topK;
            lastSourceVillage = village;

            System.out.println("\n=========================================================================================");
            System.out.printf("                         TOP %d BEST MANDIS FOR %s FROM %s%n", k, cropId, village);
            System.out.println("=========================================================================================");
            displayRankedResults(topK, village);

        } catch (KisanException e) {
            System.err.println("[ERROR] " + e.getMessage());
        }
    }

    /**
     * Menu Option 3: BST Price Range Query.
     */
    private static void handlePriceRangeSearchBST() {
        System.out.println("\n--- Option 3: Mandi Price Range Search via Handcrafted BST ---");

        String cropId = promptCropSelection();
        if (cropId == null) return;

        System.out.print("Enter Minimum Price per quintal (₹): ");
        double minPrice;
        try {
            minPrice = Double.parseDouble(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            System.out.println("Invalid price format. Aborting.");
            return;
        }

        System.out.print("Enter Maximum Price per quintal (₹): ");
        double maxPrice;
        try {
            maxPrice = Double.parseDouble(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            System.out.println("Invalid price format. Aborting.");
            return;
        }

        System.out.println("\n[INFO] Building Binary Search Tree with crop prices and querying range [" + minPrice + ", " + maxPrice + "]...");
        List<PriceBST.MandiPriceEntry> matches = service.findMandisInPriceRange(cropId, minPrice, maxPrice);

        System.out.println("\n-----------------------------------------------------------------------------------------");
        System.out.printf(" Mandis trading %s in price range ₹%.2f to ₹%.2f (Found: %d)%n", cropId, minPrice, maxPrice, matches.size());
        System.out.println("-----------------------------------------------------------------------------------------");
        if (matches.isEmpty()) {
            System.out.println("No mandis currently trade within this specified price band.");
        } else {
            System.out.printf("%-30s %-18s %-15s %-15s%n", "Mandi Name", "District", "Crop", "Price / Quintal");
            System.out.println("-----------------------------------------------------------------------------------------");
            for (PriceBST.MandiPriceEntry entry : matches) {
                System.out.printf("%-30s %-18s %-15s ₹%-14.2f%n",
                        entry.getMandiName(), entry.getDistrict(), entry.getCropName(), entry.getPricePerQuintal());
            }
        }
    }

    /**
     * Menu Option 4: 0/1 Knapsack Truck Loading Optimizer.
     */
    private static void handleTruckLoadingKnapsack() {
        System.out.println("\n--- Option 4: Truck Load Optimizer (0/1 Knapsack Dynamic Programming) ---");
        System.out.println("Scenario: A farmer has multiple harvested crop lots ready for transport.");
        System.out.println("The vehicle has a strict weight limit (quintals). Maximize total profit without overloading.");

        // Preset realistic harvest lots
        List<CropLot> availableLots = new ArrayList<>();
        availableLots.add(new CropLot("LOT-01", "Nashik Red Onion", 20, 36000.0, "Lasalgaon APMC"));
        availableLots.add(new CropLot("LOT-02", "Yellow Soybean", 30, 72000.0, "Latur APMC"));
        availableLots.add(new CropLot("LOT-03", "Hybrid Tomato", 15, 22500.0, "Pune APMC"));
        availableLots.add(new CropLot("LOT-04", "Lokwan Wheat", 40, 58000.0, "Pune APMC"));
        availableLots.add(new CropLot("LOT-05", "Medium Staple Cotton", 25, 95000.0, "Nagpur APMC"));
        availableLots.add(new CropLot("LOT-06", "Jyoti Potato", 18, 21000.0, "Pune APMC"));

        System.out.println("\nAvailable Crop Harvest Lots:");
        System.out.printf("%-8s %-22s %-15s %-18s %-16s%n", "Lot ID", "Crop Name", "Weight (qtl)", "Net Profit (₹)", "Target Mandi");
        System.out.println("-----------------------------------------------------------------------------------------");
        for (CropLot lot : availableLots) {
            System.out.printf("%-8s %-22s %-15d ₹%-17.2f %-16s%n",
                    lot.getLotId(), lot.getCropName(), lot.getWeightQuintals(), lot.getProfitRupees(), lot.getMandiDestination());
        }

        System.out.print("\nEnter Truck Weight Capacity in Quintals (e.g., 50 for Bolero/Tractor): ");
        int capacity;
        try {
            capacity = Integer.parseInt(scanner.nextLine().trim());
            if (capacity <= 0) capacity = 50;
        } catch (NumberFormatException e) {
            capacity = 50;
            System.out.println("Invalid input. Using default truck capacity = 50 quintals.");
        }

        System.out.println("\n[INFO] Solving 0/1 Knapsack using Bottom-Up Dynamic Programming table dp[i][w]...");
        KnapsackSolver.KnapsackResult result = service.optimizeTruckLoading(availableLots, capacity);

        System.out.println("\n=========================================================================================");
        System.out.println("                           OPTIMAL TRUCK LOADING PLAN                                    ");
        System.out.println("=========================================================================================");
        System.out.printf("Truck Capacity   : %d Quintals%n", result.getTruckCapacityQuintals());
        System.out.printf("Total Weight Used: %d Quintals (Space Left: %d qtl)%n",
                result.getTotalWeightLoaded(), result.getRemainingCapacity());
        System.out.printf("MAXIMUM PROFIT   : ₹%,.2f%n", result.getMaxProfitRupees());
        System.out.println("-----------------------------------------------------------------------------------------");
        System.out.println("Selected Lots to Load onto Truck:");
        for (CropLot lot : result.getSelectedLots()) {
            System.out.printf("  [+] %s - %s (%d qtl) -> ₹%,.2f Profit (Target: %s)%n",
                    lot.getLotId(), lot.getCropName(), lot.getWeightQuintals(), lot.getProfitRupees(), lot.getMandiDestination());
        }
        System.out.println("=========================================================================================");
    }

    /**
     * Menu Option 5: Export to CSV and Text file.
     */
    private static void handleExportReport() {
        System.out.println("\n--- Option 5: Export Profit Analysis Report (Java IO) ---");
        if (lastResults == null || lastResults.isEmpty()) {
            System.out.println("[WARN] No recent analysis found in memory. Please run Option 1 or 2 first.");
            return;
        }

        String csvPath = "data/profit_report.csv";
        String txtPath = "data/profit_summary.txt";

        try {
            ProfitReportWriter.exportToCSV(lastResults, csvPath);
            ProfitReportWriter.exportToTextReport(lastResults, lastSourceVillage, txtPath);

            System.out.println("[SUCCESS] Reports exported successfully!");
            System.out.println("  1. CSV Spreadsheet : " + new File(csvPath).getAbsolutePath());
            System.out.println("  2. Text Summary    : " + new File(txtPath).getAbsolutePath());

        } catch (IOException e) {
            System.err.println("[ERROR] Failed to export report: " + e.getMessage());
        }
    }

    /**
     * Menu Option 6: Save & Load Road Network via Object Serialization.
     */
    private static void handleSerializationDemo() {
        System.out.println("\n--- Option 6: Object Serialization Demo (Save/Load Road Network) ---");
        String filePath = "data/road_network.ser";

        RoadNetworkGraph currentGraph = service.getRoadNetwork();
        System.out.println("Original In-Memory Graph Stats:");
        System.out.printf("  Total Locations/Nodes : %d%n", currentGraph.getNodeCount());
        System.out.printf("  Total Bidirectional Roads: %d%n", currentGraph.getEdgeCount());

        try {
            System.out.println("\n[1] Serializing RoadNetworkGraph to binary file: " + filePath + "...");
            RoadNetworkSerializer.saveNetwork(currentGraph, filePath);
            System.out.println("    Saved successfully. File size: " + new File(filePath).length() + " bytes.");

            System.out.println("\n[2] Deserializing RoadNetworkGraph back from binary file...");
            RoadNetworkGraph loadedGraph = RoadNetworkSerializer.loadNetwork(filePath);
            System.out.println("    Loaded successfully!");
            System.out.printf("    Restored Nodes: %d | Restored Roads: %d%n",
                    loadedGraph.getNodeCount(), loadedGraph.getEdgeCount());

            // Test Dijkstra on restored graph to verify deep object integrity
            RoadNetworkGraph.PathResult testPath = loadedGraph.findShortestPath("Junnar", "Pune APMC (Gultekdi)");
            System.out.printf("    Verification Dijkstra Test: Junnar to Pune APMC = %.1f km via %s%n",
                    testPath.getTotalDistanceKm(), testPath.getFormattedRoute());

        } catch (Exception e) {
            System.err.println("[ERROR] Serialization failed: " + e.getMessage());
        }
    }

    /**
     * Menu Option 7: Benchmark QuickSort vs MergeSort step count.
     */
    private static void handleAlgorithmBenchmark() {
        System.out.println("\n--- Option 7: Viva Algorithm Benchmark (QuickSort vs MergeSort) ---");
        System.out.println("Comparing step counters and stability for student viva presentation.");

        String village = "Junnar";
        String cropId = "ONION";
        double quantity = 80.0;

        try {
            List<MandiProfitResult> sample1 = service.calculateMandiProfits(cropId, quantity, village);
            List<MandiProfitResult> sample2 = service.calculateMandiProfits(cropId, quantity, village);

            QuickSort qs = new QuickSort();
            long qsStart = System.nanoTime();
            qs.sort(sample1);
            long qsTime = System.nanoTime() - qsStart;

            MergeSort ms = new MergeSort();
            long msStart = System.nanoTime();
            ms.sort(sample2);
            long msTime = System.nanoTime() - msStart;

            System.out.println("\nBenchmark Results on Mandi Dataset (N = " + sample1.size() + "):");
            System.out.println("-----------------------------------------------------------------------------------------");
            System.out.printf("%-15s %-18s %-18s %-16s%n", "Algorithm", "Comparisons", "Swaps / Merges", "Exec Time (ns)");
            System.out.println("-----------------------------------------------------------------------------------------");
            System.out.printf("%-15s %-18d %-18d %-16d%n", "QuickSort", qs.getComparisonCount(), qs.getSwapCount(), qsTime);
            System.out.printf("%-15s %-18d %-18d %-16d%n", "MergeSort", ms.getComparisonCount(), ms.getMergeOperations(), msTime);
            System.out.println("-----------------------------------------------------------------------------------------");
            System.out.println("Viva Takeaway: QuickSort works in-place with lower memory overhead;");
            System.out.println("MergeSort is stable and guarantees O(N log N) in all worst-case scenarios.");

        } catch (Exception e) {
            System.err.println("[ERROR] Benchmark failed: " + e.getMessage());
        }
    }

    // Helper Prompts and Display

    private static String promptCropSelection() {
        System.out.println("\nAvailable Crops:");
        Map<String, Crop> crops = service.getCropCatalog();
        List<String> keys = new ArrayList<>(crops.keySet());
        for (int i = 0; i < keys.size(); i++) {
            Crop c = crops.get(keys.get(i));
            System.out.printf("  [%d] %-10s (%s) - Base Price: ₹%.2f/qtl%n",
                    i + 1, c.getName(), c.getCategory(), c.getBasePricePerQuintal());
        }
        System.out.print("Select crop by number (1-" + keys.size() + ") or type code (e.g. ONION): ");
        String sel = scanner.nextLine().trim();

        try {
            int idx = Integer.parseInt(sel) - 1;
            if (idx >= 0 && idx < keys.size()) {
                return keys.get(idx);
            }
        } catch (NumberFormatException ignored) {
        }

        if (crops.containsKey(sel.toUpperCase())) {
            return sel.toUpperCase();
        }

        System.out.println("[WARN] Invalid crop selection.");
        return null;
    }

    private static String promptVillageSelection() {
        System.out.println("\nAvailable Source Villages (Farmer Locations):");
        List<String> villages = service.getRegisteredVillages();
        for (int i = 0; i < villages.size(); i++) {
            System.out.printf("  [%2d] %-14s%s", (i + 1), villages.get(i), ((i + 1) % 4 == 0 ? "\n" : ""));
        }
        System.out.print("\nSelect village by number (1-" + villages.size() + ") or name: ");
        String sel = scanner.nextLine().trim();

        try {
            int idx = Integer.parseInt(sel) - 1;
            if (idx >= 0 && idx < villages.size()) {
                return villages.get(idx);
            }
        } catch (NumberFormatException ignored) {
        }

        for (String v : villages) {
            if (v.equalsIgnoreCase(sel)) {
                return v;
            }
        }

        System.out.println("[WARN] Invalid village selection.");
        return null;
    }

    private static double promptQuantity() {
        System.out.print("Enter harvest quantity in Quintals (1 Quintal = 100 kg, e.g., 50): ");
        String input = scanner.nextLine().trim();
        try {
            double q = Double.parseDouble(input);
            if (q <= 0) {
                throw new InvalidQuantityException(q);
            }
            return q;
        } catch (InvalidQuantityException e) {
            System.err.println("[ERROR] " + e.getMessage());
            return -1;
        } catch (NumberFormatException e) {
            System.err.println("[ERROR] Please enter a valid numeric value for harvest quantity.");
            return -1;
        }
    }

    private static void displayRankedResults(List<MandiProfitResult> results, String village) {
        if (results == null || results.isEmpty()) {
            System.out.println("No mandis found matching the criteria.");
            return;
        }

        MandiProfitResult best = results.get(0);

        System.out.println("\n=========================================================================================");
        System.out.printf("                  RECOMMENDED MANDI RANKING FOR FARMER IN: %s                   %n", village.toUpperCase());
        System.out.println("=========================================================================================");
        System.out.printf("%-4s %-25s %-9s %-12s %-12s %-12s %-14s%n",
                "Rank", "Mandi Name", "Dist(km)", "Price/qtl", "Gross (₹)", "Freight (₹)", "Net Profit (₹)");
        System.out.println("-----------------------------------------------------------------------------------------");

        for (MandiProfitResult r : results) {
            String mark = (r.getRank() == 1) ? " [BEST]" : "";
            System.out.printf("%-4d %-25s %-9.1f ₹%-11.2f ₹%-11.2f ₹%-11.2f ₹%-13.2f%s%n",
                    r.getRank(),
                    r.getMandi().getName(),
                    r.getDistanceKm(),
                    r.getPricePerQuintal(),
                    r.getGrossRevenue(),
                    r.getTransportCost(),
                    r.getNetProfit(),
                    mark
            );
        }

        System.out.println("-----------------------------------------------------------------------------------------");
        System.out.println(">>> BEST OPTION FOR THE FARMER:");
        System.out.printf("    Mandi          : %s (%s, %s)%n",
                best.getMandi().getName(), best.getMandi().getDistrict(), best.getMandi().getState());
        System.out.printf("    Net Profit     : ₹%,.2f%n", best.getNetProfit());
        System.out.printf("    Price Offered  : ₹%.2f / quintal%n", best.getPricePerQuintal());
        System.out.printf("    Gross Revenue  : ₹%,.2f%n", best.getGrossRevenue());
        System.out.printf("    Transport Cost : ₹%,.2f (Distance: %.1f km)%n", best.getTransportCost(), best.getDistanceKm());
        System.out.printf("    Shortest Route : %s%n", best.getRouteDisplay());

        // Comparison with closest mandi if not rank 1
        MandiProfitResult closest = results.stream().min(Comparator.comparingDouble(MandiProfitResult::getDistanceKm)).orElse(best);
        if (!closest.getMandi().getId().equals(best.getMandi().getId())) {
            double extraProfit = best.getNetProfit() - closest.getNetProfit();
            System.out.println("\n*** FARMER INSIGHT ***");
            System.out.printf("    Closest Mandi is '%s' (%.1f km) with Net Profit: ₹%,.2f%n",
                    closest.getMandi().getName(), closest.getDistanceKm(), closest.getNetProfit());
            System.out.printf("    By traveling to '%s', the farmer earns ₹%,.2f MORE NET PROFIT even after transport costs!%n",
                    best.getMandi().getName(), extraProfit);
        }
        System.out.println("=========================================================================================\n");
    }
}
