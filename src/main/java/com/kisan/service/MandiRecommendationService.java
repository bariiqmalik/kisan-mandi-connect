package com.kisan.service;

import com.kisan.algo.*;
import com.kisan.exception.InvalidQuantityException;
import com.kisan.exception.MandiNotFoundException;
import com.kisan.exception.NoRouteException;
import com.kisan.model.*;

import java.util.*;

/**
 * Core business service orchestrating mandi evaluation, graph routing, sorting, and optimization.
 * Demonstrates:
 * - Method Overloading: multiple overloaded calculateMandiProfits and rankMandis methods
 * - Fast Hashing lookup using HashMap for Crops and Mandis
 * - Integration of Graph (Dijkstra), Sorting (QuickSort, MergeSort), Heap (Top-K), BST, and Knapsack
 */
public class MandiRecommendationService {

    // In-memory repositories using HashMap for O(1) key access
    private final Map<String, Crop> cropCatalog;
    private final Map<String, Mandi> mandiDirectory;
    private final RoadNetworkGraph roadNetwork;
    private final List<String> registeredVillages;

    public MandiRecommendationService() {
        this.cropCatalog = new HashMap<>();
        this.mandiDirectory = new HashMap<>();
        this.roadNetwork = new RoadNetworkGraph();
        this.registeredVillages = new ArrayList<>();

        initializeData();
    }

