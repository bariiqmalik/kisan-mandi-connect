# Kisan Mandi Connect (किसान मंडी कनेक्ट)
### Agricultural Decision Support & Logistics Optimization System for Indian Farmers

A comprehensive Java mini-project for college curriculum integrating Core Java, Object-Oriented Programming (OOP), Data Structures & Algorithms (DSA), Exception Handling, and File I/O.

---

## 📌 Problem Statement
Indian farmers often sell their harvested produce at the nearest local mandi because they lack transparent information to compare market prices and transport costs across nearby wholesale markets. In many cases, traveling an extra 20–50 km to a higher-paying mandi can yield thousands of rupees in higher **Net Profit**, even after accounting for transport freight and market fees:

$$\text{Net Profit} = (\text{Mandi Price} \times \text{Quantity}) - \text{Transport Freight} - \text{Market Cess} - \text{Transit Spoilage}$$

Additionally, when transporting produce, farmers face vehicle load restrictions. The app solves the **0/1 Knapsack Problem** using Dynamic Programming to determine the optimal subset of crop harvest lots to load on a truck for maximum profit without overloading.

---

## 📂 Phase 1 Architecture & Package Structure

```
kisan-mandi-connect/
├── pom.xml                                  # Maven project configuration (Java 17+, JUnit 5)
├── run.bat                                  # 1-Click launcher script for Windows
├── data/                                    # Generated output files
│   ├── profit_report.csv                    # Exported CSV spreadsheet
│   ├── profit_summary.txt                   # Exported human-readable summary
│   └── road_network.ser                     # Serialized binary road network graph
├── src/
│   ├── main/java/com/kisan/
│   │   ├── Main.java                        # Interactive Console UI & Menu
│   │   ├── model/                           # Domain Entities (OOP)
│   │   │   ├── Crop.java                    # Abstract Base Class
│   │   │   ├── PerishableCrop.java          # Subclass (Onion, Tomato, Potato)
│   │   │   ├── GrainCrop.java               # Subclass (Soybean, Wheat, Cotton)
│   │   │   ├── Mandi.java                   # APMC wholesale market entity
│   │   │   ├── Farmer.java                  # Farmer profile entity
│   │   │   ├── Vehicle.java                 # Transport presets & freight calculations
│   │   │   ├── MandiProfitResult.java       # Comparable profit evaluation model
│   │   │   └── CropLot.java                 # Harvest lot model for Knapsack
│   │   ├── algo/                            # Handcrafted Algorithms & Data Structures
│   │   │   ├── RoadNetworkGraph.java        # Adjacency List Graph + Handcrafted Dijkstra
│   │   │   ├── QuickSort.java               # In-place Lomuto QuickSort (Descending order)
│   │   │   ├── MergeSort.java               # Divide-and-Conquer Stable MergeSort
│   │   │   ├── TopKHeap.java                # Handcrafted Min-Heap for Top-K in O(N log K)
│   │   │   ├── PriceBST.java                # Binary Search Tree with Pruned Range Query
│   │   │   └── KnapsackSolver.java          # 0/1 Knapsack Dynamic Programming & Recursion
│   │   ├── exception/                       # Custom Checked Exceptions
│   │   │   ├── KisanException.java          # Base Exception
│   │   │   ├── InvalidQuantityException.java# Thrown for non-positive quantities
│   │   │   ├── MandiNotFoundException.java  # Thrown for unknown mandis or crops
│   │   │   └── NoRouteException.java        # Thrown when a destination is unreachable
│   │   ├── io/                              # Input/Output & Object Serialization
│   │   │   ├── ProfitReportWriter.java      # CSV and Text Report Writer
│   │   │   └── RoadNetworkSerializer.java   # ObjectOutputStream/InputStream serializer
│   │   └── service/
│   │       └── MandiRecommendationService.java # Business service & Maharashtra dataset
│   └── test/java/com/kisan/algo/            # JUnit 5 Test Suite (15 Tests)
│       ├── DijkstraTest.java
│       ├── KnapsackTest.java
│       ├── PriceBSTTest.java
│       ├── SortingTest.java
│       └── TopKHeapTest.java
```