    /**
     * Seeds realistic agricultural data for Maharashtra state.
     */
    private void initializeData() {
        // 1. Seed Crops (Perishable and Grain)
        // Perishable crops: (id, name, basePrice, shelfLife, spoilageRatePerHour, coldStorage)
        cropCatalog.put("ONION", new PerishableCrop("ONION", "Nashik Red Onion", 2450.0, 35, 0.0008, false));
        cropCatalog.put("TOMATO", new PerishableCrop("TOMATO", "Hybrid Tomato", 1850.0, 6, 0.0035, false));
        cropCatalog.put("POTATO", new PerishableCrop("POTATO", "Jyoti Potato", 1550.0, 60, 0.0005, false));

        // Grain crops: (id, name, basePrice, shelfLife, maxMoisture, bagPackingCost)
        cropCatalog.put("SOYBEAN", new GrainCrop("SOYBEAN", "Yellow Soybean", 4950.0, 240, 12.0, 45.0));
        cropCatalog.put("WHEAT", new GrainCrop("WHEAT", "Lokwan Sharbati Wheat", 2400.0, 365, 11.5, 40.0));
        cropCatalog.put("COTTON", new GrainCrop("COTTON", "Medium Staple Cotton", 7350.0, 180, 8.5, 60.0));

        // 2. Seed Mandis (Wholesale APMC Markets across Maharashtra)
        Mandi pune = new Mandi("MND_PUN", "Pune APMC (Gultekdi)", "Pune", "Maharashtra", 0.015);
        ponePrices(pune, 2480, 1920, 1600, 4920, 2450, 7250);

        Mandi lasalgaon = new Mandi("MND_LAS", "Lasalgaon APMC", "Nashik", "Maharashtra", 0.012);
        // Lasalgaon is the largest onion market in Asia -> Premium Onion price!
        ponePrices(lasalgaon, 2750, 1780, 1480, 4880, 2380, 7150);

        Mandi nashik = new Mandi("MND_NSK", "Nashik APMC", "Nashik", "Maharashtra", 0.014);
        ponePrices(nashik, 2600, 1890, 1530, 4900, 2410, 7200);

        Mandi ahmednagar = new Mandi("MND_AHM", "Ahmednagar APMC", "Ahmednagar", "Maharashtra", 0.013);
        ponePrices(ahmednagar, 2520, 1810, 1510, 4960, 2420, 7380);

        Mandi kolhapur = new Mandi("MND_KOL", "Kolhapur APMC (Shahupuri)", "Kolhapur", "Maharashtra", 0.015);
        ponePrices(kolhapur, 2420, 1900, 1580, 5050, 2440, 7180);

        Mandi solapur = new Mandi("MND_SOL", "Solapur APMC", "Solapur", "Maharashtra", 0.013);
        ponePrices(solapur, 2580, 1820, 1500, 4980, 2390, 7420);

        Mandi jalgaon = new Mandi("MND_JAL", "Jalgaon APMC", "Jalgaon", "Maharashtra", 0.012);
        ponePrices(jalgaon, 2460, 1750, 1490, 4940, 2400, 7500);

        Mandi latur = new Mandi("MND_LAT", "Latur APMC", "Latur", "Maharashtra", 0.014);
        // Latur is famous for pulse and soybean trading -> High Soybean price!
        ponePrices(latur, 2390, 1790, 1470, 5150, 2430, 7300);

        Mandi vashi = new Mandi("MND_VAS", "Vashi APMC (Navi Mumbai)", "Thane", "Maharashtra", 0.018);
        // Metropolitan demand -> Higher prices across the board
        ponePrices(vashi, 2820, 2150, 1720, 5080, 2520, 7450);

        Mandi nagpur = new Mandi("MND_NAG", "Nagpur APMC (Kalamna)", "Nagpur", "Maharashtra", 0.015);
        ponePrices(nagpur, 2350, 1800, 1520, 5020, 2410, 7600);

        mandiDirectory.put(pune.getId(), pune);
        mandiDirectory.put(lasalgaon.getId(), lasalgaon);
        mandiDirectory.put(nashik.getId(), nashik);
        mandiDirectory.put(ahmednagar.getId(), ahmednagar);
        mandiDirectory.put(kolhapur.getId(), kolhapur);
        mandiDirectory.put(solapur.getId(), solapur);
        mandiDirectory.put(jalgaon.getId(), jalgaon);
        mandiDirectory.put(latur.getId(), latur);
        mandiDirectory.put(vashi.getId(), vashi);
        mandiDirectory.put(nagpur.getId(), nagpur);

        // 3. Seed 15 Rural Villages
        Collections.addAll(registeredVillages,
                "Junnar", "Khed", "Daund", "Shirur", "Baramati",
                "Niphad", "Yeola", "Sinnar", "Dindori", "Rahata",
                "Sangamner", "Karveer", "Mohol", "Pandharpur", "Raver"
        );

        // 4. Build Realistic Road Network Graph (Villages, Junctions & Mandis)
        // Mandi node names in graph match Mandi names
        String mPune = pune.getName();
        String mLasalgaon = lasalgaon.getName();
        String mNashik = nashik.getName();
        String mAhmednagar = ahmednagar.getName();
        String mKolhapur = kolhapur.getName();
        String mSolapur = solapur.getName();
        String mJalgaon = jalgaon.getName();
        String mLatur = latur.getName();
        String mVashi = vashi.getName();
        String mNagpur = nagpur.getName();

        // Roads from Pune cluster villages:
        roadNetwork.addRoad("Junnar", "Narayangaon", 16.0, "State Highway");
        roadNetwork.addRoad("Narayangaon", "Khed", 38.0, "NH60 Highway");
        roadNetwork.addRoad("Khed", mPune, 42.0, "NH60 Highway");
        roadNetwork.addRoad("Narayangaon", "Alephata", 18.0, "NH60 Highway");
        roadNetwork.addRoad("Alephata", mAhmednagar, 72.0, "SH50 Highway");
        roadNetwork.addRoad("Alephata", "Sangamner", 48.0, "NH60 Highway");

        roadNetwork.addRoad("Shirur", mPune, 64.0, "Pune-Nagar Highway");
        roadNetwork.addRoad("Shirur", mAhmednagar, 56.0, "Pune-Nagar Highway");

        roadNetwork.addRoad("Daund", mPune, 82.0, "State Highway");
        roadNetwork.addRoad("Daund", "Shirur", 44.0, "Major District Road");
        roadNetwork.addRoad("Daund", mAhmednagar, 74.0, "State Highway");

        roadNetwork.addRoad("Baramati", mPune, 102.0, "SH61 Highway");
        roadNetwork.addRoad("Baramati", "Daund", 46.0, "Major District Road");
        roadNetwork.addRoad("Baramati", "Phaltan", 38.0, "State Highway");
        roadNetwork.addRoad("Phaltan", "Pandharpur", 85.0, "SH71 Highway");

        // Roads from Nashik cluster villages:
        roadNetwork.addRoad("Niphad", mLasalgaon, 16.0, "MDR Road");
        roadNetwork.addRoad("Niphad", mNashik, 38.0, "Nashik-Aurangabad Highway");
        roadNetwork.addRoad("Yeola", mLasalgaon, 24.0, "SH30 Highway");
        roadNetwork.addRoad("Yeola", "Kopargaon", 28.0, "SH30 Highway");
        roadNetwork.addRoad("Kopargaon", "Rahata", 16.0, "SH10 Highway");
        roadNetwork.addRoad("Rahata", mAhmednagar, 76.0, "Nagar-Manmad Highway");
        roadNetwork.addRoad("Rahata", "Sangamner", 42.0, "SH24 Highway");
        roadNetwork.addRoad("Sangamner", "Sinnar", 48.0, "NH60 Highway");
        roadNetwork.addRoad("Sinnar", mNashik, 28.0, "NH60 Highway");
        roadNetwork.addRoad("Dindori", mNashik, 24.0, "Nashik-Kalwan Road");
        roadNetwork.addRoad("Dindori", "Niphad", 34.0, "Rural Link Road");

        // Southern cluster (Kolhapur & Solapur):
        roadNetwork.addRoad("Karveer", mKolhapur, 14.0, "City Road");
        roadNetwork.addRoad(mKolhapur, "Satara", 120.0, "NH48 Highway");
        roadNetwork.addRoad("Satara", mPune, 112.0, "NH48 Highway");

        roadNetwork.addRoad("Mohol", mSolapur, 34.0, "NH65 Highway");
        roadNetwork.addRoad("Pandharpur", "Mohol", 42.0, "SH161 Highway");
        roadNetwork.addRoad("Pandharpur", mSolapur, 72.0, "NH561 Highway");
        roadNetwork.addRoad(mSolapur, mLatur, 124.0, "NH361 Highway");
        roadNetwork.addRoad("Mohol", "Kurduvadi", 36.0, "SH141 Highway");
        roadNetwork.addRoad("Kurduvadi", "Daund", 95.0, "SH68 Highway");

        // Northern cluster (Jalgaon & Khandesh):
        roadNetwork.addRoad("Raver", "Bhusawal", 32.0, "SH4 Highway");
        roadNetwork.addRoad("Bhusawal", mJalgaon, 26.0, "NH53 Highway");
        roadNetwork.addRoad(mJalgaon, "Dhule", 88.0, "NH53 Highway");
        roadNetwork.addRoad("Dhule", mNashik, 155.0, "NH52 Highway");

        // Highway arteries connecting major mandis:
        roadNetwork.addRoad(mPune, mVashi, 148.0, "Mumbai-Pune Expressway");
        roadNetwork.addRoad(mNashik, mVashi, 162.0, "Mumbai-Nashik Expressway (NH160)");
        roadNetwork.addRoad(mPune, mAhmednagar, 122.0, "SH27 Highway");
        roadNetwork.addRoad(mAhmednagar, "Aurangabad", 114.0, "Nagar-Aurangabad Road");
        roadNetwork.addRoad("Aurangabad", mJalgaon, 158.0, "NH52 Highway");
        roadNetwork.addRoad("Aurangabad", mLatur, 220.0, "NH52 Highway");
        roadNetwork.addRoad(mLatur, "Nanded", 130.0, "NH361 Highway");
        roadNetwork.addRoad("Nanded", "Yavatmal", 185.0, "NH361 Highway");
        roadNetwork.addRoad("Yavatmal", mNagpur, 152.0, "NH361 Highway");
    }

    private void ponePrices(Mandi mandi, double onion, double tomato, double potato,
                            double soybean, double wheat, double cotton) {
        mandi.setCropPrice("ONION", onion);
        mandi.setCropPrice("TOMATO", tomato);
        mandi.setCropPrice("POTATO", potato);
        mandi.setCropPrice("SOYBEAN", soybean);
        mandi.setCropPrice("WHEAT", wheat);
        mandi.setCropPrice("COTTON", cotton);
    }

    /**
     * Calculates the net profit for all mandis that trade the given crop,
     * computing shortest distance via Dijkstra's algorithm.
     *
     * @param cropId Crop identifier (e.g. "ONION")
     * @param quantityQuintals Quantity in quintals
     * @param sourceVillage Origin village
     * @param vehicle Transport vehicle
     * @return List of evaluated MandiProfitResult objects
     */
    public List<MandiProfitResult> calculateMandiProfits(String cropId, double quantityQuintals,
                                                         String sourceVillage, Vehicle vehicle)
            throws InvalidQuantityException, MandiNotFoundException, NoRouteException {

        if (quantityQuintals <= 0) {
            throw new InvalidQuantityException(quantityQuintals);
        }

        Crop crop = cropCatalog.get(cropId != null ? cropId.toUpperCase() : "");
        if (crop == null) {
            throw new MandiNotFoundException("Crop " + cropId);
        }

        if (vehicle == null) {
            vehicle = Vehicle.TRACTOR_TROLLEY; // Default safe vehicle
        }

        // Run Dijkstra's algorithm from source village
        Map<String, RoadNetworkGraph.PathResult> shortestPaths = roadNetwork.computeShortestPaths(sourceVillage);

        List<MandiProfitResult> evaluations = new ArrayList<>();

        for (Mandi mandi : mandiDirectory.values()) {
            if (!mandi.tradesCrop(crop.getId())) {
                continue;
            }

            RoadNetworkGraph.PathResult path = shortestPaths.get(mandi.getName());
            if (path == null) {
                // Mandi unreachable from this village in the current road network
                continue;
            }

            double distanceKm = path.getTotalDistanceKm();
            double pricePerQtl = mandi.getCropPrice(crop.getId());
            double grossRevenue = pricePerQtl * quantityQuintals;

            // Transport freight cost
            double transportCost = vehicle.calculateFreightCost(distanceKm, quantityQuintals);

            // Mandi market fee / cess
            double mandiCess = grossRevenue * mandi.getMarketCessPercent();

            // Transit loss (calculated polymorphically by crop subclass)
            // Average rural transport speed: ~40 km/h
            double hoursInTransit = distanceKm / 40.0;
            double transitLossPerQtl = crop.calculateTransitLossPerQuintal(hoursInTransit);
            double totalTransitLoss = transitLossPerQtl * quantityQuintals;

            MandiProfitResult result = new MandiProfitResult(
                    mandi,
                    crop,
                    quantityQuintals,
                    distanceKm,
                    path.getPathNodes(),
                    pricePerQtl,
                    transportCost,
                    mandiCess,
                    totalTransitLoss
            );

            evaluations.add(result);
        }

        if (evaluations.isEmpty()) {
            throw new NoRouteException(sourceVillage, "Any reachable mandi trading " + crop.getName());
        }

        return evaluations;
    }