---

## 🎓 Syllabus Topics Implemented & Viva Explanations

| Topic | Class / Implementation | Viva Key Point |
|---|---|---|
| **Abstract Class** | [`Crop`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/model/Crop.java) | Abstract method `calculateTransitLossPerQuintal()` cannot be instantiated directly; provides common base state. |
| **Inheritance & Polymorphism** | [`PerishableCrop`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/model/PerishableCrop.java), [`GrainCrop`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/model/GrainCrop.java) | Dynamic method dispatch: Perishables compute hourly spoilage; grains compute storage packaging overhead. |
| **Method Overloading** | [`MandiRecommendationService`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/service/MandiRecommendationService.java) | Multiple versions of `calculateMandiProfits` with different signatures (with/without custom `Vehicle`). |
| **Encapsulation & Access Control** | All Models | Fields are `private` with `public` getters/setters and defensive unmodifiable list views. |
| **Static & Inner Classes** | `RoadNetworkGraph.Edge`, `RoadNetworkGraph.PathResult`, `PriceBST.BSTNode` | Nested classes logically bound to outer structure; static constants for fee rates and vehicles. |
| **Custom Exceptions** | [`InvalidQuantityException`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/exception/InvalidQuantityException.java), [`NoRouteException`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/exception/NoRouteException.java) | Extends `KisanException` (checked exception); ensures graceful error handling with informative messages. |
| **Dijkstra's Algorithm** | [`RoadNetworkGraph`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/algo/RoadNetworkGraph.java) | Handcrafted shortest path using Adjacency List and Min-Priority Queue in $O((V+E)\log V)$ time. |
| **QuickSort (by hand)** | [`QuickSort`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/algo/QuickSort.java) | In-place partition with step counters; sorts mandis in descending profit order in $O(N\log N)$ average time. |
| **MergeSort (by hand)** | [`MergeSort`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/algo/MergeSort.java) | Stable divide-and-conquer; guarantees $O(N\log N)$ time across best, average, and worst cases. |
| **Top-K Min Heap** | [`TopKHeap`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/algo/TopKHeap.java) | Bounded Min-Heap of size $K$ to find top $K$ mandis in $O(N\log K)$ time instead of full $O(N\log N)$ sort. |
| **Binary Search Tree** | [`PriceBST`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/algo/PriceBST.java) | Handcrafted BST for crop prices; inorder traversal yields sorted list; range search prunes unneeded subtrees. |
| **0/1 Knapsack (DP)** | [`KnapsackSolver`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/algo/KnapsackSolver.java) | Bottom-up dynamic programming 2D table $dp[i][w]$; backtracks to find the exact subset of crop lots loaded. |
| **Recursion** | `KnapsackSolver.solveRecursive`, `PriceBST`, `QuickSort`, `MergeSort` | Demonstrates recursive base cases, divide-and-conquer recurrence relations, and tree traversals. |
| **Hashing** | `HashMap` in `Mandi` & `Service` | $O(1)$ constant-time lookup for crops, mandis, and graph vertex distances. |
| **File I/O** | [`ProfitReportWriter`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/io/ProfitReportWriter.java) | Generates CSV and formatted text reports using `PrintWriter` and try-with-resources. |
| **Object Serialization**| [`RoadNetworkSerializer`](file:///c:/Users/Bariq%20Malik/Documents/CODE/kisan-mandi-connect/src/main/java/com/kisan/io/RoadNetworkSerializer.java) | Serializes the entire graph topology to `road_network.ser` using `ObjectOutputStream`/`ObjectInputStream`. |

---

## 🚀 How to Run

### Method 1: Double-Click or Command Line (Windows)
```cmd
cd "c:\Users\Bariq Malik\Documents\CODE\kisan-mandi-connect"
run.bat
```

### Method 2: Using Maven
```bash
# Compile and run test suite (15 tests)
mvn clean test

# Launch the interactive console application
mvn exec:java
```

### Method 3: Using Direct Java Command
```bash
# Compile
javac -d target/classes src/main/java/com/kisan/**/*.java

# Run
java -cp target/classes com.kisan.Main
```