    /**
     * Overloaded method: Uses default Tractor Trolley vehicle.
     */
    public List<MandiProfitResult> calculateMandiProfits(String cropId, double quantityQuintals, String sourceVillage)
            throws InvalidQuantityException, MandiNotFoundException, NoRouteException {
        return calculateMandiProfits(cropId, quantityQuintals, sourceVillage, Vehicle.TRACTOR_TROLLEY);
    }

    /**
     * Ranks mandis for a crop using the specified handcrafted sorting algorithm ("QUICK" or "MERGE").
     */
    public List<MandiProfitResult> rankMandis(String cropId, double quantityQuintals,
                                              String sourceVillage, String sortAlgorithm)
            throws InvalidQuantityException, MandiNotFoundException, NoRouteException {

        List<MandiProfitResult> list = calculateMandiProfits(cropId, quantityQuintals, sourceVillage);

        if ("MERGE".equalsIgnoreCase(sortAlgorithm)) {
            MergeSort mergeSort = new MergeSort();
            mergeSort.sort(list);
        } else {
            // Default to QuickSort
            QuickSort quickSort = new QuickSort();
            quickSort.sort(list);
        }

        return list;
    }

    /**
     * Retrieves the Top-K most profitable mandis using the handcrafted Min-Heap algorithm.
     */
    public List<MandiProfitResult> getTopKMandis(String cropId, double quantityQuintals,
                                                 String sourceVillage, int k)
            throws InvalidQuantityException, MandiNotFoundException, NoRouteException {

        List<MandiProfitResult> allResults = calculateMandiProfits(cropId, quantityQuintals, sourceVillage);
        return TopKHeap.getTopK(allResults, k);
    }

    /**
     * Builds a Binary Search Tree (BST) indexing all mandis by price for a specific crop.
     */
    public PriceBST buildPriceBSTForCrop(String cropId) {
        PriceBST bst = new PriceBST();
        Crop crop = cropCatalog.get(cropId != null ? cropId.toUpperCase() : "");
        String cropName = crop != null ? crop.getName() : cropId;

        for (Mandi mandi : mandiDirectory.values()) {
            double price = mandi.getCropPrice(cropId);
            if (price > 0) {
                bst.insert(mandi.getName(), mandi.getDistrict(), cropName, price);
            }
        }
        return bst;
    }

    /**
     * Finds mandis within a crop price range using the handcrafted BST range search.
     */
    public List<PriceBST.MandiPriceEntry> findMandisInPriceRange(String cropId, double minPrice, double maxPrice) {
        PriceBST bst = buildPriceBSTForCrop(cropId);
        return bst.findMandisInPriceRange(minPrice, maxPrice);
    }

    /**
     * Solves the 0/1 Knapsack problem for a truck load of crop lots.
     */
    public KnapsackSolver.KnapsackResult optimizeTruckLoading(List<CropLot> lots, int truckCapacity) {
        return KnapsackSolver.solveDP(lots, truckCapacity);
    }

    // Accessors
    public Map<String, Crop> getCropCatalog() {
        return Collections.unmodifiableMap(cropCatalog);
    }

    public Map<String, Mandi> getMandiDirectory() {
        return Collections.unmodifiableMap(mandiDirectory);
    }

    public RoadNetworkGraph getRoadNetwork() {
        return roadNetwork;
    }

    public List<String> getRegisteredVillages() {
        return Collections.unmodifiableList(registeredVillages);
    }
}
