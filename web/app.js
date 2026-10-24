/**
 * Kisan Mandi Connect - Core Web Application Logic
 * Integrates:
 * - Graph Data Structure with Handcrafted Dijkstra's Algorithm
 * - Handcrafted QuickSort & MergeSort with Step Counters
 * - Handcrafted Top-K Min-Heap
 * - Handcrafted Binary Search Tree (BST) with Pruned Range Query
 * - 0/1 Knapsack Dynamic Programming Optimizer
 * - Multi-lingual i18n Controller
 * - Interactive Guided Tour
 * - Interactive SVG Road Network Graph
 */

// ==========================================
// 1. DATASETS (MAHARASHTRA APMC NETWORK)
// ==========================================

const CROPS = {
    ONION: {
        id: "ONION",
        name: "Nashik Red Onion",
        category: "PERISHABLE",
        basePrice: 2450.0,
        shelfLife: 35,
        spoilageRatePerHour: 0.0008,
        icon: "🧅",
        img: "assets/images/mandi_market.jpg"
    },
    TOMATO: {
        id: "TOMATO",
        name: "Hybrid Tomato",
        category: "PERISHABLE",
        basePrice: 1850.0,
        shelfLife: 6,
        spoilageRatePerHour: 0.0035,
        icon: "🍅",
        img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80"
    },
    POTATO: {
        id: "POTATO",
        name: "Jyoti Potato",
        category: "PERISHABLE",
        basePrice: 1550.0,
        shelfLife: 60,
        spoilageRatePerHour: 0.0005,
        icon: "🥔",
        img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80"
    },
    SOYBEAN: {
        id: "SOYBEAN",
        name: "Yellow Soybean",
        category: "GRAIN",
        basePrice: 4950.0,
        shelfLife: 240,
        bagCost: 45.0,
        icon: "🌱",
        img: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80"
    },
    WHEAT: {
        id: "WHEAT",
        name: "Lokwan Sharbati Wheat",
        category: "GRAIN",
        basePrice: 2400.0,
        shelfLife: 365,
        bagCost: 40.0,
        icon: "🌾",
        img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80"
    },
    COTTON: {
        id: "COTTON",
        name: "Medium Staple Cotton",
        category: "GRAIN",
        basePrice: 7350.0,
        shelfLife: 180,
        bagCost: 60.0,
        icon: "☁️",
        img: "https://images.unsplash.com/photo-1594897030560-6927d6d1d4cb?w=400&auto=format&fit=crop&q=80"
    }
};

const MANDIS = {
    // --- 1. DELHI (NCR) ---
    MND_DEL: { id: "MND_DEL", name: "Azadpur APMC (Delhi)", district: "North Delhi", state: "Delhi", lat: 28.7135, lng: 77.1767, cess: 0.010, isNationalHub: true, tagline: "Asia's Largest Fruit & Vegetable Terminal", prices: { ONION: 2950, TOMATO: 2200, POTATO: 1750, SOYBEAN: 5100, WHEAT: 2550, COTTON: 7500 } },
    MND_GHA: { id: "MND_GHA", name: "Ghazipur APMC (Delhi)", district: "East Delhi", state: "Delhi", lat: 28.6253, lng: 77.3298, cess: 0.010, isNationalHub: false, tagline: "NCR East Wholesale Terminal", prices: { ONION: 2920, TOMATO: 2180, POTATO: 1730, SOYBEAN: 5080, WHEAT: 2530, COTTON: 7450 } },
    MND_OBL: { id: "MND_OBL", name: "Okhla APMC (Delhi)", district: "South Delhi", state: "Delhi", lat: 28.5355, lng: 77.2711, cess: 0.010, isNationalHub: false, tagline: "South NCR Perishable Market", prices: { ONION: 2940, TOMATO: 2210, POTATO: 1740, SOYBEAN: 5070, WHEAT: 2540, COTTON: 7460 } },

    // --- 2. PUNJAB ---
    MND_KHA: { id: "MND_KHA", name: "Khanna APMC (Punjab)", district: "Ludhiana", state: "Punjab", lat: 30.7046, lng: 76.2163, cess: 0.020, isNationalHub: true, tagline: "Asia's Largest Grain Market (Grand Trunk Road)", prices: { ONION: 2650, TOMATO: 1850, POTATO: 1600, SOYBEAN: 5120, WHEAT: 2680, COTTON: 7700 } },
    MND_LUD: { id: "MND_LUD", name: "Ludhiana APMC", district: "Ludhiana", state: "Punjab", lat: 30.9010, lng: 75.8573, cess: 0.018, isNationalHub: false, tagline: "Central Punjab Grain & Produce Hub", prices: { ONION: 2640, TOMATO: 1840, POTATO: 1590, SOYBEAN: 5100, WHEAT: 2670, COTTON: 7680 } },
    MND_ASR: { id: "MND_ASR", name: "Amritsar APMC (Bhagtanwala)", district: "Amritsar", state: "Punjab", lat: 31.6340, lng: 74.8723, cess: 0.018, isNationalHub: false, tagline: "Majha Basmati & Wheat Exchange", prices: { ONION: 2660, TOMATO: 1860, POTATO: 1610, SOYBEAN: 5090, WHEAT: 2690, COTTON: 7650 } },
    MND_JAL_PB: { id: "MND_JAL_PB", name: "Jalandhar APMC (Maksudan)", district: "Jalandhar", state: "Punjab", lat: 31.3260, lng: 75.5762, cess: 0.018, isNationalHub: false, tagline: "Doaba Potato Capital of Punjab", prices: { ONION: 2620, TOMATO: 1830, POTATO: 1530, SOYBEAN: 5080, WHEAT: 2660, COTTON: 7620 } },
    MND_BTI: { id: "MND_BTI", name: "Bathinda APMC", district: "Bathinda", state: "Punjab", lat: 30.2110, lng: 74.9455, cess: 0.018, isNationalHub: false, tagline: "Malwa Cotton & Grain Terminal", prices: { ONION: 2630, TOMATO: 1820, POTATO: 1570, SOYBEAN: 5130, WHEAT: 2650, COTTON: 7820 } },

    // --- 3. HARYANA ---
    MND_KARN: { id: "MND_KARN", name: "Karnal APMC", district: "Karnal", state: "Haryana", lat: 29.6857, lng: 76.9905, cess: 0.018, isNationalHub: false, tagline: "Basmati Rice & Wheat Granary of India", prices: { ONION: 2610, TOMATO: 1820, POTATO: 1580, SOYBEAN: 5110, WHEAT: 2640, COTTON: 7650 } },
    MND_AMB: { id: "MND_AMB", name: "Ambala APMC", district: "Ambala", state: "Haryana", lat: 30.3782, lng: 76.7767, cess: 0.018, isNationalHub: false, tagline: "North Haryana Agricultural Junction", prices: { ONION: 2630, TOMATO: 1840, POTATO: 1590, SOYBEAN: 5100, WHEAT: 2630, COTTON: 7640 } },
    MND_SIR: { id: "MND_SIR", name: "Sirsa APMC", district: "Sirsa", state: "Haryana", lat: 29.5349, lng: 75.0298, cess: 0.018, isNationalHub: false, tagline: "Western Haryana Cotton & Mustard Hub", prices: { ONION: 2600, TOMATO: 1810, POTATO: 1560, SOYBEAN: 5090, WHEAT: 2620, COTTON: 7840 } },
    MND_HIS: { id: "MND_HIS", name: "Hisar APMC", district: "Hisar", state: "Haryana", lat: 29.1492, lng: 75.7217, cess: 0.018, isNationalHub: false, tagline: "Cotton, Mustard & Bajra Exchange", prices: { ONION: 2620, TOMATO: 1830, POTATO: 1570, SOYBEAN: 5100, WHEAT: 2610, COTTON: 7800 } },
    MND_ROH: { id: "MND_ROH", name: "Rohtak APMC", district: "Rohtak", state: "Haryana", lat: 28.8955, lng: 76.6066, cess: 0.018, isNationalHub: false, tagline: "Heart of Haryana Grain & Dairy Market", prices: { ONION: 2630, TOMATO: 1840, POTATO: 1570, SOYBEAN: 5110, WHEAT: 2630, COTTON: 7780 } },

    // --- 4. CHANDIGARH ---
    MND_CHD: { id: "MND_CHD", name: "Chandigarh APMC (Sector 26)", district: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794, cess: 0.015, isNationalHub: false, tagline: "Tricity Regional Wholesale Market", prices: { ONION: 2710, TOMATO: 1910, POTATO: 1640, SOYBEAN: 5110, WHEAT: 2620, COTTON: 7590 } },

    // --- 5. HIMACHAL PRADESH ---
    MND_SHI: { id: "MND_SHI", name: "Shimla APMC (Dhalli)", district: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lng: 77.1734, cess: 0.012, isNationalHub: true, tagline: "Apple Capital of India & Hill Produce Terminal", prices: { ONION: 3020, TOMATO: 2280, POTATO: 1790, SOYBEAN: 4980, WHEAT: 2520, COTTON: 7200 } },
    MND_SOL_HP: { id: "MND_SOL_HP", name: "Solan APMC", district: "Solan", state: "Himachal Pradesh", lat: 30.9045, lng: 77.0967, cess: 0.012, isNationalHub: false, tagline: "Mushroom City & Off-Season Tomato Terminal", prices: { ONION: 2950, TOMATO: 2240, POTATO: 1750, SOYBEAN: 5000, WHEAT: 2540, COTTON: 7250 } },
    MND_KUL: { id: "MND_KUL", name: "Kullu APMC (Bajaura)", district: "Kullu", state: "Himachal Pradesh", lat: 31.9579, lng: 77.1095, cess: 0.012, isNationalHub: false, tagline: "Valley Fruit, Plum & Apple Exchange", prices: { ONION: 3080, TOMATO: 2310, POTATO: 1820, SOYBEAN: 4940, WHEAT: 2500, COTTON: 7150 } },

    // --- 6. JAMMU & KASHMIR ---
    MND_SOP: { id: "MND_SOP", name: "Sopore Fruit Mandi (J&K)", district: "Baramulla", state: "Jammu and Kashmir", lat: 34.2981, lng: 74.4716, cess: 0.012, isNationalHub: true, tagline: "Asia's 2nd Largest Apple & Fruit Market", prices: { ONION: 3150, TOMATO: 2380, POTATO: 1850, SOYBEAN: 4910, WHEAT: 2510, COTTON: 7100 } },
    MND_SRI: { id: "MND_SRI", name: "Srinagar APMC (Parimpora)", district: "Srinagar", state: "Jammu and Kashmir", lat: 34.0837, lng: 74.7973, cess: 0.012, isNationalHub: false, tagline: "Kashmir Valley Central Wholesale Yard", prices: { ONION: 3120, TOMATO: 2360, POTATO: 1840, SOYBEAN: 4920, WHEAT: 2520, COTTON: 7120 } },
    MND_JAM: { id: "MND_JAM", name: "Jammu APMC (Narwal Mandi)", district: "Jammu", state: "Jammu and Kashmir", lat: 32.7266, lng: 74.8570, cess: 0.014, isNationalHub: false, tagline: "Winter Capital Agro & Basmati Terminal", prices: { ONION: 2980, TOMATO: 2210, POTATO: 1760, SOYBEAN: 5010, WHEAT: 2580, COTTON: 7300 } },

    // --- 7. UTTARAKHAND ---
    MND_HAL: { id: "MND_HAL", name: "Haldwani APMC (Uttarakhand)", district: "Nainital", state: "Uttarakhand", lat: 29.2183, lng: 79.5130, cess: 0.014, isNationalHub: true, tagline: "Gateway to Kumaon Hills Fruit & Grain Terminal", prices: { ONION: 2880, TOMATO: 2090, POTATO: 1690, SOYBEAN: 5040, WHEAT: 2580, COTTON: 7390 } },
    MND_DDN: { id: "MND_DDN", name: "Dehradun APMC (Niranjanpur)", district: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322, cess: 0.014, isNationalHub: false, tagline: "Garhwal Basin Basmati & Litchi Hub", prices: { ONION: 2890, TOMATO: 2120, POTATO: 1710, SOYBEAN: 5030, WHEAT: 2590, COTTON: 7380 } },

    // --- 8. UTTAR PRADESH ---
    MND_KAN: { id: "MND_KAN", name: "Kanpur APMC (Kalyanpur)", district: "Kanpur Nagar", state: "Uttar Pradesh", lat: 26.4913, lng: 80.2818, cess: 0.015, isNationalHub: true, tagline: "Northern Commercial Hub & Grain Terminal", prices: { ONION: 2620, TOMATO: 1880, POTATO: 1540, SOYBEAN: 5040, WHEAT: 2580, COTTON: 7480 } },
    MND_VAR: { id: "MND_VAR", name: "Varanasi APMC (Chandpur)", district: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739, cess: 0.014, isNationalHub: false, tagline: "Purvanchal Agricultural Gateway", prices: { ONION: 2680, TOMATO: 1910, POTATO: 1580, SOYBEAN: 4990, WHEAT: 2520, COTTON: 7350 } },
    MND_AGR: { id: "MND_AGR", name: "Agra APMC", district: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081, cess: 0.015, isNationalHub: false, tagline: "Potato & Mustard Major Terminal", prices: { ONION: 2640, TOMATO: 1860, POTATO: 1460, SOYBEAN: 5050, WHEAT: 2560, COTTON: 7510 } },
    MND_LKO: { id: "MND_LKO", name: "Lucknow APMC (Dubagga)", district: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, cess: 0.015, isNationalHub: true, tagline: "State Capital Mega Fruit & Vegetable Yard", prices: { ONION: 2720, TOMATO: 1950, POTATO: 1570, SOYBEAN: 5070, WHEAT: 2570, COTTON: 7420 } },
    MND_ALI: { id: "MND_ALI", name: "Aligarh APMC", district: "Aligarh", state: "Uttar Pradesh", lat: 27.8974, lng: 78.0880, cess: 0.015, isNationalHub: false, tagline: "Western UP Grain & Pulse Hub", prices: { ONION: 2650, TOMATO: 1870, POTATO: 1520, SOYBEAN: 5060, WHEAT: 2580, COTTON: 7520 } },
    MND_MEE: { id: "MND_MEE", name: "Meerut APMC", district: "Meerut", state: "Uttar Pradesh", lat: 28.9845, lng: 77.7064, cess: 0.015, isNationalHub: false, tagline: "Sugar & Fresh Veg Terminal", prices: { ONION: 2690, TOMATO: 1920, POTATO: 1560, SOYBEAN: 5080, WHEAT: 2590, COTTON: 7540 } },
    MND_BAR: { id: "MND_BAR", name: "Bareilly APMC", district: "Bareilly", state: "Uttar Pradesh", lat: 28.3670, lng: 79.4304, cess: 0.015, isNationalHub: false, tagline: "Rohilkhand Agricultural Exchange", prices: { ONION: 2670, TOMATO: 1890, POTATO: 1540, SOYBEAN: 5050, WHEAT: 2570, COTTON: 7460 } },
    MND_GOR: { id: "MND_GOR", name: "Gorakhpur APMC", district: "Gorakhpur", state: "Uttar Pradesh", lat: 26.7606, lng: 83.3732, cess: 0.014, isNationalHub: false, tagline: "Terai Agricultural Gateway", prices: { ONION: 2700, TOMATO: 1940, POTATO: 1590, SOYBEAN: 4980, WHEAT: 2530, COTTON: 7340 } },
    MND_PRY: { id: "MND_PRY", name: "Prayagraj APMC (Mundera)", district: "Prayagraj", state: "Uttar Pradesh", lat: 25.4358, lng: 81.8463, cess: 0.015, isNationalHub: false, tagline: "Sangam Basin Agro Terminal", prices: { ONION: 2670, TOMATO: 1900, POTATO: 1550, SOYBEAN: 5020, WHEAT: 2550, COTTON: 7400 } },

    // --- 9. RAJASTHAN ---
    MND_JAI: { id: "MND_JAI", name: "Jaipur APMC (Muhana Mandi)", district: "Jaipur", state: "Rajasthan", lat: 26.7937, lng: 75.7656, cess: 0.016, isNationalHub: true, tagline: "Rajasthan's Premier Modern Fruits & Grains Terminal", prices: { ONION: 2720, TOMATO: 1940, POTATO: 1620, SOYBEAN: 5120, WHEAT: 2530, COTTON: 7600 } },
    MND_KOT: { id: "MND_KOT", name: "Kota APMC (Bhamashah)", district: "Kota", state: "Rajasthan", lat: 25.1760, lng: 75.8648, cess: 0.015, isNationalHub: false, tagline: "Hadoti Mega Grain & Soybean Market", prices: { ONION: 2550, TOMATO: 1820, POTATO: 1500, SOYBEAN: 5240, WHEAT: 2560, COTTON: 7520 } },
    MND_JOD: { id: "MND_JOD", name: "Jodhpur APMC (Bhagat Ki Kothi)", district: "Jodhpur", state: "Rajasthan", lat: 26.2389, lng: 73.0243, cess: 0.016, isNationalHub: false, tagline: "Marwar Chili, Cumin & Pulse Yard", prices: { ONION: 2730, TOMATO: 1910, POTATO: 1630, SOYBEAN: 5100, WHEAT: 2520, COTTON: 7640 } },
    MND_BIK: { id: "MND_BIK", name: "Bikaner APMC (Karni Nagar)", district: "Bikaner", state: "Rajasthan", lat: 28.0229, lng: 73.3119, cess: 0.016, isNationalHub: false, tagline: "Groundnut & Moth Dal Capital", prices: { ONION: 2740, TOMATO: 1890, POTATO: 1620, SOYBEAN: 5080, WHEAT: 2510, COTTON: 7690 } },
    MND_SGN: { id: "MND_SGN", name: "Sri Ganganagar APMC", district: "Sri Ganganagar", state: "Rajasthan", lat: 29.9038, lng: 73.8772, cess: 0.018, isNationalHub: true, tagline: "Food Basket of Rajasthan - Wheat, Kinnow & Cotton", prices: { ONION: 2630, TOMATO: 1810, POTATO: 1550, SOYBEAN: 5120, WHEAT: 2650, COTTON: 7860 } },
    MND_ALW: { id: "MND_ALW", name: "Alwar APMC", district: "Alwar", state: "Rajasthan", lat: 27.5530, lng: 76.6346, cess: 0.016, isNationalHub: false, tagline: "Mustard & Red Onion Exchange", prices: { ONION: 2690, TOMATO: 1880, POTATO: 1580, SOYBEAN: 5090, WHEAT: 2540, COTTON: 7610 } },

    // --- 10. GUJARAT ---
    MND_GON: { id: "MND_GON", name: "Gondal APMC (Gujarat)", district: "Rajkot", state: "Gujarat", lat: 21.9619, lng: 70.7923, cess: 0.012, isNationalHub: true, tagline: "Saurashtra Groundnut & Chili Mandi", prices: { ONION: 2700, TOMATO: 1800, POTATO: 1550, SOYBEAN: 5080, WHEAT: 2460, COTTON: 7850 } },
    MND_UNJ: { id: "MND_UNJ", name: "Unjha APMC (Gujarat)", district: "Mehsana", state: "Gujarat", lat: 23.8037, lng: 72.3922, cess: 0.010, isNationalHub: true, tagline: "Asia's Largest Cumin & Fennel Spice Terminal", prices: { ONION: 2740, TOMATO: 1830, POTATO: 1560, SOYBEAN: 5110, WHEAT: 2490, COTTON: 7780 } },
    MND_MAH: { id: "MND_MAH", name: "Mahuva APMC (Gujarat)", district: "Bhavnagar", state: "Gujarat", lat: 21.0914, lng: 71.7618, cess: 0.012, isNationalHub: true, tagline: "Asia's Onion Dehydration & Garlic Capital", prices: { ONION: 2760, TOMATO: 1810, POTATO: 1540, SOYBEAN: 5050, WHEAT: 2450, COTTON: 7810 } },
    MND_AHM_GJ: { id: "MND_AHM_GJ", name: "Ahmedabad APMC (Jamalpur)", district: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, cess: 0.012, isNationalHub: false, tagline: "Mega Metropolitan Wholesale Hub", prices: { ONION: 2780, TOMATO: 1890, POTATO: 1590, SOYBEAN: 5120, WHEAT: 2510, COTTON: 7740 } },
    MND_RJK: { id: "MND_RJK", name: "Rajkot APMC (Bedi Mandi)", district: "Rajkot", state: "Gujarat", lat: 22.3039, lng: 70.8022, cess: 0.012, isNationalHub: false, tagline: "Central Saurashtra Cotton & Oilseed Exchange", prices: { ONION: 2710, TOMATO: 1820, POTATO: 1540, SOYBEAN: 5090, WHEAT: 2470, COTTON: 7830 } },
    MND_SUR: { id: "MND_SUR", name: "Surat APMC", district: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311, cess: 0.012, isNationalHub: false, tagline: "South Gujarat Agro Terminal", prices: { ONION: 2790, TOMATO: 1920, POTATO: 1610, SOYBEAN: 5070, WHEAT: 2480, COTTON: 7680 } },

    // --- 11. GOA ---
    MND_MAR: { id: "MND_MAR", name: "Margao APMC (Goa)", district: "South Goa", state: "Goa", lat: 15.2832, lng: 73.9862, cess: 0.012, isNationalHub: false, tagline: "Coastal Fruit, Spices & Wholesale Market", prices: { ONION: 2950, TOMATO: 2150, POTATO: 1780, SOYBEAN: 4940, WHEAT: 2510, COTTON: 7250 } },
    MND_MAP: { id: "MND_MAP", name: "Mapusa APMC (Goa)", district: "North Goa", state: "Goa", lat: 15.5937, lng: 73.8142, cess: 0.012, isNationalHub: false, tagline: "North Goa Traditional Commercial Yard", prices: { ONION: 2970, TOMATO: 2180, POTATO: 1790, SOYBEAN: 4930, WHEAT: 2520, COTTON: 7240 } },

    // --- 12. MAHARASHTRA ---
    MND_PUN: { id: "MND_PUN", name: "Pune APMC (Gultekdi)", district: "Pune", state: "Maharashtra", lat: 18.4988, lng: 73.8647, cess: 0.015, isNationalHub: false, tagline: "Western Maharashtra Agro-Gateway", prices: { ONION: 2480, TOMATO: 1920, POTATO: 1600, SOYBEAN: 4920, WHEAT: 2450, COTTON: 7250 } },
    MND_LAS: { id: "MND_LAS", name: "Lasalgaon APMC", district: "Nashik", state: "Maharashtra", lat: 20.1472, lng: 74.2256, cess: 0.012, isNationalHub: true, tagline: "Asia's Largest Onion Market", prices: { ONION: 2750, TOMATO: 1780, POTATO: 1480, SOYBEAN: 4880, WHEAT: 2380, COTTON: 7150 } },
    MND_NSK: { id: "MND_NSK", name: "Nashik APMC", district: "Nashik", state: "Maharashtra", lat: 19.9975, lng: 73.7898, cess: 0.014, isNationalHub: false, tagline: "Grape & Fresh Veg Corridor", prices: { ONION: 2600, TOMATO: 1890, POTATO: 1530, SOYBEAN: 4900, WHEAT: 2410, COTTON: 7200 } },
    MND_AHM: { id: "MND_AHM", name: "Ahmednagar APMC", district: "Ahmednagar", state: "Maharashtra", lat: 19.0952, lng: 74.7480, cess: 0.013, isNationalHub: false, tagline: "Sugar & Grain Exchange", prices: { ONION: 2520, TOMATO: 1810, POTATO: 1510, SOYBEAN: 4960, WHEAT: 2420, COTTON: 7380 } },
    MND_KOL: { id: "MND_KOL", name: "Kolhapur APMC", district: "Kolhapur", state: "Maharashtra", lat: 16.7050, lng: 74.2433, cess: 0.015, isNationalHub: false, tagline: "Jaggery & South MH Market", prices: { ONION: 2420, TOMATO: 1900, POTATO: 1580, SOYBEAN: 5050, WHEAT: 2440, COTTON: 7180 } },
    MND_SOL: { id: "MND_SOL", name: "Solapur APMC", district: "Solapur", state: "Maharashtra", lat: 17.6599, lng: 75.9064, cess: 0.013, isNationalHub: false, tagline: "Pomegranate & Cotton Terminal", prices: { ONION: 2580, TOMATO: 1820, POTATO: 1500, SOYBEAN: 4980, WHEAT: 2390, COTTON: 7420 } },
    MND_JAL: { id: "MND_JAL", name: "Jalgaon APMC", district: "Jalgaon", state: "Maharashtra", lat: 21.0077, lng: 75.5626, cess: 0.012, isNationalHub: false, tagline: "Banana & Khandesh Pulse Capital", prices: { ONION: 2460, TOMATO: 1750, POTATO: 1490, SOYBEAN: 4940, WHEAT: 2400, COTTON: 7500 } },
    MND_LAT: { id: "MND_LAT", name: "Latur APMC", district: "Latur", state: "Maharashtra", lat: 18.4088, lng: 76.5604, cess: 0.014, isNationalHub: false, tagline: "Marathwada Soybean & Dal Hub", prices: { ONION: 2390, TOMATO: 1790, POTATO: 1470, SOYBEAN: 5150, WHEAT: 2430, COTTON: 7300 } },
    MND_VAS: { id: "MND_VAS", name: "Vashi APMC (Navi Mumbai)", district: "Thane", state: "Maharashtra", lat: 19.0760, lng: 72.9986, cess: 0.018, isNationalHub: true, tagline: "Metropolitan Wholesale Terminal", prices: { ONION: 2820, TOMATO: 2150, POTATO: 1720, SOYBEAN: 5080, WHEAT: 2520, COTTON: 7450 } },
    MND_NAG: { id: "MND_NAG", name: "Nagpur APMC (Kalamna)", district: "Nagpur", state: "Maharashtra", lat: 21.1718, lng: 79.1415, cess: 0.015, isNationalHub: false, tagline: "Central India Orange & Cotton Mandi", prices: { ONION: 2350, TOMATO: 1800, POTATO: 1520, SOYBEAN: 5020, WHEAT: 2410, COTTON: 7600 } },
    MND_AUR: { id: "MND_AUR", name: "Chhatrapati Sambhajinagar APMC", district: "Chhatrapati Sambhajinagar", state: "Maharashtra", lat: 19.8762, lng: 75.3433, cess: 0.014, isNationalHub: false, tagline: "Marathwada Central Agro Exchange", prices: { ONION: 2490, TOMATO: 1820, POTATO: 1510, SOYBEAN: 5040, WHEAT: 2430, COTTON: 7410 } },
    MND_AKO: { id: "MND_AKO", name: "Akola APMC", district: "Akola", state: "Maharashtra", lat: 20.7002, lng: 77.0082, cess: 0.014, isNationalHub: false, tagline: "Vidarbha Cotton & Pulse Yard", prices: { ONION: 2410, TOMATO: 1780, POTATO: 1490, SOYBEAN: 5120, WHEAT: 2420, COTTON: 7680 } },

    // --- 13. MADHYA PRADESH ---
    MND_IND: { id: "MND_IND", name: "Indore APMC (Madhya Pradesh)", district: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577, cess: 0.015, isNationalHub: true, tagline: "Malwa Plateau Soybean & Wheat Exchange", prices: { ONION: 2580, TOMATO: 1840, POTATO: 1520, SOYBEAN: 5200, WHEAT: 2510, COTTON: 7400 } },
    MND_NEE: { id: "MND_NEE", name: "Neemuch APMC (MP)", district: "Neemuch", state: "Madhya Pradesh", lat: 24.4727, lng: 74.8631, cess: 0.015, isNationalHub: true, tagline: "Asia's Largest Garlic & Medicinal Herbs Mandi", prices: { ONION: 2590, TOMATO: 1810, POTATO: 1500, SOYBEAN: 5220, WHEAT: 2530, COTTON: 7420 } },
    MND_BHO: { id: "MND_BHO", name: "Bhopal APMC (Karond)", district: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126, cess: 0.015, isNationalHub: false, tagline: "Capital Region Agro Terminal", prices: { ONION: 2610, TOMATO: 1860, POTATO: 1530, SOYBEAN: 5180, WHEAT: 2540, COTTON: 7410 } },
    MND_UJJ: { id: "MND_UJJ", name: "Ujjain APMC (Chimanganj)", district: "Ujjain", state: "Madhya Pradesh", lat: 23.1765, lng: 75.7885, cess: 0.015, isNationalHub: false, tagline: "Major Soybean & Gram Terminal", prices: { ONION: 2560, TOMATO: 1820, POTATO: 1510, SOYBEAN: 5210, WHEAT: 2520, COTTON: 7430 } },
    MND_JAB: { id: "MND_JAB", name: "Jabalpur APMC", district: "Jabalpur", state: "Madhya Pradesh", lat: 23.1815, lng: 79.9864, cess: 0.015, isNationalHub: false, tagline: "Green Pea & Pulse Terminal", prices: { ONION: 2570, TOMATO: 1850, POTATO: 1540, SOYBEAN: 5150, WHEAT: 2530, COTTON: 7400 } },

    // --- 14. CHHATTISGARH ---
    MND_RAI: { id: "MND_RAI", name: "Raipur APMC (Dumartarai)", district: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296, cess: 0.015, isNationalHub: true, tagline: "Rice Bowl of Central India Terminal", prices: { ONION: 2680, TOMATO: 1910, POTATO: 1590, SOYBEAN: 5040, WHEAT: 2480, COTTON: 7350 } },
    MND_BIL: { id: "MND_BIL", name: "Bilaspur APMC (Tifra)", district: "Bilaspur", state: "Chhattisgarh", lat: 22.0797, lng: 82.1391, cess: 0.014, isNationalHub: false, tagline: "North Chhattisgarh Paddy & Maize Mandi", prices: { ONION: 2710, TOMATO: 1930, POTATO: 1610, SOYBEAN: 5010, WHEAT: 2470, COTTON: 7300 } },

    // --- 15. BIHAR ---
    MND_PAT: { id: "MND_PAT", name: "Patna APMC (Bazar Samiti)", district: "Patna", state: "Bihar", lat: 25.6093, lng: 85.1711, cess: 0.010, isNationalHub: false, tagline: "Central Bihar Agricultural Terminal", prices: { ONION: 2710, TOMATO: 1980, POTATO: 1560, SOYBEAN: 5010, WHEAT: 2540, COTTON: 7380 } },
    MND_PUR: { id: "MND_PUR", name: "Purnia APMC (Gulabbagh)", district: "Purnia", state: "Bihar", lat: 25.7771, lng: 87.5020, cess: 0.012, isNationalHub: true, tagline: "Eastern India's Largest Maize & Jute Mandi", prices: { ONION: 2760, TOMATO: 1920, POTATO: 1520, SOYBEAN: 5050, WHEAT: 2510, COTTON: 7420 } },
    MND_MUZ: { id: "MND_MUZ", name: "Muzaffarpur APMC", district: "Muzaffarpur", state: "Bihar", lat: 26.1209, lng: 85.3647, cess: 0.010, isNationalHub: false, tagline: "Shahi Litchi & Maize Belt Market", prices: { ONION: 2730, TOMATO: 1960, POTATO: 1540, SOYBEAN: 4990, WHEAT: 2530, COTTON: 7360 } },
    MND_BHA: { id: "MND_BHA", name: "Bhagalpur APMC", district: "Bhagalpur", state: "Bihar", lat: 25.2425, lng: 86.9842, cess: 0.010, isNationalHub: false, tagline: "Anga Region Commercial Grain Yard", prices: { ONION: 2750, TOMATO: 1950, POTATO: 1550, SOYBEAN: 5020, WHEAT: 2520, COTTON: 7390 } },
    MND_GAY: { id: "MND_GAY", name: "Gaya APMC", district: "Gaya", state: "Bihar", lat: 24.7914, lng: 85.0002, cess: 0.010, isNationalHub: false, tagline: "Magadh Regional Agro Terminal", prices: { ONION: 2750, TOMATO: 2020, POTATO: 1610, SOYBEAN: 5010, WHEAT: 2510, COTTON: 7320 } },

    // --- 16. WEST BENGAL ---
    MND_KOLK: { id: "MND_KOLK", name: "Kolkata APMC (Koley Market)", district: "Kolkata", state: "West Bengal", lat: 22.5697, lng: 88.3697, cess: 0.012, isNationalHub: true, tagline: "Eastern India Mega Wholesale Distribution Terminal", prices: { ONION: 2890, TOMATO: 2180, POTATO: 1690, SOYBEAN: 5080, WHEAT: 2490, COTTON: 7300 } },
    MND_SIL: { id: "MND_SIL", name: "Siliguri APMC", district: "Darjeeling", state: "West Bengal", lat: 26.7271, lng: 88.4230, cess: 0.013, isNationalHub: false, tagline: "North Bengal & North-East Gateway", prices: { ONION: 2980, TOMATO: 2250, POTATO: 1740, SOYBEAN: 4950, WHEAT: 2460, COTTON: 7200 } },
    MND_BUR: { id: "MND_BUR", name: "Burdwan APMC", district: "Purba Bardhaman", state: "West Bengal", lat: 23.2324, lng: 87.8615, cess: 0.012, isNationalHub: false, tagline: "Rice Bowl of West Bengal Mandi", prices: { ONION: 2840, TOMATO: 2120, POTATO: 1630, SOYBEAN: 5030, WHEAT: 2480, COTTON: 7280 } },
    MND_MAL: { id: "MND_MAL", name: "Malda APMC", district: "Malda", state: "West Bengal", lat: 25.0108, lng: 88.1411, cess: 0.012, isNationalHub: false, tagline: "Fazli Mango, Jute & Silk Trade Center", prices: { ONION: 2870, TOMATO: 2150, POTATO: 1670, SOYBEAN: 4990, WHEAT: 2470, COTTON: 7260 } },

    // --- 17. JHARKHAND ---
    MND_RAN: { id: "MND_RAN", name: "Ranchi APMC (Pandra)", district: "Ranchi", state: "Jharkhand", lat: 23.3441, lng: 85.3096, cess: 0.015, isNationalHub: true, tagline: "Chota Nagpur Plateau Vegetable & Grain Hub", prices: { ONION: 2790, TOMATO: 2040, POTATO: 1640, SOYBEAN: 5050, WHEAT: 2510, COTTON: 7340 } },
    MND_JAM_JH: { id: "MND_JAM_JH", name: "Jamshedpur APMC (Parsudih)", district: "East Singhbhum", state: "Jharkhand", lat: 22.8046, lng: 86.2029, cess: 0.014, isNationalHub: false, tagline: "Industrial Belt Agricultural Market", prices: { ONION: 2820, TOMATO: 2080, POTATO: 1660, SOYBEAN: 5030, WHEAT: 2500, COTTON: 7320 } },

    // --- 18. ODISHA ---
    MND_CUT: { id: "MND_CUT", name: "Cuttack APMC (Chhatra Bazar)", district: "Cuttack", state: "Odisha", lat: 20.4625, lng: 85.8828, cess: 0.013, isNationalHub: false, tagline: "Historic Coastal Odisha Commercial Yard", prices: { ONION: 2740, TOMATO: 2020, POTATO: 1650, SOYBEAN: 5020, WHEAT: 2490, COTTON: 7410 } },
    MND_BBS: { id: "MND_BBS", name: "Bhubaneswar APMC (Aiginia)", district: "Khurda", state: "Odisha", lat: 20.2961, lng: 85.8245, cess: 0.013, isNationalHub: true, tagline: "Modern Capital Perishable & Grain Terminal", prices: { ONION: 2760, TOMATO: 2050, POTATO: 1670, SOYBEAN: 5040, WHEAT: 2500, COTTON: 7430 } },
    MND_SAM: { id: "MND_SAM", name: "Sambalpur APMC (Khetrajpur)", district: "Sambalpur", state: "Odisha", lat: 21.4669, lng: 83.9812, cess: 0.014, isNationalHub: false, tagline: "Western Odisha Paddy & Grain Terminal", prices: { ONION: 2710, TOMATO: 1980, POTATO: 1620, SOYBEAN: 5060, WHEAT: 2470, COTTON: 7460 } },

    // --- 19. ANDHRA PRADESH ---
    MND_GUN: { id: "MND_GUN", name: "Guntur APMC (Andhra Pradesh)", district: "Guntur", state: "Andhra Pradesh", lat: 16.3067, lng: 80.4365, cess: 0.013, isNationalHub: true, tagline: "Asia's Largest Red Chili & Commercial Yard", prices: { ONION: 2620, TOMATO: 1950, POTATO: 1680, SOYBEAN: 5000, WHEAT: 2470, COTTON: 7650 } },
    MND_VIJ: { id: "MND_VIJ", name: "Vijayawada APMC (Gollapudi)", district: "NTR Krishna", state: "Andhra Pradesh", lat: 16.5062, lng: 80.6480, cess: 0.013, isNationalHub: false, tagline: "Krishna Delta Major Commercial Yard", prices: { ONION: 2650, TOMATO: 1970, POTATO: 1690, SOYBEAN: 5020, WHEAT: 2480, COTTON: 7620 } },
    MND_KUR: { id: "MND_KUR", name: "Kurnool APMC", district: "Kurnool", state: "Andhra Pradesh", lat: 15.8281, lng: 78.0373, cess: 0.014, isNationalHub: false, tagline: "Rayalaseema Onion, Cotton & Groundnut Hub", prices: { ONION: 2580, TOMATO: 1920, POTATO: 1660, SOYBEAN: 5040, WHEAT: 2460, COTTON: 7720 } },
    MND_TIR: { id: "MND_TIR", name: "Tirupati APMC", district: "Tirupati", state: "Andhra Pradesh", lat: 13.6288, lng: 79.4192, cess: 0.013, isNationalHub: false, tagline: "Southern Andhra Agri Terminal", prices: { ONION: 2750, TOMATO: 2080, POTATO: 1720, SOYBEAN: 5010, WHEAT: 2510, COTTON: 7520 } },

    // --- 20. TELANGANA ---
    MND_HYD: { id: "MND_HYD", name: "Hyderabad APMC (Bowenpally)", district: "Hyderabad", state: "Telangana", lat: 17.4727, lng: 78.4867, cess: 0.014, isNationalHub: true, tagline: "Telangana Mega Perishable & Agro Terminal", prices: { ONION: 2680, TOMATO: 1980, POTATO: 1680, SOYBEAN: 5120, WHEAT: 2520, COTTON: 7620 } },
    MND_WAR: { id: "MND_WAR", name: "Warangal APMC (Enmamula)", district: "Warangal", state: "Telangana", lat: 17.9784, lng: 79.6245, cess: 0.014, isNationalHub: true, tagline: "Telangana Cotton, Chili & Grain Mega Market", prices: { ONION: 2590, TOMATO: 1890, POTATO: 1610, SOYBEAN: 5180, WHEAT: 2470, COTTON: 7780 } },
    MND_NIZ: { id: "MND_NIZ", name: "Nizamabad APMC", district: "Nizamabad", state: "Telangana", lat: 18.6725, lng: 78.0941, cess: 0.014, isNationalHub: true, tagline: "Premier Turmeric, Maize & Soya Yard", prices: { ONION: 2620, TOMATO: 1880, POTATO: 1620, SOYBEAN: 5240, WHEAT: 2490, COTTON: 7710 } },
    MND_KHM: { id: "MND_KHM", name: "Khammam APMC", district: "Khammam", state: "Telangana", lat: 17.2473, lng: 80.1514, cess: 0.014, isNationalHub: false, tagline: "Red Chili & Cotton Commercial Yard", prices: { ONION: 2610, TOMATO: 1910, POTATO: 1640, SOYBEAN: 5140, WHEAT: 2480, COTTON: 7750 } },

    // --- 21. KARNATAKA ---
    MND_BLR: { id: "MND_BLR", name: "Yeshwanthpur APMC (Bengaluru)", district: "Bengaluru", state: "Karnataka", lat: 13.0238, lng: 77.5529, cess: 0.015, isNationalHub: true, tagline: "Southern Mega Distribution APMC", prices: { ONION: 2780, TOMATO: 2100, POTATO: 1720, SOYBEAN: 5060, WHEAT: 2540, COTTON: 7350 } },
    MND_MYS: { id: "MND_MYS", name: "Mysuru APMC (Bandipalya)", district: "Mysuru", state: "Karnataka", lat: 12.2958, lng: 76.6394, cess: 0.015, isNationalHub: false, tagline: "Heritage Agro & Paddy Terminal", prices: { ONION: 2790, TOMATO: 2080, POTATO: 1710, SOYBEAN: 5040, WHEAT: 2530, COTTON: 7320 } },
    MND_HUB: { id: "MND_HUB", name: "Hubballi APMC (Amaragol)", district: "Dharwad", state: "Karnataka", lat: 15.3647, lng: 75.1240, cess: 0.015, isNationalHub: true, tagline: "North Karnataka Mega Commercial Terminal", prices: { ONION: 2540, TOMATO: 1860, POTATO: 1590, SOYBEAN: 5160, WHEAT: 2480, COTTON: 7640 } },
    MND_BEL: { id: "MND_BEL", name: "Belagavi APMC", district: "Belagavi", state: "Karnataka", lat: 15.8497, lng: 74.4977, cess: 0.015, isNationalHub: false, tagline: "Border Region Veg & Grain Terminal", prices: { ONION: 2510, TOMATO: 1850, POTATO: 1580, SOYBEAN: 5120, WHEAT: 2470, COTTON: 7580 } },
    MND_RAI_KA: { id: "MND_RAI_KA", name: "Raichur APMC", district: "Raichur", state: "Karnataka", lat: 16.2076, lng: 77.3463, cess: 0.015, isNationalHub: false, tagline: "Sona Masoori Rice & Cotton Hub", prices: { ONION: 2580, TOMATO: 1890, POTATO: 1630, SOYBEAN: 5110, WHEAT: 2480, COTTON: 7740 } },

    // --- 22. TAMIL NADU ---
    MND_CHE: { id: "MND_CHE", name: "Chennai APMC (Koyambedu)", district: "Chennai", state: "Tamil Nadu", lat: 13.0694, lng: 80.1948, cess: 0.015, isNationalHub: true, tagline: "Asia's Premier Perishable & Vegetable Complex", prices: { ONION: 2880, TOMATO: 2220, POTATO: 1780, SOYBEAN: 5040, WHEAT: 2510, COTTON: 7550 } },
    MND_MAD: { id: "MND_MAD", name: "Madurai APMC (Paravai)", district: "Madurai", state: "Tamil Nadu", lat: 9.9620, lng: 78.0770, cess: 0.014, isNationalHub: false, tagline: "Southern Tamil Nadu Agro-Commercial Center", prices: { ONION: 2810, TOMATO: 2140, POTATO: 1740, SOYBEAN: 4980, WHEAT: 2480, COTTON: 7620 } },
    MND_CBE: { id: "MND_CBE", name: "Coimbatore APMC (MGR Market)", district: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558, cess: 0.014, isNationalHub: false, tagline: "Kongu Region Agricultural Terminal", prices: { ONION: 2830, TOMATO: 2160, POTATO: 1750, SOYBEAN: 5020, WHEAT: 2500, COTTON: 7640 } },
    MND_ERO: { id: "MND_ERO", name: "Erode APMC (Perundurai)", district: "Erode", state: "Tamil Nadu", lat: 11.3410, lng: 77.7172, cess: 0.014, isNationalHub: true, tagline: "Turmeric City of India & Commercial Terminal", prices: { ONION: 2790, TOMATO: 2110, POTATO: 1710, SOYBEAN: 5060, WHEAT: 2490, COTTON: 7690 } },
    MND_SLM: { id: "MND_SLM", name: "Salem APMC", district: "Salem", state: "Tamil Nadu", lat: 11.6643, lng: 78.1460, cess: 0.014, isNationalHub: false, tagline: "Malgoa Mango & Tapioca Hub", prices: { ONION: 2820, TOMATO: 2130, POTATO: 1730, SOYBEAN: 5010, WHEAT: 2500, COTTON: 7610 } },

    // --- 23. KERALA ---
    MND_KOC: { id: "MND_KOC", name: "Kochi APMC (Aluva Market)", district: "Ernakulam", state: "Kerala", lat: 10.1076, lng: 76.3516, cess: 0.012, isNationalHub: true, tagline: "Kerala Commercial Spice & Vegetable Terminal", prices: { ONION: 2990, TOMATO: 2290, POTATO: 1820, SOYBEAN: 4920, WHEAT: 2530, COTTON: 7280 } },
    MND_TVM: { id: "MND_TVM", name: "Thiruvananthapuram APMC", district: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366, cess: 0.012, isNationalHub: false, tagline: "State Capital Wholesale Yard", prices: { ONION: 3010, TOMATO: 2320, POTATO: 1840, SOYBEAN: 4900, WHEAT: 2540, COTTON: 7250 } },
    MND_CCJ: { id: "MND_CCJ", name: "Kozhikode APMC (Palayam)", district: "Kozhikode", state: "Kerala", lat: 11.2588, lng: 75.7804, cess: 0.012, isNationalHub: false, tagline: "Malabar Coast Spice & Produce Market", prices: { ONION: 2980, TOMATO: 2270, POTATO: 1810, SOYBEAN: 4930, WHEAT: 2520, COTTON: 7260 } },

    // --- 24. ASSAM ---
    MND_GUW: { id: "MND_GUW", name: "Guwahati APMC (Pamohi)", district: "Kamrup Metropolitan", state: "Assam", lat: 26.1158, lng: 91.6844, cess: 0.012, isNationalHub: true, tagline: "North-Eastern Regional Agro Hub", prices: { ONION: 3050, TOMATO: 2340, POTATO: 1860, SOYBEAN: 4890, WHEAT: 2480, COTTON: 7190 } },
    MND_DIB: { id: "MND_DIB", name: "Dibrugarh APMC", district: "Dibrugarh", state: "Assam", lat: 27.4728, lng: 94.9120, cess: 0.012, isNationalHub: false, tagline: "Upper Assam Tea & Agro Terminal", prices: { ONION: 3120, TOMATO: 2390, POTATO: 1890, SOYBEAN: 4850, WHEAT: 2450, COTTON: 7120 } },
    MND_JOR: { id: "MND_JOR", name: "Jorhat APMC", district: "Jorhat", state: "Assam", lat: 26.7509, lng: 94.2037, cess: 0.012, isNationalHub: false, tagline: "Brahmaputra Valley Agriculture Hub", prices: { ONION: 3090, TOMATO: 2360, POTATO: 1870, SOYBEAN: 4870, WHEAT: 2460, COTTON: 7150 } },

    // --- 25. MEGHALAYA ---
    MND_SHL: { id: "MND_SHL", name: "Shillong APMC (Mawiong)", district: "East Khasi Hills", state: "Meghalaya", lat: 25.5788, lng: 91.8933, cess: 0.012, isNationalHub: true, tagline: "Lakadong Turmeric, Ginger & Hill Produce Market", prices: { ONION: 3100, TOMATO: 2370, POTATO: 1880, SOYBEAN: 4880, WHEAT: 2470, COTTON: 7160 } },

    // --- 26. TRIPURA ---
    MND_AGT: { id: "MND_AGT", name: "Agartala APMC (Battala)", district: "West Tripura", state: "Tripura", lat: 23.8315, lng: 91.2868, cess: 0.012, isNationalHub: false, tagline: "Queen Pineapple & Rubber State Terminal", prices: { ONION: 3140, TOMATO: 2410, POTATO: 1910, SOYBEAN: 4830, WHEAT: 2440, COTTON: 7110 } },

    // --- 27. NAGALAND ---
    MND_DIM: { id: "MND_DIM", name: "Dimapur APMC", district: "Dimapur", state: "Nagaland", lat: 25.9068, lng: 93.7274, cess: 0.012, isNationalHub: false, tagline: "Nagaland Commercial Gateway & King Chili Yard", prices: { ONION: 3180, TOMATO: 2440, POTATO: 1930, SOYBEAN: 4820, WHEAT: 2430, COTTON: 7080 } },

    // --- 28. MANIPUR ---
    MND_IMP: { id: "MND_IMP", name: "Imphal APMC (Khwairamband)", district: "Imphal West", state: "Manipur", lat: 24.8170, lng: 93.9368, cess: 0.012, isNationalHub: false, tagline: "Iconic Historic Market & Black Rice Exchange", prices: { ONION: 3190, TOMATO: 2450, POTATO: 1940, SOYBEAN: 4810, WHEAT: 2420, COTTON: 7060 } },

    // --- 29. MIZORAM ---
    MND_AIZ: { id: "MND_AIZ", name: "Aizawl APMC (Bara Bazar)", district: "Aizawl", state: "Mizoram", lat: 23.7271, lng: 92.7176, cess: 0.012, isNationalHub: false, tagline: "Mizoram Anthurium, Ginger & Hill Produce Terminal", prices: { ONION: 3200, TOMATO: 2460, POTATO: 1950, SOYBEAN: 4800, WHEAT: 2410, COTTON: 7050 } },

    // --- 30. ARUNACHAL PRADESH ---
    MND_ITA: { id: "MND_ITA", name: "Naharlagun APMC (Itanagar)", district: "Papum Pare", state: "Arunachal Pradesh", lat: 27.1044, lng: 93.6953, cess: 0.012, isNationalHub: false, tagline: "Eastern Himalayan Kiwi & Organic Market", prices: { ONION: 3220, TOMATO: 2480, POTATO: 1960, SOYBEAN: 4790, WHEAT: 2400, COTTON: 7030 } },

    // --- 31. SIKKIM ---
    MND_GAN: { id: "MND_GAN", name: "Gangtok APMC (Lall Market)", district: "East Sikkim", state: "Sikkim", lat: 27.3389, lng: 88.6065, cess: 0.012, isNationalHub: true, tagline: "India's First 100% Organic State Market", prices: { ONION: 3160, TOMATO: 2420, POTATO: 1910, SOYBEAN: 4860, WHEAT: 2450, COTTON: 7120 } }
};

const VILLAGES = [
    // Maharashtra Farming Villages
    { name: "Junnar", district: "Pune", state: "Maharashtra", lat: 19.2065, lng: 73.8767, specialty: "Kukadi Valley · High-yield Tomato, Onion & Perishable Vegetable Cluster" },
    { name: "Khed", district: "Pune", state: "Maharashtra", lat: 18.8547, lng: 73.9056, specialty: "Bhima Basin · Jyoti Potato & Rabi Onion Farming Belt" },
    { name: "Daund", district: "Pune", state: "Maharashtra", lat: 18.4650, lng: 74.5824, specialty: "Bhima River Plain · Sugarcane, Wheat & Perishables Cluster" },
    { name: "Shirur", district: "Pune", state: "Maharashtra", lat: 18.8277, lng: 74.3789, specialty: "Ghod Basin · Onion, Bajra & Soybean Agricultural Hub" },
    { name: "Baramati", district: "Pune", state: "Maharashtra", lat: 18.1517, lng: 74.5772, specialty: "Nira Canal Belt · Precision Agri Hub (Grapes, Sugarcane & Vegetables)" },
    { name: "Niphad", district: "Nashik", state: "Maharashtra", lat: 20.0765, lng: 74.1086, specialty: "Godavari Valley · Heart of Nashik Red Onion & Grape Belt" },
    { name: "Yeola", district: "Nashik", state: "Maharashtra", lat: 20.0422, lng: 74.4878, specialty: "North Maharashtra · Premier Red Onion & Coarse Grain Center" },
    { name: "Sinnar", district: "Nashik", state: "Maharashtra", lat: 19.8456, lng: 73.9986, specialty: "Darna Basin · Highland Tomato & Perishable Produce Zone" },
    { name: "Dindori", district: "Nashik", state: "Maharashtra", lat: 20.2014, lng: 73.8344, specialty: "Kadwa Basin · Renowned Table Grapes & Fresh Vegetables" },
    { name: "Rahata", district: "Ahmednagar", state: "Maharashtra", lat: 19.6894, lng: 74.4922, specialty: "Pravara Basin · High-yield Onion, Wheat & Dairy farming" },
    { name: "Sangamner", district: "Ahmednagar", state: "Maharashtra", lat: 19.5765, lng: 74.2123, specialty: "Pravara Valley · Perishable Vegetables & Pomegranate hub" },
    { name: "Karveer", district: "Kolhapur", state: "Maharashtra", lat: 16.6800, lng: 74.2000, specialty: "Panchganga Basin · Sugarcane, Soybean & Rice Granary" },
    { name: "Mohol", district: "Solapur", state: "Maharashtra", lat: 17.8188, lng: 75.6494, specialty: "Sina Basin · Jowar, Pulses & Dryland Soybean hub" },
    { name: "Pandharpur", district: "Solapur", state: "Maharashtra", lat: 17.6775, lng: 75.3267, specialty: "Bhima Basin · Pomegranate, Onion & Rabi Jowar belt" },
    { name: "Raver", district: "Jalgaon", state: "Maharashtra", lat: 21.2464, lng: 76.0336, specialty: "Tapi Valley · Grand Nain Banana & Pulse Capital of Maharashtra" },

    // Pan-India Agricultural Source Villages
    { name: "Karnal Rural", district: "Karnal", state: "Haryana", lat: 29.7400, lng: 76.9200, specialty: "Indo-Gangetic Plain · World-famous Basmati Rice & Wheat Granary" },
    { name: "Mathura Dehat", district: "Mathura", state: "Uttar Pradesh", lat: 27.4924, lng: 77.6737, specialty: "Yamuna Basin · Potato, Mustard & Wheat farming cluster" },
    { name: "Alwar Rural", district: "Alwar", state: "Rajasthan", lat: 27.5530, lng: 76.6346, specialty: "Mewat Agricultural Zone · Mustard, Red Onion & Bajra belt" },
    { name: "Kota Rural", district: "Kota", state: "Rajasthan", lat: 25.1200, lng: 75.9200, specialty: "Chambal Valley Irrigation Belt · Soybean & Wheat basket" },
    { name: "Ujjain Rural", district: "Ujjain", state: "Madhya Pradesh", lat: 23.1765, lng: 75.7885, specialty: "Malwa Plateau · Premium Sharbati Wheat & Soybean heartland" },
    { name: "Bardhaman Gramin", district: "Purba Bardhaman", state: "West Bengal", lat: 23.2324, lng: 87.8615, specialty: "Damodar Basin · Rice Bowl of Bengal & Potato cluster" },
    { name: "Muzaffarpur Dehat", district: "Muzaffarpur", state: "Bihar", lat: 26.1209, lng: 85.3647, specialty: "Burhi Gandak Plains · Shahi Litchi & Maize farm belt" },
    { name: "Samastipur Rural", district: "Samastipur", state: "Bihar", lat: 25.8622, lng: 85.7811, specialty: "Mithila Fertile Belt · Winter Maize, Tobacco & Vegetables" },
    { name: "Warangal Rural", district: "Warangal", state: "Telangana", lat: 17.9200, lng: 79.5500, specialty: "Kakatiya Agro Zone · High-grade Cotton, Chili & Paddy belt" },
    { name: "Thanjavur Delta", district: "Thanjavur", state: "Tamil Nadu", lat: 10.7870, lng: 79.1378, specialty: "Cauvery Delta · Historic Rice Bowl & Coconut plantations" },
    { name: "Dindigul Rural", district: "Dindigul", state: "Tamil Nadu", lat: 10.3673, lng: 77.9803, specialty: "Sirumalai Foothills · Vegetable, Small Onion & Banana belt" },
    { name: "Wayanad Agri Belt", district: "Wayanad", state: "Kerala", lat: 11.6854, lng: 76.1320, specialty: "Western Ghats Highland · Spices, Tea, Coffee & Plantain belt" },
    { name: "Cuttack Gramya", district: "Cuttack", state: "Odisha", lat: 20.4100, lng: 85.9200, specialty: "Mahanadi Delta · Paddy, Pulses & Riverbed vegetable farming" },
    { name: "Kamrup Gramin", district: "Kamrup", state: "Assam", lat: 26.2200, lng: 91.5600, specialty: "Brahmaputra Valley · Organic Ginger, Assam Tea & Rice belt" },
    { name: "Anand Agri Hub", district: "Anand", state: "Gujarat", lat: 22.5645, lng: 72.9289, specialty: "Charotar Region · Amul Dairy Heartland, Tobacco & Vegetables" }
];

const VEHICLES = {
    BOLERO: { name: "Small Pickup (Bolero)", capacity: 25, ratePerKmQtl: 4.00, fixedCost: 200 },
    TRACTOR: { name: "Tractor Trolley", capacity: 45, ratePerKmQtl: 3.80, fixedCost: 300 },
    EICHER: { name: "Medium Truck (Eicher 6W)", capacity: 90, ratePerKmQtl: 3.20, fixedCost: 500 },
    HEAVY: { name: "Heavy Multi-Axle Truck", capacity: 180, ratePerKmQtl: 2.50, fixedCost: 800 }
};

// ==========================================
// 1.3 PAN-INDIA USER LOCATION & GEOLOCATION CONTROLLER
// ==========================================

const MAJOR_INDIAN_JUNCTIONS = {
    "Narayangaon": { lat: 19.1230, lng: 73.9740, state: "Maharashtra" },
    "Alephata": { lat: 19.1827, lng: 74.1165, state: "Maharashtra" },
    "Satara": { lat: 17.6805, lng: 73.9997, state: "Maharashtra" },
    "Phaltan": { lat: 17.9867, lng: 74.4364, state: "Maharashtra" },
    "Kurduvadi": { lat: 18.0847, lng: 75.4356, state: "Maharashtra" },
    "Kopargaon": { lat: 19.8833, lng: 74.4833, state: "Maharashtra" },
    "Bhusawal": { lat: 21.0455, lng: 75.7885, state: "Maharashtra" },
    "Dhule": { lat: 20.9042, lng: 74.7749, state: "Maharashtra" },
    "Aurangabad": { lat: 19.8762, lng: 75.3433, state: "Maharashtra" },
    "Nanded": { lat: 19.1383, lng: 77.3210, state: "Maharashtra" },
    "Yavatmal": { lat: 20.3888, lng: 78.1204, state: "Maharashtra" },
    "Surat": { lat: 21.1702, lng: 72.8311, state: "Gujarat" },
    "Vadodara": { lat: 22.3072, lng: 73.1812, state: "Gujarat" },
    "Ahmedabad": { lat: 23.0225, lng: 72.5714, state: "Gujarat" },
    "Ajmer": { lat: 26.4499, lng: 74.6399, state: "Rajasthan" },
    "Udaipur": { lat: 24.5854, lng: 73.7125, state: "Rajasthan" },
    "Gwalior": { lat: 26.2183, lng: 78.1828, state: "Madhya Pradesh" },
    "Agra": { lat: 27.1767, lng: 78.0081, state: "Uttar Pradesh" },
    "Jhansi": { lat: 25.4484, lng: 78.5685, state: "Uttar Pradesh" },
    "Karnal": { lat: 29.6857, lng: 76.9905, state: "Haryana" },
    "Ambala": { lat: 30.3782, lng: 76.7767, state: "Haryana" },
    "Kharagpur": { lat: 22.3361, lng: 87.3237, state: "West Bengal" },
    "Visakhapatnam": { lat: 17.6868, lng: 83.2185, state: "Andhra Pradesh" },
    "Salem": { lat: 11.6643, lng: 78.1460, state: "Tamil Nadu" },
    "Dindigul": { lat: 10.3673, lng: 77.9803, state: "Tamil Nadu" },
    "Belagavi": { lat: 15.8497, lng: 74.4977, state: "Karnataka" },
    "Hubballi": { lat: 15.3647, lng: 75.1240, state: "Karnataka" },
    "Hyderabad": { lat: 17.3850, lng: 78.4867, state: "Telangana" },
    "Vijayawada": { lat: 16.5062, lng: 80.6480, state: "Andhra Pradesh" },
    "Haridwar": { lat: 29.9457, lng: 78.1642, state: "Uttarakhand" },
    "Silchar": { lat: 24.8333, lng: 92.7789, state: "Assam" },
    "Ratlam": { lat: 23.3315, lng: 75.0367, state: "Madhya Pradesh" }
};

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function findNearestRoadNodes(lat, lng, maxCount = 3) {
    const allKnown = [];
    for (const m of Object.values(MANDIS)) {
        allKnown.push({ name: m.name, district: m.district, state: m.state, lat: m.lat, lng: m.lng, type: 'mandi' });
    }
    for (const v of VILLAGES) {
        allKnown.push({ name: v.name, district: v.district, state: v.state, lat: v.lat, lng: v.lng, type: 'village' });
    }
    for (const [jName, jObj] of Object.entries(MAJOR_INDIAN_JUNCTIONS)) {
        allKnown.push({ name: jName, district: jName, state: jObj.state, lat: jObj.lat, lng: jObj.lng, type: 'junction' });
    }

    const calculated = allKnown.map(n => {
        const straightKm = haversineDistanceKm(lat, lng, n.lat, n.lng);
        const roadKm = Math.max(1.0, Math.round(straightKm * 1.15 * 10) / 10);
        return { ...n, straightKm, roadKm };
    });

    calculated.sort((a, b) => a.straightKm - b.straightKm);
    return calculated.slice(0, maxCount);
}

function searchPanIndiaLocations(query, limit = 8) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return [];

    const candidates = [];
    const seen = new Set();

    function addCandidate(name, district, state, lat, lng, type) {
        const key = `${name}_${state}`.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);

        const matchScore = (name.toLowerCase().startsWith(q) ? 4 : 0) +
                           (name.toLowerCase().includes(q) ? 2 : 0) +
                           ((district && district.toLowerCase().includes(q)) ? 1 : 0) +
                           ((state && state.toLowerCase().includes(q)) ? 1 : 0);

        if (matchScore > 0) {
            candidates.push({ name, district, state, lat, lng, type, matchScore });
        }
    }

    for (const v of VILLAGES) {
        addCandidate(v.name, v.district, v.state, v.lat, v.lng, 'village');
    }
    for (const m of Object.values(MANDIS)) {
        addCandidate(m.name, m.district, m.state, m.lat, m.lng, 'mandi');
    }
    for (const [jName, jObj] of Object.entries(MAJOR_INDIAN_JUNCTIONS)) {
        addCandidate(jName, jName, jObj.state, jObj.lat, jObj.lng, 'junction');
    }

    candidates.sort((a, b) => b.matchScore - a.matchScore);
    return candidates.slice(0, limit);
}

let currentUserLocation = {
    nodeName: "Junnar",
    displayName: "Junnar (Pune, Maharashtra)",
    lat: 19.2065,
    lng: 73.8767,
    source: "default"
};

let userLocationMarker = null;
let isMapPickingMode = false;

function getOriginDisplayName(villageName) {
    if (currentUserLocation && (villageName === currentUserLocation.nodeName || villageName === "Your Farm Location")) {
        return currentUserLocation.displayName;
    }
    return villageName || (VILLAGES[0] ? VILLAGES[0].name : "Junnar");
}

function showToast(message, type = 'info') {
    const container = document.getElementById('kisanToastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `kisan-toast ${type}`;
    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '📍';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 280);
    }, 3800);
}

function setUserLocation(lat, lng, displayName, source = 'manual', options = {}) {
    const silent = Boolean(options && options.silent);
    const nodeName = "Your Farm Location";

    // 1. Remove previous dynamic road connections for user farm if present
    if (roadGraph && roadGraph.adjList && roadGraph.adjList.has(nodeName)) {
        const neighbors = roadGraph.adjList.get(nodeName) || [];
        neighbors.forEach(edge => {
            const backList = roadGraph.adjList.get(edge.dest);
            if (backList) {
                roadGraph.adjList.set(edge.dest, backList.filter(e => e.dest !== nodeName));
            }
        });
        roadGraph.adjList.delete(nodeName);
    }
    if (typeof dijkstraCache !== 'undefined') {
        dijkstraCache.delete(nodeName);
    }

    currentUserLocation = {
        nodeName: nodeName,
        displayName: displayName || `Custom Farm (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
        lat: lat,
        lng: lng,
        source: source
    };

    // 2. Connect user location to closest 3 road network nodes
    if (roadGraph) {
        const nearest = findNearestRoadNodes(lat, lng, 3);
        roadGraph.addNode(nodeName);
        nearest.forEach(nn => {
            roadGraph.addRoad(nodeName, nn.name, nn.roadKm, "Connecting Highway Link");
        });
    }

    // 3. Update hidden villageSelect
    const villageSelect = document.getElementById('villageSelect');
    if (villageSelect) {
        let opt = villageSelect.querySelector(`option[value="${nodeName}"]`);
        if (!opt) {
            opt = document.createElement('option');
            opt.value = nodeName;
            villageSelect.prepend(opt);
        }
        opt.textContent = `📍 ${currentUserLocation.displayName}`;
        villageSelect.value = nodeName;
    }

    // 4. Update UI input and badge
    const manualInput = document.getElementById('manualLocationInput');
    if (manualInput) {
        manualInput.value = currentUserLocation.displayName;
    }
    const badgeLabel = document.getElementById('activeLocLabel');
    if (badgeLabel) {
        badgeLabel.textContent = `📍 ${currentUserLocation.displayName}`;
    }
    const badge = document.getElementById('currentLocationStatusBadge');
    if (badge) {
        badge.classList.add('badge-highlight');
        setTimeout(() => badge.classList.remove('badge-highlight'), 500);
    }
    const originDisp = document.getElementById('mapOriginDisplay');
    if (originDisp) {
        originDisp.innerHTML = `Origin: <strong>${currentUserLocation.displayName}</strong>`;
    }

    // 5. Update Map Marker
    updateUserLocationMarkerOnMap(lat, lng, currentUserLocation.displayName);

    // 6. Recalculate Net Profits
    if (!silent && typeof calculateNetProfits === 'function') {
        calculateNetProfits({ isUserAction: true });
    }

    // 7. Save state to localStorage
    localStorage.setItem('kisan_user_location_set', 'true');
    localStorage.setItem('kisan_last_loc', JSON.stringify({
        lat, lng, displayName: currentUserLocation.displayName, source
    }));
}

function updateUserLocationMarkerOnMap(lat, lng, displayName) {
    if (!leafletMap) return;
    if (userLocationMarker) {
        userLocationMarker.setLatLng([lat, lng]);
    } else {
        const customIcon = L.divIcon({
            html: `
                <div class="kisan-user-location-marker" title="Your Farm Origin (Drag to move)">
                    <div class="user-pulse-ring"></div>
                    <div class="user-pin-icon">📍</div>
                </div>
            `,
            className: 'user-pin-wrapper',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -18]
        });
        userLocationMarker = L.marker([lat, lng], { icon: customIcon, draggable: true }).addTo(leafletMap);
        userLocationMarker.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            const nearest = findNearestRoadNodes(pos.lat, pos.lng, 1)[0];
            const placeName = nearest ? `near ${nearest.name} (${nearest.state || ''})` : `Farm (${pos.lat.toFixed(2)}°, ${pos.lng.toFixed(2)}°)`;
            setUserLocation(pos.lat, pos.lng, `📍 Your Location (${placeName})`, 'drag');
            showToast(`Farm origin moved to ${placeName}! Route recalculated.`, 'success');
        });
    }
    userLocationMarker.bindTooltip(`📍 Your Location: <strong>${displayName}</strong><br><small style="opacity:0.85;">Drag anywhere to change origin</small>`, {
        direction: 'top',
        offset: [0, -12],
        className: 'minimal-map-tooltip'
    });
}

function requestUserGeolocation(isAutoPrompt = false) {
    if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your browser.", "warning");
        return;
    }

    showToast("Requesting GPS location permission...", "info");

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const nearest = findNearestRoadNodes(lat, lng, 1)[0];
            let detectedName = nearest ? `near ${nearest.name} (${nearest.state || ''})` : `GPS (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=11`, {
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.address) {
                        const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state_district;
                        const state = data.address.state || '';
                        if (city) {
                            detectedName = state ? `${city}, ${state}` : city;
                        }
                    }
                }
            } catch (e) {
                // Ignore geocoding failure, fallback to nearest road node
            }

            setUserLocation(lat, lng, `📍 Your Location (${detectedName})`, 'gps');
            closeLocationPromptModal();
            showToast(`GPS Location detected: ${detectedName}! Mandi routes updated.`, 'success');

            if (leafletMap) {
                leafletMap.flyTo([lat, lng], 8, { duration: 1.2 });
            }
        },
        (err) => {
            console.warn("Geolocation access denied or failed:", err);
            let msg = "Location permission was denied. Enter location manually or select on the map.";
            if (err.code === err.TIMEOUT) msg = "Location request timed out. Please enter manually or select on map.";
            showToast(msg, "warning");

            const searchInput = document.getElementById('modalLocSearchInput') || document.getElementById('manualLocationInput');
            if (searchInput) searchInput.focus();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
}

function startMapPickMode() {
    closeLocationPromptModal();
    isMapPickingMode = true;

    const mapSection = document.getElementById('graphVisualizerSection');
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const banner = document.getElementById('mapPickingBanner');
    if (banner) banner.classList.remove('hidden');

    const mapEl = document.getElementById('indiaLeafletMap');
    if (mapEl) mapEl.classList.add('map-picking-active');

    const btn = document.getElementById('btnMapPickOrigin');
    if (btn) btn.classList.add('active');

    showToast("📍 Tap anywhere on the map to set your farm location", "info");
}

function endMapPickMode() {
    isMapPickingMode = false;
    const banner = document.getElementById('mapPickingBanner');
    if (banner) banner.classList.add('hidden');

    const mapEl = document.getElementById('indiaLeafletMap');
    if (mapEl) mapEl.classList.remove('map-picking-active');

    const btn = document.getElementById('btnMapPickOrigin');
    if (btn) btn.classList.remove('active');
}

function openLocationPromptModal() {
    const modal = document.getElementById('locationPromptModal');
    if (modal) modal.classList.remove('hidden');
}

function closeLocationPromptModal() {
    const modal = document.getElementById('locationPromptModal');
    if (modal) modal.classList.add('hidden');
    localStorage.setItem('kisan_loc_modal_dismissed', 'true');
}

function initLocationAutocomplete() {
    const manualInput = document.getElementById('manualLocationInput');
    const manualDropdown = document.getElementById('locationSuggestionsDropdown');
    const clearBtn = document.getElementById('btnClearManualLoc');

    const modalInput = document.getElementById('modalLocSearchInput');
    const modalDropdown = document.getElementById('modalLocSuggestions');

    const popularHubs = [
        { name: "Junnar", district: "Pune", state: "Maharashtra", lat: 19.2065, lng: 73.8767, type: "village", desc: "Tomato & Onion Valley" },
        { name: "Lasalgaon", district: "Nashik", state: "Maharashtra", lat: 20.1472, lng: 74.2281, type: "mandi", desc: "Asia's Largest Onion APMC" },
        { name: "Azadpur", district: "North Delhi", state: "Delhi", lat: 28.7161, lng: 77.1706, type: "mandi", desc: "National Capital Mega APMC" },
        { name: "Vashi (APMC)", district: "Navi Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.9980, type: "mandi", desc: "Mumbai Metro Trading Hub" },
        { name: "Pimpalgaon Baswant", district: "Nashik", state: "Maharashtra", lat: 20.1714, lng: 73.9877, type: "mandi", desc: "Grapes & Tomato Hub" },
        { name: "Indore", district: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577, type: "mandi", desc: "Central India Mandi Hub" }
    ];

    function attachSearch(inputEl, dropdownEl, onSelected) {
        if (!inputEl || !dropdownEl) return;

        function renderQuickMenu() {
            dropdownEl.innerHTML = `
                <div class="loc-dropdown-header">Quick Location Actions</div>
                <div class="loc-quick-item" id="quickGpsAction-${inputEl.id}">
                    <span class="loc-quick-icon">🎯</span>
                    <div class="loc-sugg-main">
                        <span class="loc-sugg-title">Use Current Location (GPS)</span>
                        <span class="loc-sugg-sub">Auto-detect device coordinates</span>
                    </div>
                </div>
                <div class="loc-quick-item" id="quickMapAction-${inputEl.id}">
                    <span class="loc-quick-icon">🗺️</span>
                    <div class="loc-sugg-main">
                        <span class="loc-sugg-title">Pick Location on GIS Map</span>
                        <span class="loc-sugg-sub">Tap any farm, road, or village on interactive map</span>
                    </div>
                </div>
                <div class="loc-dropdown-header">Popular Agricultural Hubs</div>
            `;

            popularHubs.forEach(hub => {
                const item = document.createElement('div');
                item.className = 'loc-suggestion-item';
                const typeIcon = hub.type === 'mandi' ? '🏛️' : '🏡';
                item.innerHTML = `
                    <div class="loc-sugg-main">
                        <span class="loc-sugg-title">${typeIcon} ${hub.name}</span>
                        <span class="loc-sugg-sub">${hub.district ? hub.district + ', ' : ''}${hub.state} • ${hub.desc}</span>
                    </div>
                    <span class="loc-sugg-badge">${hub.type === 'mandi' ? 'APMC Mandi' : 'Farm Belt'}</span>
                `;
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectLocation(hub);
                });
                dropdownEl.appendChild(item);
            });

            const gpsAction = dropdownEl.querySelector(`#quickGpsAction-${inputEl.id}`);
            if (gpsAction) {
                gpsAction.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownEl.classList.add('hidden');
                    requestUserGeolocation(false);
                });
            }

            const mapAction = dropdownEl.querySelector(`#quickMapAction-${inputEl.id}`);
            if (mapAction) {
                mapAction.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownEl.classList.add('hidden');
                    startMapPickMode();
                });
            }

            dropdownEl.classList.remove('hidden');
        }

        function selectLocation(loc) {
            const disp = `${loc.name} (${loc.state})`;
            inputEl.value = disp;
            dropdownEl.classList.add('hidden');
            setUserLocation(loc.lat, loc.lng, disp, 'manual');
            showToast(`Origin set to ${loc.name}! Mandi routes updated.`, 'success');
            if (leafletMap) {
                leafletMap.flyTo([loc.lat, loc.lng], 8, { duration: 1.0 });
            }
            if (onSelected) onSelected(loc);
        }

        inputEl.addEventListener('focus', () => {
            const query = inputEl.value.trim().toLowerCase();
            if (!query || query.length < 2) {
                renderQuickMenu();
            }
        });

        inputEl.addEventListener('click', () => {
            if (dropdownEl.classList.contains('hidden')) {
                const query = inputEl.value.trim().toLowerCase();
                if (!query || query.length < 2) {
                    renderQuickMenu();
                }
            }
        });

        inputEl.addEventListener('input', () => {
            const query = inputEl.value.trim().toLowerCase();
            if (clearBtn && inputEl === manualInput) {
                clearBtn.classList.toggle('hidden', !query);
            }
            if (!query) {
                renderQuickMenu();
                return;
            }

            const results = searchPanIndiaLocations(query, 8);
            if (results.length === 0) {
                dropdownEl.innerHTML = `
                    <div class="loc-suggestion-item" style="cursor:default;opacity:0.75;">
                        <span class="text-xs">No direct matches. Press Enter to search nearest road node.</span>
                    </div>
                `;
                dropdownEl.classList.remove('hidden');
                return;
            }

            const frag = document.createDocumentFragment();
            results.forEach(loc => {
                const item = document.createElement('div');
                item.className = 'loc-suggestion-item';
                const typeIcon = loc.type === 'mandi' ? '🏛️' : loc.type === 'village' ? '🏡' : '🛣️';
                const typeBadge = loc.type === 'mandi' ? 'APMC Mandi' : loc.type === 'village' ? 'Farm Belt' : 'Highway Hub';

                item.innerHTML = `
                    <div class="loc-sugg-main">
                        <span class="loc-sugg-title">${typeIcon} ${loc.name}</span>
                        <span class="loc-sugg-sub">${loc.district ? loc.district + ' District, ' : ''}${loc.state}</span>
                    </div>
                    <span class="loc-sugg-badge">${typeBadge}</span>
                `;
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectLocation(loc);
                });
                frag.appendChild(item);
            });

            dropdownEl.innerHTML = '';
            dropdownEl.appendChild(frag);
            dropdownEl.classList.remove('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
                dropdownEl.classList.add('hidden');
            }
        });
    }

    attachSearch(manualInput, manualDropdown);
    attachSearch(modalInput, modalDropdown, () => {
        closeLocationPromptModal();
    });

    if (clearBtn && manualInput) {
        clearBtn.addEventListener('click', () => {
            manualInput.value = '';
            clearBtn.classList.add('hidden');
            manualInput.focus();
        });
    }
}

// ==========================================
// 2. GRAPH & HANDCRAFTED DIJKSTRA ALGORITHM
// ==========================================

class RoadNetworkGraph {
    constructor() {
        this.adjList = new Map();
    }

    addNode(node) {
        if (!this.adjList.has(node)) {
            this.adjList.set(node, []);
        }
    }

    addRoad(u, v, distKm, roadType) {
        this.addNode(u);
        this.addNode(v);
        this.adjList.get(u).push({ dest: v, dist: distKm, roadType });
        this.adjList.get(v).push({ dest: u, dist: distKm, roadType });
    }

    /**
     * Handcrafted Dijkstra's Algorithm
     * Computes shortest distance and predecessor path from source node to all reachable nodes.
     */
    computeShortestPaths(source) {
        if (!this.adjList.has(source)) return {};

        const distances = {};
        const predecessors = {};
        const visited = new Set();

        for (const node of this.adjList.keys()) {
            distances[node] = Infinity;
        }
        distances[source] = 0;

        // Min-Priority Queue implementation using simple array
        const pq = [{ node: source, dist: 0 }];

        while (pq.length > 0) {
            // Extract minimum distance node
            pq.sort((a, b) => a.dist - b.dist);
            const { node: u } = pq.shift();

            if (visited.has(u)) continue;
            visited.add(u);

            const neighbors = this.adjList.get(u) || [];
            for (const edge of neighbors) {
                const v = edge.dest;
                if (visited.has(v)) continue;

                const alt = distances[u] + edge.dist;
                if (alt < distances[v]) {
                    distances[v] = alt;
                    predecessors[v] = u;
                    pq.push({ node: v, dist: alt });
                }
            }
        }

        // Reconstruct paths
        const results = {};
        for (const target of this.adjList.keys()) {
            if (distances[target] !== Infinity) {
                const path = [];
                let curr = target;
                while (curr) {
                    path.unshift(curr);
                    if (curr === source) break;
                    curr = predecessors[curr];
                }
                if (path[0] === source) {
                    results[target] = {
                        distance: distances[target],
                        path: path
                    };
                }
            }
        }
        return results;
    }
}

// Build Maharashtra APMC Road Graph
const roadGraph = new RoadNetworkGraph();

function initRoadGraph() {
    // 1. Pune & Maharashtra local clusters
    const P = "Pune APMC (Gultekdi)";
    const LAS = "Lasalgaon APMC";
    const NSK = "Nashik APMC";
    const AHM = "Ahmednagar APMC";
    const KOL = "Kolhapur APMC";
    const SOL = "Solapur APMC";
    const JAL = "Jalgaon APMC";
    const LAT = "Latur APMC";
    const VAS = "Vashi APMC (Navi Mumbai)";
    const NAG = "Nagpur APMC (Kalamna)";
    const AUR = "Chhatrapati Sambhajinagar APMC";
    const AKO = "Akola APMC";

    // Pune cluster
    roadGraph.addRoad("Junnar", "Narayangaon", 16.0, "SH");
    roadGraph.addRoad("Narayangaon", "Khed", 38.0, "NH60");
    roadGraph.addRoad("Khed", P, 42.0, "NH60");
    roadGraph.addRoad("Narayangaon", "Alephata", 18.0, "NH60");
    roadGraph.addRoad("Alephata", AHM, 72.0, "SH50");
    roadGraph.addRoad("Alephata", "Sangamner", 48.0, "NH60");
    roadGraph.addRoad("Shirur", P, 64.0, "Nagar-Pune SH");
    roadGraph.addRoad("Shirur", AHM, 56.0, "Nagar-Pune SH");
    roadGraph.addRoad("Daund", P, 82.0, "SH");
    roadGraph.addRoad("Daund", "Shirur", 44.0, "MDR");
    roadGraph.addRoad("Daund", AHM, 74.0, "SH");
    roadGraph.addRoad("Baramati", P, 102.0, "SH61");
    roadGraph.addRoad("Baramati", "Daund", 46.0, "MDR");
    roadGraph.addRoad("Baramati", "Phaltan", 38.0, "SH");
    roadGraph.addRoad("Phaltan", "Pandharpur", 85.0, "SH71");

    // Nashik cluster
    roadGraph.addRoad("Niphad", LAS, 16.0, "MDR");
    roadGraph.addRoad("Niphad", NSK, 38.0, "SH");
    roadGraph.addRoad("Yeola", LAS, 24.0, "SH30");
    roadGraph.addRoad("Yeola", "Kopargaon", 28.0, "SH30");
    roadGraph.addRoad("Kopargaon", "Rahata", 16.0, "SH10");
    roadGraph.addRoad("Rahata", AHM, 76.0, "SH");
    roadGraph.addRoad("Rahata", "Sangamner", 42.0, "SH24");
    roadGraph.addRoad("Sangamner", "Sinnar", 48.0, "NH60");
    roadGraph.addRoad("Sinnar", NSK, 28.0, "NH60");
    roadGraph.addRoad("Dindori", NSK, 24.0, "MDR");
    roadGraph.addRoad("Dindori", "Niphad", 34.0, "Rural");

    // Southern Maharashtra cluster
    roadGraph.addRoad("Karveer", KOL, 14.0, "City Road");
    roadGraph.addRoad(KOL, "Satara", 120.0, "NH48");
    roadGraph.addRoad("Satara", P, 112.0, "NH48");
    roadGraph.addRoad("Mohol", SOL, 34.0, "NH65");
    roadGraph.addRoad("Pandharpur", "Mohol", 42.0, "SH161");
    roadGraph.addRoad("Pandharpur", SOL, 72.0, "NH561");
    roadGraph.addRoad(SOL, LAT, 124.0, "NH361");
    roadGraph.addRoad("Mohol", "Kurduvadi", 36.0, "SH141");
    roadGraph.addRoad("Kurduvadi", "Daund", 95.0, "SH68");

    // Northern Maharashtra cluster
    roadGraph.addRoad("Raver", "Bhusawal", 32.0, "SH4");
    roadGraph.addRoad("Bhusawal", JAL, 26.0, "NH53");
    roadGraph.addRoad(JAL, "Dhule", 88.0, "NH53");
    roadGraph.addRoad("Dhule", NSK, 155.0, "NH52");

    // Maharashtra Inter-Mandi arteries
    roadGraph.addRoad(P, VAS, 148.0, "Mumbai-Pune Expressway");
    roadGraph.addRoad(NSK, VAS, 162.0, "NH160");
    roadGraph.addRoad(P, AHM, 122.0, "SH27");
    roadGraph.addRoad(AHM, AUR, 114.0, "SH");
    roadGraph.addRoad(AUR, JAL, 158.0, "NH52");
    roadGraph.addRoad(AUR, LAT, 220.0, "NH52");
    roadGraph.addRoad(AUR, AKO, 230.0, "Samruddhi Mahamarg");
    roadGraph.addRoad(AKO, NAG, 250.0, "NH53");
    roadGraph.addRoad(LAT, "Nanded", 130.0, "NH361");
    roadGraph.addRoad("Nanded", AKO, 190.0, "NH161");
    roadGraph.addRoad("Nanded", "Yavatmal", 185.0, "NH361");
    roadGraph.addRoad("Yavatmal", NAG, 152.0, "NH361");

    // 2. DELHI & NCR Corridors
    const DEL = "Azadpur APMC (Delhi)";
    const GHA = "Ghazipur APMC (Delhi)";
    const OBL = "Okhla APMC (Delhi)";
    roadGraph.addRoad(DEL, GHA, 18.0, "Delhi Inner Ring");
    roadGraph.addRoad(DEL, OBL, 22.0, "Delhi Outer Ring");
    roadGraph.addRoad(DEL, "Meerut APMC", 75.0, "Delhi-Meerut Expy");
    roadGraph.addRoad("Meerut APMC", "Aligarh APMC", 135.0, "NH334");
    roadGraph.addRoad("Aligarh APMC", "Agra APMC", 85.0, "NH509");

    // 3. PUNJAB & HARYANA & CHANDIGARH (NH44 / NH7 / NH9 / NH54)
    const KHA = "Khanna APMC (Punjab)";
    const LUD = "Ludhiana APMC";
    const ASR = "Amritsar APMC (Bhagtanwala)";
    const JAL_PB = "Jalandhar APMC (Maksudan)";
    const BTI = "Bathinda APMC";
    const KARN = "Karnal APMC";
    const AMB = "Ambala APMC";
    const CHD = "Chandigarh APMC (Sector 26)";
    const SIR = "Sirsa APMC";
    const HIS = "Hisar APMC";
    const ROH = "Rohtak APMC";

    roadGraph.addRoad(DEL, ROH, 72.0, "NH9");
    roadGraph.addRoad(ROH, HIS, 98.0, "NH9");
    roadGraph.addRoad(HIS, SIR, 82.0, "NH9");
    roadGraph.addRoad(SIR, BTI, 78.0, "NH54");
    roadGraph.addRoad(BTI, LUD, 140.0, "NH7");
    roadGraph.addRoad(BTI, "Sri Ganganagar APMC", 125.0, "NH62");

    roadGraph.addRoad(DEL, KARN, 125.0, "NH44");
    roadGraph.addRoad("Karnal Rural", KARN, 14.0, "Rural Link");
    roadGraph.addRoad(KARN, AMB, 85.0, "NH44");
    roadGraph.addRoad(AMB, KHA, 82.0, "NH44");
    roadGraph.addRoad(KHA, LUD, 42.0, "NH44");
    roadGraph.addRoad(LUD, JAL_PB, 60.0, "NH44");
    roadGraph.addRoad(JAL_PB, ASR, 80.0, "NH44");

    roadGraph.addRoad(AMB, CHD, 45.0, "NH152");

    // 4. HIMACHAL PRADESH & JAMMU-KASHMIR (NH44 / NH5 / NH1)
    const SHI = "Shimla APMC (Dhalli)";
    const SOL_HP = "Solan APMC";
    const KUL = "Kullu APMC (Bajaura)";
    const SOP = "Sopore Fruit Mandi (J&K)";
    const SRI = "Srinagar APMC (Parimpora)";
    const JAM = "Jammu APMC (Narwal Mandi)";

    roadGraph.addRoad(CHD, SOL_HP, 68.0, "NH5");
    roadGraph.addRoad(SOL_HP, SHI, 46.0, "NH5");
    roadGraph.addRoad(SHI, KUL, 205.0, "NH305");
    roadGraph.addRoad(ASR, JAM, 215.0, "NH44");
    roadGraph.addRoad(JAL_PB, JAM, 215.0, "NH44");
    roadGraph.addRoad(JAM, SRI, 260.0, "NH44");
    roadGraph.addRoad(SRI, SOP, 50.0, "NH1");

    // 5. UTTARAKHAND (NH7 / NH34 / NH530)
    const DDN = "Dehradun APMC (Niranjanpur)";
    const HAL = "Haldwani APMC (Uttarakhand)";
    roadGraph.addRoad(CHD, DDN, 165.0, "NH7");
    roadGraph.addRoad(DDN, "Haridwar", 52.0, "NH34");
    roadGraph.addRoad("Haridwar", HAL, 175.0, "NH734");
    roadGraph.addRoad(HAL, "Bareilly APMC", 105.0, "NH530");

    // 6. UTTAR PRADESH CORRIDORS (NH19 / NH27 / NH30)
    const AGR = "Agra APMC";
    const KAN = "Kanpur APMC (Kalyanpur)";
    const LKO = "Lucknow APMC (Dubagga)";
    const BAR = "Bareilly APMC";
    const GOR = "Gorakhpur APMC";
    const PRY = "Prayagraj APMC (Mundera)";
    const VAR = "Varanasi APMC (Chandpur)";

    roadGraph.addRoad(DEL, "Mathura Dehat", 140.0, "Yamuna Expressway");
    roadGraph.addRoad("Mathura Dehat", AGR, 45.0, "NH19");
    roadGraph.addRoad(AGR, KAN, 275.0, "NH19");
    roadGraph.addRoad(KAN, LKO, 85.0, "NH27");
    roadGraph.addRoad(LKO, BAR, 245.0, "NH30");
    roadGraph.addRoad(LKO, GOR, 270.0, "NH27");
    roadGraph.addRoad(KAN, PRY, 200.0, "NH19");
    roadGraph.addRoad(PRY, VAR, 120.0, "NH19");
    roadGraph.addRoad(GOR, VAR, 195.0, "NH28");

    // 7. BIHAR & JHARKHAND & BENGAL (NH19 / NH22 / NH33 / NH27)
    const PAT = "Patna APMC (Bazar Samiti)";
    const PUR = "Purnia APMC (Gulabbagh)";
    const MUZ = "Muzaffarpur APMC";
    const BHA = "Bhagalpur APMC";
    const GAY = "Gaya APMC";
    const RAN = "Ranchi APMC (Pandra)";
    const JAM_JH = "Jamshedpur APMC (Parsudih)";
    const KOLK = "Kolkata APMC (Koley Market)";
    const BUR = "Burdwan APMC";
    const MAL = "Malda APMC";
    const SIL = "Siliguri APMC";
    const GAN = "Gangtok APMC (Lall Market)";

    roadGraph.addRoad(VAR, PAT, 245.0, "NH19");
    roadGraph.addRoad(PAT, MUZ, 70.0, "NH22");
    roadGraph.addRoad("Muzaffarpur Dehat", MUZ, 12.0, "Rural Road");
    roadGraph.addRoad(MUZ, GOR, 230.0, "NH27");
    roadGraph.addRoad(PAT, GAY, 105.0, "NH22");
    roadGraph.addRoad(GAY, RAN, 180.0, "NH33");
    roadGraph.addRoad(RAN, JAM_JH, 130.0, "NH43");
    roadGraph.addRoad(JAM_JH, "Bardhaman Gramin", 160.0, "NH18");
    roadGraph.addRoad("Bardhaman Gramin", BUR, 14.0, "State Highway");
    roadGraph.addRoad(BUR, KOLK, 105.0, "NH19");
    roadGraph.addRoad(PAT, BHA, 225.0, "NH33");
    roadGraph.addRoad(BHA, PUR, 85.0, "NH31");
    roadGraph.addRoad("Samastipur Rural", PUR, 210.0, "NH27");
    roadGraph.addRoad(BHA, MAL, 135.0, "NH80");
    roadGraph.addRoad(MAL, SIL, 235.0, "NH12");
    roadGraph.addRoad(PUR, SIL, 165.0, "NH27");
    roadGraph.addRoad(SIL, GAN, 115.0, "NH10");

    // 8. NORTH-EAST CORRIDORS (NH27 / NH6 / NH8 / NH2 / NH15 / NH29 / NH306)
    const GUW = "Guwahati APMC (Pamohi)";
    const DIB = "Dibrugarh APMC";
    const JOR = "Jorhat APMC";
    const SHL = "Shillong APMC (Mawiong)";
    const AGT = "Agartala APMC (Battala)";
    const DIM = "Dimapur APMC";
    const IMP = "Imphal APMC (Khwairamband)";
    const AIZ = "Aizawl APMC (Bara Bazar)";
    const ITA = "Naharlagun APMC (Itanagar)";

    roadGraph.addRoad(SIL, "Kamrup Gramin", 430.0, "NH27");
    roadGraph.addRoad("Kamrup Gramin", GUW, 25.0, "NH27");
    roadGraph.addRoad(GUW, SHL, 95.0, "NH6");
    roadGraph.addRoad(SHL, "Silchar", 215.0, "NH6");
    roadGraph.addRoad("Silchar", AGT, 290.0, "NH8");
    roadGraph.addRoad("Silchar", AIZ, 180.0, "NH306");
    roadGraph.addRoad(GUW, JOR, 305.0, "NH715");
    roadGraph.addRoad(JOR, DIB, 135.0, "NH2");
    roadGraph.addRoad(JOR, DIM, 130.0, "NH29");
    roadGraph.addRoad(DIM, IMP, 205.0, "NH2");
    roadGraph.addRoad(GUW, ITA, 320.0, "NH15");

    // 9. RAJASTHAN CORRIDORS (NH48 / NH52 / NH62 / NH25 / NH21)
    const JAI = "Jaipur APMC (Muhana Mandi)";
    const KOT = "Kota APMC (Bhamashah)";
    const JOD = "Jodhpur APMC (Bhagat Ki Kothi)";
    const BIK = "Bikaner APMC (Karni Nagar)";
    const SGN = "Sri Ganganagar APMC";
    const ALW = "Alwar APMC";

    roadGraph.addRoad(DEL, "Alwar Rural", 140.0, "Delhi-Mumbai Expy");
    roadGraph.addRoad("Alwar Rural", ALW, 12.0, "MDR");
    roadGraph.addRoad(ALW, JAI, 145.0, "NH21");
    roadGraph.addRoad(ALW, AGR, 160.0, "NH21");
    roadGraph.addRoad(JAI, "Ajmer", 135.0, "NH48");
    roadGraph.addRoad("Ajmer", JOD, 205.0, "NH25");
    roadGraph.addRoad(JOD, BIK, 250.0, "NH62");
    roadGraph.addRoad(BIK, SGN, 245.0, "NH62");
    roadGraph.addRoad(JAI, KOT, 240.0, "NH52");
    roadGraph.addRoad("Kota Rural", KOT, 18.0, "SH33");
    roadGraph.addRoad("Ajmer", "Udaipur", 265.0, "NH48");
    roadGraph.addRoad("Udaipur", KOT, 270.0, "NH27");

    // 10. MADHYA PRADESH & CHHATTISGARH (NH52 / NH46 / NH44 / NH47 / NH53 / NH56)
    const IND = "Indore APMC (Madhya Pradesh)";
    const NEE = "Neemuch APMC (MP)";
    const BHO = "Bhopal APMC (Karond)";
    const UJJ = "Ujjain APMC (Chimanganj)";
    const JAB = "Jabalpur APMC";
    const RAI = "Raipur APMC (Dumartarai)";
    const BIL = "Bilaspur APMC (Tifra)";

    roadGraph.addRoad("Udaipur", NEE, 135.0, "NH56");
    roadGraph.addRoad(NEE, "Ratlam", 140.0, "NH56");
    roadGraph.addRoad("Ratlam", UJJ, 100.0, "SH17");
    roadGraph.addRoad("Ujjain Rural", UJJ, 12.0, "Rural Road");
    roadGraph.addRoad(UJJ, IND, 55.0, "SH27");
    roadGraph.addRoad(KOT, IND, 240.0, "NH52");
    roadGraph.addRoad("Dhule", IND, 258.0, "NH52");
    roadGraph.addRoad(IND, BHO, 195.0, "SH18");
    roadGraph.addRoad(BHO, JAB, 310.0, "NH45");
    roadGraph.addRoad("Jhansi", JAB, 340.0, "NH44");
    roadGraph.addRoad("Jhansi", "Gwalior", 102.0, "NH44");
    roadGraph.addRoad("Gwalior", AGR, 122.0, "NH44");
    roadGraph.addRoad("Jhansi", KAN, 225.0, "NH27");
    roadGraph.addRoad("Jhansi", NAG, 460.0, "NH44");
    roadGraph.addRoad(IND, NAG, 440.0, "NH47");
    roadGraph.addRoad(JAB, BIL, 290.0, "NH45");
    roadGraph.addRoad(BIL, RAI, 115.0, "NH130");
    roadGraph.addRoad(RAI, NAG, 285.0, "NH53");

    // 11. GUJARAT & GOA (NH48 / NH27 / NH47 / NH66 / NH41)
    const GON = "Gondal APMC (Gujarat)";
    const UNJ = "Unjha APMC (Gujarat)";
    const MAH = "Mahuva APMC (Gujarat)";
    const AHM_GJ = "Ahmedabad APMC (Jamalpur)";
    const RJK = "Rajkot APMC (Bedi Mandi)";
    const SUR = "Surat APMC";
    const MAR = "Margao APMC (Goa)";
    const MAP = "Mapusa APMC (Goa)";

    roadGraph.addRoad("Udaipur", AHM_GJ, 260.0, "NH48");
    roadGraph.addRoad(AHM_GJ, UNJ, 95.0, "NH41");
    roadGraph.addRoad(AHM_GJ, RJK, 215.0, "NH47");
    roadGraph.addRoad(RJK, GON, 38.0, "NH27");
    roadGraph.addRoad(GON, MAH, 175.0, "SH25");
    roadGraph.addRoad(AHM_GJ, "Anand Agri Hub", 75.0, "NH48");
    roadGraph.addRoad("Anand Agri Hub", "Vadodara", 45.0, "NH48");
    roadGraph.addRoad("Vadodara", SUR, 152.0, "NH48");
    roadGraph.addRoad(SUR, VAS, 265.0, "NH48");

    roadGraph.addRoad(KOL, "Belagavi APMC", 110.0, "NH48");
    roadGraph.addRoad("Belagavi APMC", MAP, 115.0, "NH748");
    roadGraph.addRoad(MAP, MAR, 45.0, "NH66");
    roadGraph.addRoad(MAR, "Hubballi APMC (Amaragol)", 155.0, "NH67");

    // 12. ODISHA CORRIDORS (NH16 / NH53)
    const CUT = "Cuttack APMC (Chhatra Bazar)";
    const BBS = "Bhubaneswar APMC (Aiginia)";
    const SAM = "Sambalpur APMC (Khetrajpur)";

    roadGraph.addRoad(KOLK, CUT, 415.0, "NH16");
    roadGraph.addRoad("Cuttack Gramya", CUT, 12.0, "Rural Road");
    roadGraph.addRoad(CUT, BBS, 28.0, "NH16");
    roadGraph.addRoad(BBS, SAM, 295.0, "NH55");
    roadGraph.addRoad(SAM, RAI, 280.0, "NH53");
    roadGraph.addRoad(BBS, "Visakhapatnam", 440.0, "NH16");

    // 13. TELANGANA & ANDHRA PRADESH (NH44 / NH163 / NH365 / NH16 / NH65 / NH40)
    const HYD = "Hyderabad APMC (Bowenpally)";
    const WAR = "Warangal APMC (Enmamula)";
    const NIZ = "Nizamabad APMC";
    const KHM = "Khammam APMC";
    const GUN = "Guntur APMC (Andhra Pradesh)";
    const VIJ = "Vijayawada APMC (Gollapudi)";
    const KUR = "Kurnool APMC";
    const TIR = "Tirupati APMC";

    roadGraph.addRoad(NAG, NIZ, 340.0, "NH44");
    roadGraph.addRoad(NIZ, HYD, 175.0, "NH44");
    roadGraph.addRoad(SOL, HYD, 305.0, "NH65");
    roadGraph.addRoad(HYD, WAR, 145.0, "NH163");
    roadGraph.addRoad("Warangal Rural", WAR, 14.0, "MDR");
    roadGraph.addRoad(WAR, KHM, 115.0, "NH365");
    roadGraph.addRoad(KHM, VIJ, 105.0, "NH30");
    roadGraph.addRoad(VIJ, GUN, 34.0, "NH16");
    roadGraph.addRoad("Visakhapatnam", VIJ, 350.0, "NH16");
    roadGraph.addRoad(HYD, KUR, 215.0, "NH44");
    roadGraph.addRoad(KUR, TIR, 350.0, "NH40");
    roadGraph.addRoad(GUN, TIR, 375.0, "NH16");

    // 14. KARNATAKA CORRIDORS (NH48 / NH44 / NH67 / NH167)
    const BLR = "Yeshwanthpur APMC (Bengaluru)";
    const MYS = "Mysuru APMC (Bandipalya)";
    const HUB = "Hubballi APMC (Amaragol)";
    const BEL = "Belagavi APMC";
    const RAI_KA = "Raichur APMC";

    roadGraph.addRoad(BEL, HUB, 98.0, "NH48");
    roadGraph.addRoad(HYD, RAI_KA, 210.0, "NH167");
    roadGraph.addRoad(RAI_KA, HUB, 225.0, "NH67");
    roadGraph.addRoad(HUB, BLR, 412.0, "NH48");
    roadGraph.addRoad(HYD, BLR, 570.0, "NH44");
    roadGraph.addRoad(BLR, MYS, 145.0, "Bengaluru-Mysuru Expy");

    // 15. TAMIL NADU CORRIDORS (NH48 / NH44 / NH544 / NH45 / NH83)
    const CHE = "Chennai APMC (Koyambedu)";
    const MAD = "Madurai APMC (Paravai)";
    const CBE = "Coimbatore APMC (MGR Market)";
    const ERO = "Erode APMC (Perundurai)";
    const SLM = "Salem APMC";

    roadGraph.addRoad(TIR, CHE, 135.0, "NH716");
    roadGraph.addRoad(GUN, CHE, 410.0, "NH16");
    roadGraph.addRoad(BLR, CHE, 345.0, "NH48");
    roadGraph.addRoad(BLR, SLM, 200.0, "NH44");
    roadGraph.addRoad(CHE, SLM, 340.0, "NH48");
    roadGraph.addRoad(SLM, ERO, 65.0, "NH544");
    roadGraph.addRoad(ERO, CBE, 95.0, "NH544");
    roadGraph.addRoad(SLM, "Dindigul", 175.0, "NH44");
    roadGraph.addRoad("Dindigul Rural", "Dindigul", 15.0, "Rural Road");
    roadGraph.addRoad("Dindigul", MAD, 60.0, "NH44");
    roadGraph.addRoad(CHE, "Thanjavur Delta", 340.0, "NH45");
    roadGraph.addRoad("Thanjavur Delta", MAD, 185.0, "NH83");

    // 16. KERALA CORRIDORS (NH544 / NH66 / NH766 / NH85)
    const KOC = "Kochi APMC (Aluva Market)";
    const TVM = "Thiruvananthapuram APMC";
    const CCJ = "Kozhikode APMC (Palayam)";

    roadGraph.addRoad(BLR, "Wayanad Agri Belt", 275.0, "NH766");
    roadGraph.addRoad("Wayanad Agri Belt", CCJ, 85.0, "NH766");
    roadGraph.addRoad(CCJ, KOC, 185.0, "NH66");
    roadGraph.addRoad(CBE, KOC, 190.0, "NH544");
    roadGraph.addRoad(KOC, TVM, 218.0, "MC Road");
    roadGraph.addRoad(MAD, TVM, 260.0, "NH744");
    roadGraph.addRoad(MAD, KOC, 240.0, "NH85");
}

initRoadGraph();

// ==========================================
// 3. HANDCRAFTED SORTING ALGORITHMS
// ==========================================

let qsComparisons = 0;
let qsSwaps = 0;

function handcraftedQuickSort(arr, low = 0, high = arr.length - 1) {
    if (low === 0 && high === arr.length - 1) {
        qsComparisons = 0;
        qsSwaps = 0;
    }
    if (low < high) {
        const pi = partition(arr, low, high);
        handcraftedQuickSort(arr, low, pi - 1);
        handcraftedQuickSort(arr, pi + 1, high);
    }
    if (low === 0 && high === arr.length - 1) {
        arr.forEach((item, idx) => item.rank = idx + 1);
    }
    return arr;
}

function partition(arr, low, high) {
    // Middle element pivot to prevent worst-case degradation
    const mid = low + Math.floor((high - low) / 2);
    swap(arr, mid, high);

    const pivot = arr[high].netProfit;
    let i = low - 1;

    for (let j = low; j < high; j++) {
        qsComparisons++;
        // Descending order: higher profit first
        if (arr[j].netProfit > pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}

function swap(arr, i, j) {
    if (i !== j) {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        qsSwaps++;
    }
}

let msComparisons = 0;
let msMerges = 0;

function handcraftedMergeSort(arr) {
    msComparisons = 0;
    msMerges = 0;

    function mergeSortRecursive(list) {
        if (list.length <= 1) return list;

        const mid = Math.floor(list.length / 2);
        const left = mergeSortRecursive(list.slice(0, mid));
        const right = mergeSortRecursive(list.slice(mid));

        return merge(left, right);
    }

    function merge(left, right) {
        const result = [];
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            msComparisons++;
            if (left[i].netProfit >= right[j].netProfit) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
            msMerges++;
        }

        while (i < left.length) {
            result.push(left[i]);
            i++;
            msMerges++;
        }
        while (j < right.length) {
            result.push(right[j]);
            j++;
            msMerges++;
        }
        return result;
    }

    const sorted = mergeSortRecursive(arr);
    sorted.forEach((item, idx) => item.rank = idx + 1);
    return sorted;
}

// ==========================================
// 4. HANDCRAFTED TOP-K MIN-HEAP
// ==========================================

class TopKHeap {
    constructor(k) {
        this.k = k;
        this.heap = [];
    }

    insert(item) {
        if (this.heap.length < this.k) {
            this.heap.push(item);
            this.heapifyUp(this.heap.length - 1);
        } else if (item.netProfit > this.heap[0].netProfit) {
            this.heap[0] = item;
            this.heapifyDown(0);
        }
    }

    heapifyUp(idx) {
        while (idx > 0) {
            const parent = Math.floor((idx - 1) / 2);
            if (this.heap[idx].netProfit < this.heap[parent].netProfit) {
                const temp = this.heap[idx];
                this.heap[idx] = this.heap[parent];
                this.heap[parent] = temp;
                idx = parent;
            } else break;
        }
    }

    heapifyDown(idx) {
        const len = this.heap.length;
        while (idx < len) {
            let smallest = idx;
            const left = 2 * idx + 1;
            const right = 2 * idx + 2;

            if (left < len && this.heap[left].netProfit < this.heap[smallest].netProfit) {
                smallest = left;
            }
            if (right < len && this.heap[right].netProfit < this.heap[smallest].netProfit) {
                smallest = right;
            }

            if (smallest !== idx) {
                const temp = this.heap[idx];
                this.heap[idx] = this.heap[smallest];
                this.heap[smallest] = temp;
                idx = smallest;
            } else break;
        }
    }

    getSortedTopK() {
        // Extract in descending order
        const copy = [...this.heap];
        copy.sort((a, b) => b.netProfit - a.netProfit);
        copy.forEach((item, idx) => item.rank = idx + 1);
        return copy;
    }
}

// ==========================================
// 5. HANDCRAFTED BINARY SEARCH TREE (BST)
// ==========================================

class PriceBSTNode {
    constructor(mandiName, district, cropName, price) {
        this.mandiName = mandiName;
        this.district = district;
        this.cropName = cropName;
        this.price = price;
        this.left = null;
        this.right = null;
    }
}

class PriceBST {
    constructor() {
        this.root = null;
    }

    insert(mandiName, district, cropName, price) {
        const newNode = new PriceBSTNode(mandiName, district, cropName, price);
        if (!this.root) {
            this.root = newNode;
            return;
        }

        let curr = this.root;
        while (true) {
            if (price < curr.price) {
                if (!curr.left) {
                    curr.left = newNode;
                    break;
                }
                curr = curr.left;
            } else {
                if (!curr.right) {
                    curr.right = newNode;
                    break;
                }
                curr = curr.right;
            }
        }
    }

    inorder(node = this.root, results = []) {
        if (node) {
            this.inorder(node.left, results);
            results.push(node);
            this.inorder(node.right, results);
        }
        return results;
    }

    findRange(minPrice, maxPrice, node = this.root, results = []) {
        if (!node) return results;

        if (node.price > minPrice) {
            this.findRange(minPrice, maxPrice, node.left, results);
        }
        if (node.price >= minPrice && node.price <= maxPrice) {
            results.push(node);
        }
        if (node.price < maxPrice) {
            this.findRange(minPrice, maxPrice, node.right, results);
        }
        return results;
    }
}

// ==========================================
// 6. 0/1 KNAPSACK DYNAMIC PROGRAMMING
// ==========================================

function solve01Knapsack(lots, capacity) {
    const n = lots.length;
    // dp[i][w] = max profit considering first i lots with weight limit w
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const wt = lots[i - 1].weight;
        const val = lots[i - 1].profit;

        for (let w = 1; w <= capacity; w++) {
            if (wt <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], val + dp[i - 1][w - wt]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    const maxProfit = dp[n][capacity];

    // Backtrack to select items
    const selected = [];
    let w = capacity;
    let totalWeight = 0;

    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            const lot = lots[i - 1];
            selected.unshift(lot);
            w -= lot.weight;
            totalWeight += lot.weight;
        }
    }

    return {
        capacity,
        totalWeight,
        remainingCapacity: capacity - totalWeight,
        maxProfit,
        selectedLots: selected,
        dpMatrix: dp
    };
}

// ==========================================
// 7. PROFIT CALCULATION CONTROLLER
// ==========================================

let lastRankedResults = [];
let lastOriginVillage = "";

// Fast In-Memory Dijkstra Path Cache for Instant 0ms Calculations
const dijkstraCache = new Map();

function calculateNetProfits(options = {}) {
    const isUserAction = Boolean(options && options.isUserAction);
    const isInitial = Boolean(options && options.isInitial);
    const cropId = document.getElementById('cropSelect').value;
    const quantity = parseFloat(document.getElementById('quantityInput').value);
    const village = document.getElementById('villageSelect').value;
    const vehicleKey = document.getElementById('vehicleSelect').value;
    const sortAlgo = document.getElementById('algoSelect').value;

    const errorAlert = document.getElementById('errorAlert');
    errorAlert.classList.add('hidden');

    if (!quantity || quantity <= 0) {
        errorAlert.textContent = t('qtyPlaceholder') + " - Please enter a valid quantity greater than 0.";
        errorAlert.classList.remove('hidden');
        return;
    }

    const crop = CROPS[cropId];
    const vehicle = VEHICLES[vehicleKey];

    // 1. Fast memoized Dijkstra shortest path lookup
    let paths;
    if (dijkstraCache.has(village)) {
        paths = dijkstraCache.get(village);
    } else {
        paths = roadGraph.computeShortestPaths(village);
        dijkstraCache.set(village, paths);
    }
    const evaluations = [];

    for (const [mandiId, mandi] of Object.entries(MANDIS)) {
        const pathObj = paths[mandi.name];
        if (!pathObj) continue;

        const distanceKm = pathObj.distance;
        const pricePerQtl = mandi.prices[cropId];
        const grossRevenue = pricePerQtl * quantity;

        // Transport freight: distance * rate * quantity + fixed loading
        const transportCost = (distanceKm * vehicle.ratePerKmQtl * quantity) + vehicle.fixedCost;

        // APMC market cess
        const cessAmount = grossRevenue * mandi.cess;

        // Spoilage loss
        let transitLoss = 0;
        if (crop.category === "PERISHABLE") {
            const transitHours = distanceKm / 40.0; // 40 km/h avg speed
            const lossPct = Math.min(0.25, transitHours * crop.spoilageRatePerHour);
            transitLoss = grossRevenue * lossPct;
        }

        const netProfit = grossRevenue - transportCost - cessAmount - transitLoss;

        evaluations.push({
            mandi,
            crop,
            quantity,
            distanceKm,
            routePath: pathObj.path,
            pricePerQtl,
            grossRevenue,
            transportCost,
            cessAmount,
            transitLoss,
            netProfit
        });
    }

    // 2. Sort by Net Profit (Descending)
    let sortedResults;
    const startTime = performance.now();
    if (sortAlgo === "MERGE") {
        sortedResults = handcraftedMergeSort(evaluations);
    } else {
        sortedResults = handcraftedQuickSort(evaluations);
    }
    const execTime = (performance.now() - startTime).toFixed(3);

    lastRankedResults = sortedResults;
    lastOriginVillage = village;

    // 3. Render Results to UI with batch DocumentFragment
    renderResults(sortedResults, village, sortAlgo, execTime, isUserAction);

    // 4. Update Road Graph route line (without overriding user's zoom or pan)
    if (sortedResults.length > 0 && !isInitial) {
        highlightPathOnMap(sortedResults[0].routePath, { shouldFitBounds: false });
    }
}

function renderResults(results, village, algo, execTime, isUserAction = false) {
    const resultsContainer = document.getElementById('resultsContainer');
    const tableBody = document.getElementById('mandiTableBody');
    const bestHero = document.getElementById('bestMandiHero');
    const farmerInsight = document.getElementById('farmerInsightCard');

    resultsContainer.classList.remove('hidden');

    if (results.length === 0) {
        tableBody.innerHTML = '';
        bestHero.innerHTML = `<p class="p-4 text-center">No reachable mandis found from ${village}.</p>`;
        return;
    }

    const best = results[0];

    // Find nearest mandi
    const nearest = [...results].sort((a, b) => a.distanceKm - b.distanceKm)[0];
    const extraProfit = (best.netProfit - nearest.netProfit);

    // Render Best Mandi Hero
    const realizationPct = best.grossRevenue > 0 ? ((best.netProfit / best.grossRevenue) * 100).toFixed(1) : 0;
    const originDisplay = getOriginDisplayName(village);

    bestHero.innerHTML = `
        <div class="best-badge">
            <svg style="width:14px;height:14px;margin-right:5px;flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2.34"/><path d="M14 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
            ${t('bestOptionBadge')}
        </div>
        <div class="best-content-grid">
            <div class="best-info">
                <h3 class="best-mandi-name">${best.mandi.name}</h3>
                <p class="best-mandi-sub">${best.mandi.district}, ${best.mandi.state} • Shortest Distance: <strong>${best.distanceKm.toFixed(1)} km</strong></p>
                <div class="best-route-pill">
                    <svg style="width:14px;height:14px;margin-right:5px;vertical-align:-2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
                    <span class="route-origin-pill">📍 Your Location</span> <span class="route-sep">→</span> ${best.routePath.slice(1).join(' <span class="route-sep">→</span> ')}
                </div>
                <div class="best-actions-bar">
                    <button type="button" class="btn btn-primary best-action-btn" onclick="connectBestToKnapsack('${best.mandi.id}')">
                        <span class="btn-icon">⚡</span>
                        <span>Connect & Optimize Truck for ${best.mandi.name}</span>
                    </button>
                    <button type="button" class="btn btn-outline best-action-btn" onclick="connectBestToMap('${best.mandi.name}')">
                        <span class="btn-icon">🗺️</span>
                        <span>Trace Highway Route (${best.distanceKm.toFixed(0)} km)</span>
                    </button>
                </div>
            </div>
            <div class="best-stats">
                <div class="stat-box main-stat">
                    <span class="stat-label">${t('netProfitHeader')}</span>
                    <span class="stat-value">₹${Math.round(best.netProfit).toLocaleString('en-IN')}</span>
                    <span class="realization-tag">${realizationPct}% Realization</span>
                </div>
                <div class="stat-mini-grid">
                    <div class="stat-box">
                        <span class="stat-label">${t('priceHeader')}</span>
                        <span class="stat-sub">₹${best.pricePerQtl.toFixed(2)} / qtl</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">${t('grossHeader')}</span>
                        <span class="stat-sub">₹${Math.round(best.grossRevenue).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">${t('transportHeader')}</span>
                        <span class="stat-sub">₹${Math.round(best.transportCost).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Render Farmer Insight
    if (nearest.mandi.id !== best.mandi.id && extraProfit > 0) {
        farmerInsight.classList.remove('hidden');
        farmerInsight.innerHTML = `
            <div class="insight-icon" style="display:flex;align-items:center;">
                <svg style="width:20px;height:20px;color:var(--accent-mandi);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" x2="15" y1="18" y2="18"/><line x1="10" x2="14" y1="22" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
            </div>
            <div class="insight-text">
                <strong>${t('farmerInsightTitle')}:</strong>
                ${t('farmerInsightText')} <span class="profit-highlight">₹${Math.round(extraProfit).toLocaleString('en-IN')}</span>
                compared to nearest market (<em>${nearest.mandi.name}</em>, ${nearest.distanceKm.toFixed(1)} km) even after extra diesel freight!
            </div>
        `;
    } else {
        farmerInsight.classList.add('hidden');
    }

    // Populate Comparison Table using DocumentFragment for maximum 60fps rendering speed
    const tableFrag = document.createDocumentFragment();
    results.forEach(r => {
        const isBest = r.rank === 1;
        const row = document.createElement('tr');
        if (isBest) row.classList.add('best-row');

        const destName = r.routePath[r.routePath.length - 1];
        const routeHtml = r.routePath.length <= 2 
            ? `<span class="route-origin-pill">📍 Your Location</span> <span class="route-sep">→</span> <span class="route-dest-pill">${destName}</span>` 
            : `<span class="route-origin-pill">📍 Your Location</span> <span class="route-sep">→</span> <span class="route-mid">...</span> <span class="route-sep">→</span> <span class="route-dest-pill">${destName}</span>`;

        row.innerHTML = `
            <td class="text-center font-bold">${isBest ? '<span style="color:var(--accent-primary);font-weight:800;">★ #1</span>' : '#' + r.rank}</td>
            <td>
                <strong>${r.mandi.name}</strong>
                <div class="text-xs text-muted">${r.mandi.district}, ${r.mandi.state}</div>
            </td>
            <td>${r.distanceKm.toFixed(1)} km</td>
            <td>₹${r.pricePerQtl.toFixed(2)}</td>
            <td>₹${Math.round(r.grossRevenue).toLocaleString('en-IN')}</td>
            <td>₹${Math.round(r.transportCost).toLocaleString('en-IN')}</td>
            <td class="font-bold ${r.netProfit > 0 ? 'text-profit' : 'text-danger'}">
                ₹${Math.round(r.netProfit).toLocaleString('en-IN')}
            </td>
            <td class="text-xs text-muted route-col" title="Route from Your Location (${originDisplay}): ${r.routePath.join(' → ')} (${r.distanceKm.toFixed(1)} km)">
                ${routeHtml}
            </td>
            <td class="action-cell">
                <button type="button" class="btn-table-action" title="View on GIS Map" onclick="event.stopPropagation(); connectBestToMap('${r.mandi.name}')">🗺️ Map</button>
                <button type="button" class="btn-table-action primary" title="Optimize Truck for this Mandi" onclick="event.stopPropagation(); connectBestToKnapsack('${r.mandi.id}')">⚡ Truck</button>
            </td>
        `;
        row.addEventListener('click', () => highlightPathOnMap(r.routePath, { shouldFitBounds: true }));
        tableFrag.appendChild(row);
    });
    tableBody.innerHTML = '';
    tableBody.appendChild(tableFrag);

    // Populate Mobile Responsive Cards View using DocumentFragment
    const cardsWrapper = document.getElementById('cardsViewWrapper');
    if (cardsWrapper) {
        const cardsFrag = document.createDocumentFragment();
        results.forEach(r => {
            const isBest = r.rank === 1;
            const card = document.createElement('div');
            card.className = `mandi-mobile-card ${isBest ? 'best-card' : ''}`;
            card.innerHTML = `
                <div class="mandi-card-header">
                    <div>
                        <h4 class="mandi-card-title">${r.mandi.name}</h4>
                        <span class="text-xs text-muted">${r.mandi.district}, ${r.mandi.state} • ${r.distanceKm.toFixed(1)} km</span>
                    </div>
                    <span class="mandi-card-rank ${isBest ? 'best-rank' : ''}">${isBest ? '★ #1 BEST' : '#' + r.rank}</span>
                </div>
                <div class="mandi-card-net">
                    <span class="lbl">Estimated Net Profit:</span>
                    <div class="val ${r.netProfit > 0 ? 'text-profit' : 'text-danger'}">₹${Math.round(r.netProfit).toLocaleString('en-IN')}</div>
                </div>
                <div class="mandi-card-stats">
                    <div class="mandi-card-stat">
                        <span class="lbl">Mandi Price</span>
                        <span class="sub">₹${r.pricePerQtl.toFixed(2)}/qtl</span>
                    </div>
                    <div class="mandi-card-stat">
                        <span class="lbl">Gross Revenue</span>
                        <span class="sub">₹${Math.round(r.grossRevenue).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="mandi-card-stat">
                        <span class="lbl">Freight</span>
                        <span class="sub">₹${Math.round(r.transportCost).toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <div class="mandi-card-route">
                    <svg style="width:13px;height:13px;margin-right:4px;vertical-align:-2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
                    <span class="route-origin-pill">📍 Your Location</span> <span class="route-sep">→</span> ${r.routePath.slice(1).join(' <span class="route-sep">→</span> ')}
                </div>
                <div class="mandi-card-actions">
                    <button type="button" class="btn-table-action" onclick="event.stopPropagation(); connectBestToMap('${r.mandi.name}')">🗺️ Route on Map</button>
                    <button type="button" class="btn-table-action primary" onclick="event.stopPropagation(); connectBestToKnapsack('${r.mandi.id}')">⚡ Optimize Truck</button>
                </div>
            `;
            card.addEventListener('click', () => highlightPathOnMap(r.routePath, { shouldFitBounds: true }));
            cardsFrag.appendChild(card);
        });
        cardsWrapper.innerHTML = '';
        cardsWrapper.appendChild(cardsFrag);
    }

    // Update Benchmark Card
    document.getElementById('benchAlgoName').textContent = algo === "MERGE" ? "Highest Profit First (Balanced Mode)" : "Highest Profit First (Fast Mode)";
    document.getElementById('benchComps').textContent = algo === "MERGE" ? msComparisons : qsComparisons;
    document.getElementById('benchSwaps').textContent = algo === "MERGE" ? `${msMerges} merges` : `${qsSwaps} swaps`;
    document.getElementById('benchTime').textContent = `${execTime} ms`;

    // Only scroll into view when explicitly triggered by farmer user action
    if (isUserAction) {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ==========================================
// 8. REAL GEOGRAPHIC MAP OF INDIA (LEAFLET.JS)
// ==========================================

let leafletMap = null;
let currentTileLayer = null;
let currentTileKey = 'voyager';
let highwayLayerGroup = null;
let markersLayerGroup = null;
let activeRoutePolyline = null;
let activeRouteGlowPolyline = null;
let mapMarkerElements = new Map();

const TILE_PROVIDERS = {
    // 1. Streets (OpenStreetMap Humanitarian / HOT) - Completely free, no API key or watermarks
    voyager: {
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        maxZoom: 19,
        subdomains: 'abc',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    },
    // Alias for explicit 'streets' key
    streets: {
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        maxZoom: 19,
        subdomains: 'abc',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    },
    // Standard OpenStreetMap fallback option
    standardOsm: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        subdomains: 'abc',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
    },
    // 2. Night / Dark (Esri World Dark Gray Canvas) - Free public REST service, no API key, clean night styling
    dark: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 16,
        subdomains: '',
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
    },
    // 3. Satellite (Esri World Imagery) - Free public satellite tiles, high resolution, no API key
    satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 19,
        subdomains: '',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }
};

function initLeafletMap() {
    const mapEl = document.getElementById('indiaLeafletMap');
    if (!mapEl || leafletMap) return;

    // Center on India [21.5, 78.5], initial zoom 5
    leafletMap = L.map('indiaLeafletMap', {
        center: [21.5, 78.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 19,
        scrollWheelZoom: true,
        attributionControl: true
    });

    // Default base layer: OpenStreetMap Humanitarian (HOT)
    currentTileLayer = L.tileLayer(TILE_PROVIDERS.voyager.url, {
        attribution: TILE_PROVIDERS.voyager.attribution,
        maxZoom: TILE_PROVIDERS.voyager.maxZoom,
        subdomains: TILE_PROVIDERS.voyager.subdomains
    }).addTo(leafletMap);
    currentTileLayer.bringToBack();

    highwayLayerGroup = L.layerGroup().addTo(leafletMap);
    markersLayerGroup = L.layerGroup().addTo(leafletMap);

    // Draw all highway links & markers
    renderHighwayNetwork();
    renderMapMarkers();
    initMapMandiSearch();

    // Map click handler for picking farm location on map
    leafletMap.on('click', (e) => {
        if (!isMapPickingMode) return;
        const { lat, lng } = e.latlng;
        const nearest = findNearestRoadNodes(lat, lng, 1)[0];
        const placeName = nearest ? `near ${nearest.name} (${nearest.state || ''})` : `Farm (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
        setUserLocation(lat, lng, `📍 Your Location (${placeName})`, 'map');
        endMapPickMode();
        showToast(`Farm origin set to ${placeName}! Mandi routes updated.`, 'success');
    });

    // Invalidate size after layout settles
    setTimeout(() => {
        if (leafletMap) leafletMap.invalidateSize();
    }, 250);
}

function switchMapLayer(key) {
    const targetKey = (key === 'streets') ? 'voyager' : key;
    if (!leafletMap || !TILE_PROVIDERS[targetKey] || currentTileKey === targetKey) return;

    if (currentTileLayer) {
        leafletMap.removeLayer(currentTileLayer);
    }

    const provider = TILE_PROVIDERS[targetKey];
    currentTileLayer = L.tileLayer(provider.url, {
        attribution: provider.attribution,
        maxZoom: provider.maxZoom || 19,
        subdomains: provider.subdomains || 'abc'
    }).addTo(leafletMap);

    // Guarantee the base layer stays beneath highway network, markers, and Dijkstra route polylines
    currentTileLayer.bringToBack();

    currentTileKey = targetKey;

    // Update button states
    const btnVoyager = document.getElementById('btnLayerVoyager');
    const btnDark = document.getElementById('btnLayerDark');
    const btnSatellite = document.getElementById('btnLayerSatellite');

    if (btnVoyager) btnVoyager.classList.toggle('active', targetKey === 'voyager');
    if (btnDark) btnDark.classList.toggle('active', targetKey === 'dark');
    if (btnSatellite) btnSatellite.classList.toggle('active', targetKey === 'satellite');
}

function focusMapView(mode) {
    if (!leafletMap) return;

    document.querySelectorAll('.map-toggle-btn').forEach(b => b.classList.remove('active'));

    if (mode === 'india') {
        const btn = document.getElementById('btnViewAllIndia');
        if (btn) btn.classList.add('active');
        leafletMap.flyTo([22.5, 78.9], 5, { duration: 1.2 });
    } else if (mode === 'maharashtra') {
        const btn = document.getElementById('btnViewMaharashtra');
        if (btn) btn.classList.add('active');
        leafletMap.flyTo([19.2, 75.0], 7, { duration: 1.2 });
    } else if (mode === 'route') {
        const btn = document.getElementById('btnFocusRoute');
        if (btn) btn.classList.add('active');
        if (activeRoutePolyline) {
            leafletMap.fitBounds(activeRoutePolyline.getBounds(), { padding: [50, 50], maxZoom: 11 });
        }
    }
}

function renderHighwayNetwork() {
    if (!highwayLayerGroup) return;
    highwayLayerGroup.clearLayers();

    const drawnRoads = new Set();

    for (const [uName, edges] of roadGraph.adjList.entries()) {
        const uCoords = getNodeCoords(uName);
        if (!uCoords) continue;

        for (const edge of edges) {
            const vName = edge.dest;
            const vCoords = getNodeCoords(vName);
            if (!vCoords) continue;

            const key = [uName, vName].sort().join('--');
            if (drawnRoads.has(key)) continue;
            drawnRoads.add(key);

            const isNational = edge.roadType.startsWith("NH") || edge.roadType.includes("Expressway") || edge.roadType.includes("Road");
            const polyline = L.polyline(
                [[uCoords.lat, uCoords.lng], [vCoords.lat, vCoords.lng]],
                {
                    color: isNational ? '#475569' : '#64748b',
                    weight: isNational ? 2.5 : 1.8,
                    opacity: 0.65,
                    dashArray: isNational ? null : '4, 4'
                }
            );
            polyline.bindTooltip(`${uName} ↔ ${vName} (${edge.dist} km, ${edge.roadType})`, {
                sticky: true,
                className: 'highway-tooltip'
            });
            highwayLayerGroup.addLayer(polyline);
        }
    }
}

// ==========================================
// 8.1 REAL-TIME LIVE COMMODITY FEED & TICKER
// ==========================================

const CROP_DISPLAY_NAMES = {
    ONION: 'Onion',
    TOMATO: 'Tomato',
    POTATO: 'Potato',
    SOYBEAN: 'Soybean',
    WHEAT: 'Wheat',
    COTTON: 'Cotton'
};

// Store trend data: key = `${mandiName}_${cropKey}`, value = { delta: number, trendClass: 'up'|'down'|'flat', trendText: string }
const livePriceTrends = new Map();

function getMandiCropTrend(mandiName, cropKey) {
    const key = `${mandiName}_${cropKey}`;
    return livePriceTrends.get(key) || { trendClass: 'flat', trendText: '●' };
}

let liveFeedIntervalId = null;

function initLiveMarketFeed() {
    // Generate initial live ticker track
    updateLiveTickerUI();

    // Set recurring timer to simulate live APMC auction bidding ticks every 3.5 seconds
    if (liveFeedIntervalId) clearInterval(liveFeedIntervalId);
    liveFeedIntervalId = setInterval(simulateLivePriceTicks, 3500);
}

function simulateLivePriceTicks() {
    const mandiKeys = Object.keys(MANDIS);
    if (!mandiKeys.length) return;

    // Pick 3 to 6 random mandis to fluctuate on this cycle
    const numToUpdate = Math.floor(Math.random() * 4) + 3;
    const shuffled = [...mandiKeys].sort(() => 0.5 - Math.random());
    const selectedMandis = shuffled.slice(0, numToUpdate);
    const cropKeys = Object.keys(CROPS);

    const updatedItems = [];

    for (const mId of selectedMandis) {
        const mandi = MANDIS[mId];
        if (!mandi || !mandi.prices) continue;

        // Choose 1 or 2 crops for this mandi
        const cKey = cropKeys[Math.floor(Math.random() * cropKeys.length)];
        const currentPrice = mandi.prices[cKey] || (CROPS[cKey] ? CROPS[cKey].basePrice : 2000);
        const base = CROPS[cKey] ? CROPS[cKey].basePrice : 2000;

        // Realistic APMC auction tick between -₹25 and +₹30 (in multiples of 5)
        const possibleDeltas = [-25, -20, -15, -10, -5, 5, 10, 15, 20, 25, 30];
        let delta = possibleDeltas[Math.floor(Math.random() * possibleDeltas.length)];

        // Prevent prices from diverging excessively from economic baseline (±25%)
        if (currentPrice + delta < base * 0.75) delta = Math.abs(delta);
        if (currentPrice + delta > base * 1.35) delta = -Math.abs(delta);

        const newPrice = Math.round(currentPrice + delta);
        mandi.prices[cKey] = newPrice;

        const trendKey = `${mandi.name}_${cKey}`;
        const trendClass = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
        const trendText = delta > 0 ? `▲+₹${delta}` : delta < 0 ? `▼-₹${Math.abs(delta)}` : '●';

        livePriceTrends.set(trendKey, { delta, trendClass, trendText });
        updatedItems.push({ mandiName: mandi.name, cropKey: cKey, price: newPrice, delta, trendClass, trendText });
    }

    // 1. Dynamically update open Leaflet map popup if open
    updateActiveMapPopupPrices();

    // 2. Update live ticker track in header
    updateLiveTickerUI(updatedItems);

    // 3. Keep profit calculation results synchronized silently
    if (typeof calculateNetProfits === 'function') {
        calculateNetProfits({ isInitial: true });
    }

    // 4. Update sync timestamp
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const lastUpdateEl = document.getElementById('tickerLastUpdate');
    if (lastUpdateEl) {
        lastUpdateEl.textContent = `Sync: ${timeStr}`;
    }
}

function updateActiveMapPopupPrices() {
    const activePopupCard = document.querySelector('.leaflet-popup-content .popup-mandi-card');
    if (!activePopupCard) return;

    const mandiName = activePopupCard.getAttribute('data-mandi-name');
    if (!mandiName) return;

    const mandi = Object.values(MANDIS).find(m => m.name === mandiName);
    if (!mandi || !mandi.prices) return;

    for (const [cKey, price] of Object.entries(mandi.prices)) {
        const rateEl = document.getElementById(`popup-rate-${safeId(mandiName)}-${cKey}`);
        const trendEl = document.getElementById(`popup-trend-${safeId(mandiName)}-${cKey}`);
        const itemEl = document.getElementById(`popup-item-${safeId(mandiName)}-${cKey}`);

        if (rateEl) {
            const formatted = `₹${price.toLocaleString('en-IN')}`;
            if (rateEl.textContent !== formatted) {
                rateEl.textContent = formatted;
                if (itemEl) {
                    itemEl.classList.remove('just-updated');
                    void itemEl.offsetWidth; // trigger reflow
                    itemEl.classList.add('just-updated');
                }
            }
        }

        if (trendEl) {
            const trend = getMandiCropTrend(mandiName, cKey);
            const hasDelta = Boolean(trend && trend.trendClass && trend.trendClass !== 'flat');
            trendEl.className = `trend-badge ${trend.trendClass} ${hasDelta ? '' : 'hidden'}`;
            trendEl.textContent = hasDelta ? trend.trendText : '';
        }
    }
}

const NATIONAL_TICKER_ITEMS = [
    { mandiId: 'MND_LAS', cropKey: 'ONION' },     // Lasalgaon APMC (Nashik, Maharashtra) - Onion Capital
    { mandiId: 'MND_SOP', cropKey: 'ONION' },     // Sopore Fruit Mandi (Baramulla, J&K) - Apple & Perishables
    { mandiId: 'MND_KHA', cropKey: 'WHEAT' },     // Khanna APMC (Ludhiana, Punjab) - Asia's Largest Grain Terminal
    { mandiId: 'MND_IND', cropKey: 'SOYBEAN' },   // Indore APMC (Indore, Madhya Pradesh) - Soybean Capital
    { mandiId: 'MND_SOL_HP', cropKey: 'TOMATO' }, // Solan APMC (Solan, Himachal Pradesh) - Off-Season Tomato Terminal
    { mandiId: 'MND_WAR', cropKey: 'COTTON' },    // Warangal APMC (Warangal, Telangana) - Cotton Terminal
    { mandiId: 'MND_KAN', cropKey: 'POTATO' },    // Kanpur APMC (Kanpur Nagar, Uttar Pradesh) - Potato & Grain
    { mandiId: 'MND_GUN', cropKey: 'TOMATO' },    // Guntur APMC (Guntur, Andhra Pradesh) - Chilli & Spices
    { mandiId: 'MND_DEL', cropKey: 'ONION' },     // Azadpur APMC (Delhi NCR) - National Terminal
    { mandiId: 'MND_GON', cropKey: 'SOYBEAN' },   // Gondal APMC (Rajkot, Gujarat) - Groundnut & Oilseed Exchange
    { mandiId: 'MND_KARN', cropKey: 'WHEAT' },    // Karnal APMC (Karnal, Haryana) - Basmati Granary
    { mandiId: 'MND_CHE', cropKey: 'TOMATO' },    // Koyambedu APMC (Chennai, Tamil Nadu) - South Terminal
    { mandiId: 'MND_BLR', cropKey: 'POTATO' },    // Yeshwanthpur APMC (Bengaluru, Karnataka) - Perishable Hub
    { mandiId: 'MND_KOLK', cropKey: 'WHEAT' },    // Koley Market APMC (Kolkata, West Bengal) - Eastern Terminal
    { mandiId: 'MND_SHI', cropKey: 'POTATO' },    // Shimla APMC (Shimla, Himachal Pradesh) - Hill Produce Exchange
    { mandiId: 'MND_KOC', cropKey: 'SOYBEAN' }    // Aluva APMC (Kochi, Kerala) - Spices & Plantation Gateway
];

function updateLiveTickerUI(recentlyUpdated = []) {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    const recentlySet = new Set(recentlyUpdated.map(u => `${u.mandiName}_${u.cropKey}`));

    let singleItemsHtml = '';
    for (const item of NATIONAL_TICKER_ITEMS) {
        const m = MANDIS[item.mandiId];
        if (!m || !m.prices) continue;

        const cKey = item.cropKey;
        const price = m.prices[cKey];
        if (!price) continue;

        const c = CROPS[cKey];
        const cName = CROP_DISPLAY_NAMES[cKey] || cKey;
        const trend = getMandiCropTrend(m.name, cKey);
        const isJustTicked = recentlySet.has(`${m.name}_${cKey}`);

        singleItemsHtml += `
            <div class="ticker-item ${isJustTicked ? 'ticking' : ''}" onclick="focusMandiOnMap('${m.name}')" title="Click to focus ${m.name} on GIS Map">
                <span class="ticker-crop-ico">${c ? c.icon : '🌱'}</span>
                <span class="ticker-crop-lbl">${cName}</span>
                <span class="ticker-mandi">(${m.district}, ${m.state})</span>
                <span class="ticker-rate">₹${price.toLocaleString('en-IN')}/qtl</span>
                <span class="ticker-trend ${trend.trendClass}">${trend.trendText}</span>
            </div>
        `;
    }

    // Duplicate track so infinite marquee animation loops seamlessly with zero gap
    track.innerHTML = singleItemsHtml + singleItemsHtml;
}

function getMandiPopupContent(m) {
    const isNational = Boolean(m.isNationalHub);
    const coordStr = `${m.lat.toFixed(4)}° N, ${m.lng.toFixed(4)}° E`;
    const cessPct = (m.cess * 100).toFixed(1);

    // Compute live distance from current origin village
    const villageSelect = document.getElementById('villageSelect');
    const currentVillage = villageSelect ? villageSelect.value : (VILLAGES[0] ? VILLAGES[0].name : "Junnar");
    let distBadge = '';

    if (currentVillage && roadGraph && typeof roadGraph.computeShortestPaths === 'function') {
        const cachedPaths = dijkstraCache.has(currentVillage)
            ? dijkstraCache.get(currentVillage)
            : roadGraph.computeShortestPaths(currentVillage);

        if (cachedPaths && cachedPaths[m.name]) {
            const dKm = cachedPaths[m.name].distance.toFixed(0);
            const estHours = (cachedPaths[m.name].distance / 45).toFixed(1);
            distBadge = `
                <div class="popup-info-pill">
                    <span class="pill-icon">🛣️</span>
                    <span><strong>${dKm} km</strong> from ${currentVillage} (~${estHours} hrs via Highway)</span>
                </div>
            `;
        }
    }

    const priceItemsHtml = Object.entries(m.prices)
        .map(([cKey, price]) => {
            const c = CROPS[cKey];
            const cName = CROP_DISPLAY_NAMES[cKey] || (c ? c.name : cKey);
            const trend = getMandiCropTrend(m.name, cKey);
            const hasDelta = Boolean(trend && trend.trendClass && trend.trendClass !== 'flat');
            return `
                <div class="popup-price-item" id="popup-item-${safeId(m.name)}-${cKey}">
                    <span class="crop-lbl">
                        <span class="crop-ico">${c ? c.icon : '🌱'}</span>
                        <span class="crop-title" title="${cName}">${cName}</span>
                    </span>
                    <div class="crop-rate-group">
                        <span class="crop-val" id="popup-rate-${safeId(m.name)}-${cKey}">₹${price.toLocaleString('en-IN')}</span>
                        <span class="crop-unit">/qtl</span>
                        <span class="trend-badge ${trend.trendClass} ${hasDelta ? '' : 'hidden'}" id="popup-trend-${safeId(m.name)}-${cKey}">${hasDelta ? trend.trendText : ''}</span>
                    </div>
                </div>
            `;
        }).join('');

    return `
        <div class="popup-mandi-card" data-mandi-name="${m.name}">
            <div class="popup-header ${isNational ? 'is-national' : ''}">
                <div class="popup-badge-row">
                    <span class="popup-tag ${isNational ? 'tag-national' : 'tag-state'}">
                        ${isNational ? '⭐ National APMC Hub' : '📍 State APMC Mandi'}
                    </span>
                    <span class="popup-state-pill">${m.state}</span>
                </div>
                <h4 class="popup-title">${m.name}</h4>
                <p class="popup-location">
                    <span>📌 ${m.district}, ${m.state}</span>
                    <span class="geo-coords">(${coordStr})</span>
                </p>
                <p class="popup-tagline">"${m.tagline}"</p>
            </div>

            <div class="popup-metrics-grid">
                <div class="popup-metric">
                    <span class="metric-label">APMC Market Cess</span>
                    <span class="metric-value">${cessPct}%</span>
                </div>
                <div class="popup-metric">
                    <span class="metric-label">Market Tier</span>
                    <span class="metric-value">${isNational ? 'Tier-1 Terminal' : 'Regional APMC'}</span>
                </div>
            </div>

            ${distBadge}

            <div class="popup-prices-wrap">
                <div class="popup-section-header">
                    <span class="popup-section-label">Live Commodity Auction Rates</span>
                    <span class="popup-live-pill"><span class="live-dot"></span> LIVE</span>
                </div>
                <div class="popup-price-list">
                    ${priceItemsHtml}
                </div>
            </div>

            <div class="popup-actions">
                <button type="button" class="popup-action-btn primary" onclick="selectDestinationMandi('${m.name}')">
                    🎯 Select as Target Mandi & Trace Route
                </button>
            </div>
        </div>
    `;
}

function getVillagePopupContent(v) {
    const coordStr = `${v.lat.toFixed(4)}° N, ${v.lng.toFixed(4)}° E`;
    const profile = v.specialty || `${v.district} District Agri Cluster · Fresh Produce Origin`;

    // Calculate nearest APMC Wholesale market from road graph
    let nearestMandiInfo = '';
    if (roadGraph && typeof roadGraph.computeShortestPaths === 'function') {
        const paths = roadGraph.computeShortestPaths(v.name);
        let nearest = null;
        let minDist = Infinity;
        for (const [mName, pObj] of Object.entries(paths)) {
            if (mName !== v.name && MANDIS[mName] && pObj.distance < minDist) {
                minDist = pObj.distance;
                nearest = mName;
            } else if (mName !== v.name && pObj.distance < minDist && !VILLAGES.some(vg => vg.name === mName)) {
                minDist = pObj.distance;
                nearest = mName;
            }
        }
        if (nearest && minDist < 9999) {
            nearestMandiInfo = `
                <div class="popup-info-pill village-feeder">
                    <span class="pill-icon">🚚</span>
                    <span>Primary Feeder Mandi: <strong>${nearest}</strong> (${minDist.toFixed(0)} km)</span>
                </div>
            `;
        }
    }

    return `
        <div class="popup-mandi-card village-card">
            <div class="popup-header is-village">
                <div class="popup-badge-row">
                    <span class="popup-tag tag-village">🏡 Farmer Origin Village</span>
                    <span class="popup-state-pill">${v.state}</span>
                </div>
                <h4 class="popup-title">${v.name}</h4>
                <p class="popup-location">
                    <span>🌾 ${v.district} District, ${v.state}</span>
                    <span class="geo-coords">(${coordStr})</span>
                </p>
            </div>

            <div class="popup-village-desc">
                <div class="popup-section-label">Agricultural Area Profile</div>
                <p class="village-profile-text">${profile}</p>
            </div>

            ${nearestMandiInfo}

            <div class="popup-actions">
                <button type="button" class="popup-action-btn success" onclick="selectOriginVillage('${v.name}')">
                    📍 Set as My Source Village
                </button>
            </div>
        </div>
    `;
}

function renderMapMarkers() {
    if (!markersLayerGroup) return;
    markersLayerGroup.clearLayers();
    mapMarkerElements.clear();

    // 1. APMC Wholesale Mandis - Minimalist solid dot pins (Zero glow)
    for (const [mId, m] of Object.entries(MANDIS)) {
        const isNational = Boolean(m.isNationalHub);
        const iconHtml = `
            <div class="kisan-custom-marker mandi-marker ${isNational ? 'national-hub' : ''}" id="marker-${safeId(m.name)}" title="${m.name}">
                <div class="marker-pin-dot">
                    <span class="marker-inner-core"></span>
                </div>
            </div>
        `;

        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'minimal-marker-wrapper',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -14]
        });

        const marker = L.marker([m.lat, m.lng], { icon: customIcon });

        // Sleek minimalist hover tooltip
        marker.bindTooltip(`${isNational ? '⭐ ' : '🏛️ '}${m.name} (${m.district}, ${m.state})`, {
            direction: 'top',
            offset: [0, -10],
            className: 'minimal-map-tooltip'
        });

        // Dynamic popup generator function on click
        marker.bindPopup(() => getMandiPopupContent(m), {
            maxWidth: 420,
            minWidth: 380,
            className: 'kisan-gis-popup'
        });
        markersLayerGroup.addLayer(marker);
        mapMarkerElements.set(m.name, marker);
    }

    // 2. Rural Farmer Villages - Minimalist sapphire micro-dot pins
    for (const v of VILLAGES) {
        const iconHtml = `
            <div class="kisan-custom-marker village-marker" id="marker-${safeId(v.name)}" title="${v.name}">
                <div class="marker-pin-dot">
                    <span class="marker-inner-core"></span>
                </div>
            </div>
        `;

        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'minimal-marker-wrapper',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -12]
        });

        const marker = L.marker([v.lat, v.lng], { icon: customIcon });

        // Sleek hover tooltip showing village and district/state
        marker.bindTooltip(`🏡 ${v.name} (${v.district}, ${v.state})`, {
            direction: 'top',
            offset: [0, -8],
            className: 'minimal-map-tooltip'
        });

        // Dynamic popup generator function on click
        marker.bindPopup(() => getVillagePopupContent(v), {
            maxWidth: 400,
            minWidth: 350,
            className: 'kisan-gis-popup'
        });
        markersLayerGroup.addLayer(marker);
        mapMarkerElements.set(v.name, marker);
    }

    // 3. User Farm Location Pin (if active)
    if (currentUserLocation && currentUserLocation.lat && currentUserLocation.lng) {
        updateUserLocationMarkerOnMap(currentUserLocation.lat, currentUserLocation.lng, currentUserLocation.displayName);
    }
}

function selectOriginVillage(villageName) {
    const v = VILLAGES.find(item => item.name === villageName);
    if (v) {
        setUserLocation(v.lat, v.lng, `${v.name} (${v.district}, ${v.state})`, 'village');
    } else {
        const villageSelect = document.getElementById('villageSelect');
        if (villageSelect) {
            villageSelect.value = villageName;
            calculateNetProfits({ isUserAction: true });
        }
        const originDisp = document.getElementById('mapOriginDisplay');
        if (originDisp) {
            originDisp.innerHTML = `Origin: <strong>${villageName}</strong>`;
        }
    }
    showToast(`Origin set to ${villageName}!`, 'info');
    if (leafletMap) leafletMap.closePopup();
}

function selectDestinationMandi(mandiName) {
    const matching = lastRankedResults.find(r => r.mandi.name === mandiName);
    if (matching) {
        highlightPathOnMap(matching.routePath, { shouldFitBounds: true });
    } else {
        calculateNetProfits({ isInitial: true });
        const found = lastRankedResults.find(r => r.mandi.name === mandiName);
        if (found) {
            highlightPathOnMap(found.routePath, { shouldFitBounds: true });
        } else {
            const villageSelect = document.getElementById('villageSelect');
            const originVillage = villageSelect ? villageSelect.value : (VILLAGES[0] ? VILLAGES[0].name : "Junnar");
            const paths = roadGraph.computeShortestPaths(originVillage);
            if (paths && paths[mandiName]) {
                highlightPathOnMap(paths[mandiName].path, { shouldFitBounds: true });
            }
        }
    }
    const destDisp = document.getElementById('mapDestDisplay');
    if (destDisp) {
        destDisp.innerHTML = `Target Mandi: <strong>${mandiName}</strong>`;
    }
    if (leafletMap) leafletMap.closePopup();
}

function initMapMandiSearch() {
    const input = document.getElementById('mapMandiSearchInput');
    const clearBtn = document.getElementById('btnClearMapSearch');
    if (!input) return;

    function applyFilter(query, shouldFly = false) {
        const q = (query || '').trim().toLowerCase();

        if (!q) {
            if (clearBtn) clearBtn.classList.add('hidden');
            for (const m of Object.values(MANDIS)) {
                const el = document.getElementById('marker-' + safeId(m.name));
                if (el) el.classList.remove('search-dimmed', 'search-highlighted');
            }
            for (const v of VILLAGES) {
                const el = document.getElementById('marker-' + safeId(v.name));
                if (el) el.classList.remove('search-dimmed', 'search-highlighted');
            }
            return;
        }

        if (clearBtn) clearBtn.classList.remove('hidden');

        let matchedMandis = [];
        for (const m of Object.values(MANDIS)) {
            const matches = m.name.toLowerCase().includes(q) ||
                (m.district && m.district.toLowerCase().includes(q)) ||
                (m.state && m.state.toLowerCase().includes(q)) ||
                (m.tagline && m.tagline.toLowerCase().includes(q));

            const el = document.getElementById('marker-' + safeId(m.name));
            if (matches) {
                matchedMandis.push(m);
                if (el) {
                    el.classList.add('search-highlighted');
                    el.classList.remove('search-dimmed');
                }
            } else {
                if (el) {
                    el.classList.remove('search-highlighted');
                    el.classList.add('search-dimmed');
                }
            }
        }

        for (const v of VILLAGES) {
            const matches = v.name.toLowerCase().includes(q) ||
                (v.district && v.district.toLowerCase().includes(q)) ||
                (v.state && v.state.toLowerCase().includes(q));

            const el = document.getElementById('marker-' + safeId(v.name));
            if (matches) {
                if (el) {
                    el.classList.add('search-highlighted');
                    el.classList.remove('search-dimmed');
                }
            } else {
                if (el) {
                    el.classList.remove('search-highlighted');
                    el.classList.add('search-dimmed');
                }
            }
        }

        if (shouldFly && matchedMandis.length > 0 && leafletMap) {
            const target = matchedMandis[0];
            leafletMap.flyTo([target.lat, target.lng], 9, { duration: 1.2 });
            const marker = mapMarkerElements.get(target.name);
            if (marker) {
                setTimeout(() => marker.openPopup(), 1200);
            }
        } else if (matchedMandis.length === 1 && leafletMap) {
            const target = matchedMandis[0];
            const marker = mapMarkerElements.get(target.name);
            if (marker && !marker.isPopupOpen()) {
                leafletMap.flyTo([target.lat, target.lng], 8, { duration: 0.8 });
            }
        }
    }

    input.addEventListener('input', (e) => {
        applyFilter(e.target.value, false);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyFilter(input.value, true);
        } else if (e.key === 'Escape') {
            input.value = '';
            applyFilter('', false);
            input.blur();
        }
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            applyFilter('', false);
            input.focus();
        });
    }
}

function getNodeCoords(name) {
    if (currentUserLocation && (name === currentUserLocation.nodeName || name === "Your Farm Location" || (typeof name === 'string' && name.startsWith("Your Farm Location")) || name === currentUserLocation.displayName)) {
        return { lat: currentUserLocation.lat, lng: currentUserLocation.lng };
    }
    for (const m of Object.values(MANDIS)) {
        if (m.name === name) return { lat: m.lat, lng: m.lng };
    }
    for (const v of VILLAGES) {
        if (v.name === name) return { lat: v.lat, lng: v.lng };
    }
    return MAJOR_INDIAN_JUNCTIONS[name] || null;
}

function safeId(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '_');
}

function highlightPathOnMap(pathNodes, { shouldFitBounds = false } = {}) {
    if (!leafletMap || !pathNodes || pathNodes.length < 2) return;

    if (activeRoutePolyline) {
        leafletMap.removeLayer(activeRoutePolyline);
        activeRoutePolyline = null;
    }
    if (activeRouteGlowPolyline) {
        leafletMap.removeLayer(activeRouteGlowPolyline);
        activeRouteGlowPolyline = null;
    }

    document.querySelectorAll('.kisan-custom-marker.is-origin').forEach(el => el.classList.remove('is-origin'));
    document.querySelectorAll('.kisan-custom-marker.is-target').forEach(el => el.classList.remove('is-target'));

    const originName = pathNodes[0];
    const destName = pathNodes[pathNodes.length - 1];

    const originEl = document.getElementById(`marker-${safeId(originName)}`);
    if (originEl) originEl.classList.add('is-origin');

    const destEl = document.getElementById(`marker-${safeId(destName)}`);
    if (destEl) destEl.classList.add('is-target');

    const latLngs = [];
    for (const nodeName of pathNodes) {
        const coords = getNodeCoords(nodeName);
        if (coords) {
            latLngs.push([coords.lat, coords.lng]);
        }
    }

    if (latLngs.length < 2) return;

    // Crisp, minimalist shortest route line (zero glow)
    activeRoutePolyline = L.polyline(latLngs, {
        color: '#059669',
        weight: 3.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(leafletMap);

    let totalDistKm = 0;
    const paths = roadGraph.computeShortestPaths(originName);
    if (paths && paths[destName]) {
        totalDistKm = paths[destName].distance;
    }

    const originDisp = document.getElementById('mapOriginDisplay');
    const destDisp = document.getElementById('mapDestDisplay');
    const metaDisp = document.getElementById('mapRouteMetaDisplay');

    const originDispName = getOriginDisplayName(originName);
    if (originDisp) originDisp.innerHTML = `Origin: <strong>${originDispName}</strong>`;
    if (destDisp) destDisp.innerHTML = `Target Mandi: <strong>${destName}</strong>`;
    if (metaDisp) metaDisp.innerHTML = `Shortest Route: <strong>${totalDistKm.toFixed(1)} km</strong> (📍 Your Location → ${pathNodes.slice(1).join(' → ')})`;

    // ONLY zoom/fit bounds if explicitly requested by farmer user action (e.g. clicking 'Fit Route' or selecting a specific mandi)
    // NEVER zoom automatically during background updates, pan/zoom exploration, or silent live ticks!
    if (shouldFitBounds && activeRoutePolyline) {
        leafletMap.fitBounds(activeRoutePolyline.getBounds(), {
            padding: [60, 60],
            maxZoom: 11
        });
    }
}

// ==========================================
// 9. KNAPSACK TRUCK LOAD CONTROLLER
// ==========================================

let SAMPLE_LOTS = [
    { id: "LOT-01", crop: "Grade-A Red Onion", cropKey: "ONION", weight: 20, profit: 36000, target: "Azadpur APMC (Delhi)" },
    { id: "LOT-02", crop: "Yellow Oilseed Soybean", cropKey: "SOYBEAN", weight: 30, profit: 72000, target: "Azadpur APMC (Delhi)" },
    { id: "LOT-03", crop: "Hybrid Table Tomato", cropKey: "TOMATO", weight: 15, profit: 22500, target: "Azadpur APMC (Delhi)" },
    { id: "LOT-04", crop: "Sharbati Golden Wheat", cropKey: "WHEAT", weight: 40, profit: 58000, target: "Azadpur APMC (Delhi)" },
    { id: "LOT-05", crop: "Long Staple Cotton", cropKey: "COTTON", weight: 25, profit: 95000, target: "Azadpur APMC (Delhi)" },
    { id: "LOT-06", crop: "Jyoti Cold-Store Potato", cropKey: "POTATO", weight: 18, profit: 21000, target: "Azadpur APMC (Delhi)" }
];

let activeKnapsackMandiId = "MND_DEL";

function connectBestToKnapsack(mandiId) {
    const mandi = MANDIS[mandiId] || Object.values(MANDIS).find(m => m.name === mandiId || m.id === mandiId);
    if (!mandi) return;

    activeKnapsackMandiId = mandi.id;

    const knapTargetName = document.getElementById('knapTargetMandiName');
    const knapTargetDist = document.getElementById('knapTargetMandiDist');
    const knapSelect = document.getElementById('knapMandiSelect');

    if (knapTargetName) knapTargetName.textContent = mandi.name;
    if (knapSelect) knapSelect.value = mandi.id;

    // Calculate distance from currently selected origin village
    const village = document.getElementById('villageSelect') ? document.getElementById('villageSelect').value : "Junnar";
    if (dijkstraCache && dijkstraCache.has(village)) {
        const paths = dijkstraCache.get(village);
        if (paths && paths[mandi.name] && knapTargetDist) {
            knapTargetDist.textContent = `${paths[mandi.name].distance.toFixed(0)} km`;
        }
    }

    refreshKnapsackLotsForMandi(mandi);
    runKnapsackOptimization();

    const knapSection = document.getElementById('knapsackSection');
    if (knapSection) {
        knapSection.scrollIntoView({ behavior: 'smooth' });
        const card = document.getElementById('knapsackCard');
        if (card) {
            card.classList.remove('card-connect-flash');
            void card.offsetWidth;
            card.classList.add('card-connect-flash');
        }
    }
}

function onKnapsackMandiChange(mandiId) {
    const mandi = MANDIS[mandiId];
    if (!mandi) return;
    connectBestToKnapsack(mandiId);
}

function refreshKnapsackLotsForMandi(mandi) {
    SAMPLE_LOTS = [
        { id: "LOT-01", crop: "Grade-A Red Onion", cropKey: "ONION", weight: 20, profit: Math.round(20 * (mandi.prices.ONION || 2800) * 0.42), target: mandi.name },
        { id: "LOT-02", crop: "Yellow Oilseed Soybean", cropKey: "SOYBEAN", weight: 30, profit: Math.round(30 * (mandi.prices.SOYBEAN || 4900) * 0.40), target: mandi.name },
        { id: "LOT-03", crop: "Hybrid Table Tomato", cropKey: "TOMATO", weight: 15, profit: Math.round(15 * (mandi.prices.TOMATO || 2200) * 0.45), target: mandi.name },
        { id: "LOT-04", crop: "Sharbati Golden Wheat", cropKey: "WHEAT", weight: 40, profit: Math.round(40 * (mandi.prices.WHEAT || 2500) * 0.38), target: mandi.name },
        { id: "LOT-05", crop: "Long Staple Cotton", cropKey: "COTTON", weight: 25, profit: Math.round(25 * (mandi.prices.COTTON || 7200) * 0.39), target: mandi.name },
        { id: "LOT-06", crop: "Jyoti Cold-Store Potato", cropKey: "POTATO", weight: 18, profit: Math.round(18 * (mandi.prices.POTATO || 1800) * 0.44), target: mandi.name }
    ];
}

function connectBestToMap(mandiName) {
    const mapSection = document.getElementById('mapSection');
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (lastRankedResults && lastRankedResults.length > 0) {
        const item = lastRankedResults.find(r => r.mandi.name === mandiName);
        if (item) {
            highlightPathOnMap(item.routePath, { shouldFitBounds: true });
        }
    }

    setTimeout(() => {
        focusMandiOnMap(mandiName);
    }, 450);
}

function focusMandiOnMap(mandiName) {
    const mapSection = document.getElementById('mapSection');
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
        const marker = mapMarkerElements.get(mandiName);
        if (marker && leafletMap) {
            leafletMap.flyTo(marker.getLatLng(), 8, { duration: 1.0 });
            setTimeout(() => {
                marker.openPopup();
            }, 800);
        }
    }, 400);
}

function dispatchTruckToMap() {
    const targetNameEl = document.getElementById('knapTargetMandiName');
    const targetName = targetNameEl ? targetNameEl.textContent : null;
    if (targetName) {
        connectBestToMap(targetName);
    } else {
        document.getElementById('mapSection').scrollIntoView({ behavior: 'smooth' });
    }
}

function initKnapsackMandiSelect() {
    const select = document.getElementById('knapMandiSelect');
    if (!select) return;

    select.innerHTML = '';
    const nationalHubs = Object.values(MANDIS).filter(m => m.isNationalHub);
    const otherMandis = Object.values(MANDIS).filter(m => !m.isNationalHub);

    const grp1 = document.createElement('optgroup');
    grp1.label = '⭐ National APMC Hubs';
    nationalHubs.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.name} (${m.state})`;
        grp1.appendChild(opt);
    });
    select.appendChild(grp1);

    const grp2 = document.createElement('optgroup');
    grp2.label = '📍 Regional State APMCs';
    otherMandis.slice(0, 30).forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.name} (${m.state})`;
        grp2.appendChild(opt);
    });
    select.appendChild(grp2);

    select.value = 'MND_DEL';
}

function runKnapsackOptimization() {
    const capacity = parseInt(document.getElementById('truckCapacityInput').value) || 50;
    const res = solve01Knapsack(SAMPLE_LOTS, capacity);

    document.getElementById('knapCapacityDisplay').textContent = `${res.capacity} qtl`;
    document.getElementById('knapLoadedDisplay').textContent = `${res.totalWeight} qtl`;
    document.getElementById('knapRemainingDisplay').textContent = `${res.remainingCapacity} qtl`;
    document.getElementById('knapProfitDisplay').textContent = `₹${res.maxProfit.toLocaleString('en-IN')}`;

    const countBadge = document.getElementById('knapLotsCountBadge');
    if (countBadge) {
        countBadge.textContent = `${res.selectedLots.length} Lots Loaded (${res.totalWeight} qtl)`;
    }

    // Progress bar
    const pct = Math.min(100, (res.totalWeight / res.capacity) * 100);
    const pBar = document.getElementById('knapProgressBar');
    if (pBar) {
        pBar.style.width = `${pct}%`;
        pBar.textContent = `${pct.toFixed(0)}% (${res.totalWeight}/${res.capacity} qtl)`;
    }

    // Render lots
    const lotsContainer = document.getElementById('knapsackLotsList');
    lotsContainer.innerHTML = '';

    res.selectedLots.forEach(lot => {
        const card = document.createElement('div');
        card.className = 'selected-lot-card';
        card.innerHTML = `
            <div class="lot-check">✓ LOADED</div>
            <div class="lot-body">
                <strong>${lot.crop}</strong> (${lot.id})
                <div class="text-xs text-muted">Weight: ${lot.weight} qtl • Net Profit: ₹${lot.profit.toLocaleString('en-IN')}</div>
                <div class="text-xs">Destination: <strong>${lot.target}</strong></div>
            </div>
        `;
        lotsContainer.appendChild(card);
    });
}

// ==========================================
// 10. BST PRICE SEARCH CONTROLLER
// ==========================================

function runBSTPriceSearch() {
    const cropId = document.getElementById('bstCropSelect').value;
    const minPrice = parseFloat(document.getElementById('bstMinPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('bstMaxPrice').value) || 10000;

    const bst = new PriceBST();
    const crop = CROPS[cropId];

    for (const mandi of Object.values(MANDIS)) {
        const price = mandi.prices[cropId];
        if (price) {
            bst.insert(mandi.name, `${mandi.district}, ${mandi.state}`, crop.name, price);
        }
    }

    const matchedNodes = bst.findRange(minPrice, maxPrice);
    const container = document.getElementById('bstResultsList');
    container.innerHTML = '';

    if (matchedNodes.length === 0) {
        container.innerHTML = `<div class="p-3 text-muted">No mandis found within price range ₹${minPrice} - ₹${maxPrice} for ${crop.name}.</div>`;
        return;
    }

    matchedNodes.forEach(node => {
        const card = document.createElement('div');
        card.className = 'bst-node-card';
        card.innerHTML = `
            <div class="bst-price">₹${node.price.toFixed(2)} / qtl</div>
            <div class="bst-mandi"><strong>${node.mandiName}</strong></div>
            <div class="text-xs text-muted">${node.district}</div>
        `;
        container.appendChild(card);
    });
}

// ==========================================
// 11. EXPORT TO CSV & PRINT
// ==========================================

function exportCSV() {
    if (!lastRankedResults || lastRankedResults.length === 0) {
        alert("Please calculate mandi profits first before exporting!");
        return;
    }

    let csv = "Rank,Mandi Name,District,Crop,Quantity (qtl),Distance (km),Price (INR/qtl),Gross Revenue (INR),Transport Cost (INR),APMC Cess (INR),Net Profit (INR),Route\n";

    lastRankedResults.forEach(r => {
        csv += `${r.rank},"${r.mandi.name}","${r.mandi.district}","${r.crop.name}",${r.quantity},${r.distanceKm.toFixed(1)},${r.pricePerQtl.toFixed(2)},${r.grossRevenue.toFixed(2)},${r.transportCost.toFixed(2)},${r.cessAmount.toFixed(2)},${r.netProfit.toFixed(2)},"${r.routePath.join(' -> ')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kisan_mandi_profit_report_${lastOriginVillage}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================================
// 12. GUIDED APP TOUR CONTROLLER
// ==========================================

const TOUR_STEPS = [
    { target: 'heroCard', fallback: 'heroSection', titleKey: 'tourWelcomeTitle', bodyKey: 'tourWelcomeBody' },
    { target: 'calcCard', fallback: 'cropCalculatorSection', titleKey: 'tourCalcTitle', bodyKey: 'tourCalcBody' },
    { target: 'bestMandiHero', fallback: 'exportSection', titleKey: 'tourRankTitle', bodyKey: 'tourRankBody' },
    { target: 'knapsackCard', fallback: 'knapsackSection', titleKey: 'tourKnapsackTitle', bodyKey: 'tourKnapsackBody' },
    { target: 'bstCard', fallback: 'bstSection', titleKey: 'tourBSTTitle', bodyKey: 'tourBSTBody' },
    { target: 'mapCard', fallback: 'graphVisualizerSection', titleKey: 'tourMapTitle', bodyKey: 'tourMapBody' },
    { target: 'exportSection', fallback: 'bestMandiHero', titleKey: 'tourExportTitle', bodyKey: 'tourExportBody' }
];

let currentTourIndex = 0;

function startTour() {
    currentTourIndex = 0;
    const overlay = document.getElementById('tourOverlay');
    overlay.classList.remove('hidden');
    renderTourStep();
}

let tourRafId = null;

function updateSpotlightPosition(targetEl, spotlight, tooltip) {
    if (!targetEl || !spotlight || !tooltip) return;

    const rect = targetEl.getBoundingClientRect();
    const pad = 6;

    // Exact framing around the target element with clean 6px padding
    const spotLeft = rect.left - pad;
    const spotTop = rect.top - pad;
    const spotWidth = rect.width + pad * 2;
    const spotHeight = rect.height + pad * 2;

    spotlight.style.top = `${Math.round(spotTop)}px`;
    spotlight.style.left = `${Math.round(spotLeft)}px`;
    spotlight.style.width = `${Math.round(spotWidth)}px`;
    spotlight.style.height = `${Math.round(spotHeight)}px`;

    // Tooltip positioning & geometry
    const tooltipW = Math.min(340, window.innerWidth - 32);
    tooltip.style.width = `${tooltipW}px`;
    const tooltipH = tooltip.offsetHeight || 195;

    let tooltipTop;
    // Prefer placing tooltip below the spotlight if there is space
    if (spotTop + spotHeight + tooltipH + 16 <= window.innerHeight) {
        tooltipTop = spotTop + spotHeight + 12;
    }
    // Else place tooltip above the spotlight
    else if (spotTop - tooltipH - 16 >= 0) {
        tooltipTop = spotTop - tooltipH - 12;
    }
    // Else for tall cards (like mapCard), dock neatly near bottom center inside viewport
    else {
        tooltipTop = Math.max(16, window.innerHeight - tooltipH - 24);
    }

    // Center tooltip horizontally relative to spotlight, clamped within viewport
    let tooltipLeft = spotLeft + (spotWidth - tooltipW) / 2;
    tooltipLeft = Math.max(16, Math.min(window.innerWidth - tooltipW - 16, tooltipLeft));

    tooltip.style.top = `${Math.round(tooltipTop)}px`;
    tooltip.style.left = `${Math.round(tooltipLeft)}px`;
}

function smoothScrollToTarget(targetEl) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const viewportH = window.innerHeight;

    let targetY;
    // If element fits with breathing room in viewport, center it vertically
    if (rect.height < viewportH - 60) {
        targetY = window.scrollY + rect.top - (viewportH - rect.height) / 2;
    } else {
        // If element is tall (like mapCard), align comfortably near the top with 20px padding
        targetY = window.scrollY + rect.top - 20;
    }

    targetY = Math.max(0, targetY);
    window.scrollTo({
        top: Math.round(targetY),
        behavior: 'smooth'
    });
}

function trackSpotlightContinuously(targetEl, spotlight, tooltip, durationMs = 650) {
    if (tourRafId) cancelAnimationFrame(tourRafId);

    const startTime = performance.now();

    function tick(now) {
        const elapsed = now - startTime;
        updateSpotlightPosition(targetEl, spotlight, tooltip);

        if (elapsed < durationMs) {
            tourRafId = requestAnimationFrame(tick);
        } else {
            updateSpotlightPosition(targetEl, spotlight, tooltip);
        }
    }

    tourRafId = requestAnimationFrame(tick);
}

function renderTourStep() {
    const step = TOUR_STEPS[currentTourIndex];
    const tooltip = document.getElementById('tourTooltip');
    const spotlight = document.getElementById('tourSpotlight');

    // Ensure profits are calculated if targeting bestMandiHero
    if (step.target === 'bestMandiHero') {
        const resultsContainer = document.getElementById('resultsContainer');
        const bestMandiHero = document.getElementById('bestMandiHero');
        if (!bestMandiHero || !bestMandiHero.children.length || (resultsContainer && resultsContainer.classList.contains('hidden'))) {
            calculateNetProfits({ isInitial: true });
        }
    }

    let targetEl = document.getElementById(step.target);
    if (!targetEl && step.fallback) {
        targetEl = document.getElementById(step.fallback);
    }

    document.getElementById('tourTitle').textContent = t(step.titleKey);
    document.getElementById('tourBody').textContent = t(step.bodyKey);
    document.getElementById('tourStepCounter').textContent = `${currentTourIndex + 1} / ${TOUR_STEPS.length}`;

    // Update buttons
    document.getElementById('tourPrevBtn').style.display = currentTourIndex === 0 ? 'none' : 'inline-block';
    document.getElementById('tourNextBtn').textContent = currentTourIndex === TOUR_STEPS.length - 1 ? t('tourFinish') : t('tourNext');

    if (targetEl) {
        const parentResults = targetEl.closest('#resultsContainer');
        if (parentResults && parentResults.classList.contains('hidden')) {
            parentResults.classList.remove('hidden');
        }
        if (targetEl.classList.contains('hidden')) {
            targetEl.classList.remove('hidden');
        }

        // 1. Immediately position to avoid initial jump
        updateSpotlightPosition(targetEl, spotlight, tooltip);

        // 2. Smoothly scroll target element into view
        smoothScrollToTarget(targetEl);

        // 3. Keep spotlight and tooltip continuously tracking in lockstep at 60fps/120fps during smooth scroll
        trackSpotlightContinuously(targetEl, spotlight, tooltip, 650);
    }
}

function nextTourStep() {
    if (currentTourIndex < TOUR_STEPS.length - 1) {
        currentTourIndex++;
        renderTourStep();
    } else {
        closeTour();
    }
}

function prevTourStep() {
    if (currentTourIndex > 0) {
        currentTourIndex--;
        renderTourStep();
    }
}

function closeTour() {
    if (tourRafId) cancelAnimationFrame(tourRafId);
    document.getElementById('tourOverlay').classList.add('hidden');
    if (leafletMap) {
        setTimeout(() => leafletMap.invalidateSize(), 200);
    }
}

// Window resize & scroll listeners for tour
window.addEventListener('resize', () => {
    const overlay = document.getElementById('tourOverlay');
    if (overlay && !overlay.classList.contains('hidden')) {
        const step = TOUR_STEPS[currentTourIndex];
        const targetEl = document.getElementById(step.target) || (step.fallback ? document.getElementById(step.fallback) : null);
        if (targetEl) {
            updateSpotlightPosition(targetEl, document.getElementById('tourSpotlight'), document.getElementById('tourTooltip'));
        }
    }
});

window.addEventListener('scroll', () => {
    const overlay = document.getElementById('tourOverlay');
    if (overlay && !overlay.classList.contains('hidden')) {
        const step = TOUR_STEPS[currentTourIndex];
        const targetEl = document.getElementById(step.target) || (step.fallback ? document.getElementById(step.fallback) : null);
        if (targetEl) {
            updateSpotlightPosition(targetEl, document.getElementById('tourSpotlight'), document.getElementById('tourTooltip'));
        }
    }
}, { passive: true });

// ==========================================
// 13. LANGUAGE MODAL & SEEDING (FAST BATCHED)
// ==========================================

function openLanguageModal() {
    const modal = document.getElementById('languageModal');
    const grid = document.getElementById('languageGrid');
    const frag = document.createDocumentFragment();

    LANGUAGES.forEach(lang => {
        const card = document.createElement('div');
        card.className = `lang-card ${lang.code === currentLanguage ? 'active' : ''}`;
        card.innerHTML = `
            <div class="lang-native">${lang.native}</div>
            <div class="lang-eng">${lang.name}</div>
            <div class="lang-reg">${lang.region}</div>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('.lang-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            setLanguage(lang.code);
            showToast(`Language switched to ${lang.native} (${lang.name})!`, 'success');
            setTimeout(() => {
                closeLanguageModal(false);
            }, 320);
        });
        frag.appendChild(card);
    });
    grid.innerHTML = '';
    grid.appendChild(frag);

    modal.classList.remove('hidden');
}

window.onLanguageChanged = function(langCode) {
    // 1. Re-render calculator results so that Best Mandi Hero, Insights, and Table/Cards update text
    if (typeof calculateNetProfits === 'function') {
        calculateNetProfits({ isInitial: true, isUserAction: false });
    }

    // 2. Re-render Knapsack Optimizer results
    if (typeof runKnapsackOptimization === 'function') {
        runKnapsackOptimization();
    }

    // 3. Re-render BST price search
    if (typeof runBSTPriceSearch === 'function') {
        runBSTPriceSearch();
    }

    // 4. Update Origin display if user location is set
    const originDisp = document.getElementById('mapOriginDisplay');
    if (originDisp && currentUserLocation) {
        originDisp.innerHTML = `Origin: <strong>${currentUserLocation.displayName}</strong>`;
    }

    // 5. Update Navbar language label
    const currentLangObj = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
    const langBtnText = document.getElementById('currentLangLabel');
    if (langBtnText) {
        langBtnText.textContent = currentLangObj.native;
    }
};

function closeLanguageModal(andStartTour = false) {
    const modal = document.getElementById('languageModal');
    if (modal) modal.classList.add('hidden');

    const skipCheckbox = document.getElementById('skipIntroCheckbox');
    if (skipCheckbox && skipCheckbox.checked) {
        localStorage.setItem('kisan_skip_intro', 'true');
    }

    if (leafletMap) {
        setTimeout(() => leafletMap.invalidateSize(), 200);
    }

    if (andStartTour) {
        setTimeout(startTour, 350);
    } else {
        // Trigger location prompt modal on visit if location not yet chosen
        if (localStorage.getItem('kisan_loc_modal_dismissed') !== 'true' && localStorage.getItem('kisan_user_location_set') !== 'true') {
            setTimeout(openLocationPromptModal, 350);
        }
    }
}

// ==========================================
// 14. FAST PERFORMANCE HELPERS & LOADING SCREEN
// ==========================================

function debounce(fn, wait = 100) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
    };
}

function runLoadingScreen() {
    const loader = document.getElementById('appLoader');
    if (!loader) return;

    const bar = document.getElementById('loaderProgressBar');
    const statusText = document.getElementById('loaderStatusText');
    const percentText = document.getElementById('loaderPercentText');

    const stages = [
        { pct: 28, text: "Connecting Wholesale APMC Markets..." },
        { pct: 58, text: "Calculating Shortest Highway Routes..." },
        { pct: 82, text: "Optimizing Truck Payload & Profits..." },
        { pct: 96, text: "Connecting Live Real-Time Mandi Rates..." },
        { pct: 100, text: "Ready! Jai Kisan 🌾" }
    ];

    let currentStage = 0;

    function nextStage() {
        if (currentStage >= stages.length) {
            setTimeout(() => {
                loader.classList.add('loader-hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 650);
            }, 300);
            return;
        }

        const stage = stages[currentStage];
        if (bar) bar.style.width = `${stage.pct}%`;
        if (percentText) percentText.textContent = `${stage.pct}%`;
        if (statusText) statusText.textContent = stage.text;

        currentStage++;
        const delay = currentStage === stages.length ? 300 : 110 + Math.random() * 60;
        setTimeout(nextStage, delay);
    }

    requestAnimationFrame(() => {
        nextStage();
    });
}

// ==========================================
// 14B. THEME CONTROLLER (LIGHT & DARK MODE)
// ==========================================

function initTheme() {
    if (typeof window.applyAppTheme === 'function') {
        const savedTheme = localStorage.getItem('kisan_theme') || 
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        window.applyAppTheme(savedTheme, false);
    }
}

function applyTheme(theme, syncMap = true) {
    if (typeof window.applyAppTheme === 'function') {
        window.applyAppTheme(theme, syncMap);
    }
}

// ==========================================
// 15. INITIALIZATION & HIGH PERFORMANCE EVENTS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize theme (Dark / Light)
    initTheme();

    // 1. Launch Splash Loading Screen
    runLoadingScreen();

    // 2. Fast batched dropdown seeding
    const villageSelect = document.getElementById('villageSelect');
    const villageFrag = document.createDocumentFragment();
    VILLAGES.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.district}, ${v.state})`;
        villageFrag.appendChild(opt);
    });
    villageSelect.innerHTML = '';
    villageSelect.appendChild(villageFrag);

    // Initialize Pan-India Location Autocomplete
    initLocationAutocomplete();

    // Restore saved user location if available
    const savedLocStr = localStorage.getItem('kisan_last_loc');
    if (savedLocStr) {
        try {
            const savedLoc = JSON.parse(savedLocStr);
            if (savedLoc && savedLoc.lat && savedLoc.lng) {
                setUserLocation(savedLoc.lat, savedLoc.lng, savedLoc.displayName, savedLoc.source, { silent: true });
            }
        } catch (e) {}
    }

    // Populate Crop Badges
    const cropSelect = document.getElementById('cropSelect');
    const bstCropSelect = document.getElementById('bstCropSelect');
    const cropFrag = document.createDocumentFragment();
    const bstCropFrag = document.createDocumentFragment();

    for (const [key, crop] of Object.entries(CROPS)) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `${crop.icon} ${crop.name} (Base ₹${crop.basePrice}/qtl)`;
        cropFrag.appendChild(opt);

        const bstOpt = opt.cloneNode(true);
        bstCropFrag.appendChild(bstOpt);
    }
    cropSelect.appendChild(cropFrag);
    bstCropSelect.appendChild(bstCropFrag);

    // Set initial language
    const savedLang = localStorage.getItem('kisan_lang') || 'en';
    setLanguage(savedLang);

    // Defer Leaflet Map initialization slightly for zero frame drop on startup
    requestAnimationFrame(() => {
        initLeafletMap();
    });

    // Initial silent calculations (no auto-scroll on boot)
    initKnapsackMandiSelect();
    calculateNetProfits({ isInitial: true });
    runKnapsackOptimization();
    runBSTPriceSearch();

    // Start real-time live APMC auction rate engine & ticker
    initLiveMarketFeed();

    // Show intro modal unless user explicitly opted out via checkbox
    const skipIntro = localStorage.getItem('kisan_skip_intro');
    if (skipIntro !== 'true') {
        openLanguageModal();
    } else {
        const modal = document.getElementById('languageModal');
        if (modal) modal.classList.add('hidden');

        // If intro was skipped, show location prompt on first visit
        if (localStorage.getItem('kisan_loc_modal_dismissed') !== 'true' && localStorage.getItem('kisan_user_location_set') !== 'true') {
            setTimeout(openLocationPromptModal, 600);
        }
    }

    // Table vs Card view switcher
    const viewTableBtn = document.getElementById('viewTableBtn');
    const viewCardsBtn = document.getElementById('viewCardsBtn');
    const tableViewWrapper = document.getElementById('tableViewWrapper');
    const cardsViewWrapper = document.getElementById('cardsViewWrapper');

    if (viewTableBtn && viewCardsBtn) {
        viewTableBtn.addEventListener('click', () => {
            viewTableBtn.classList.add('active-view');
            viewCardsBtn.classList.remove('active-view');
            tableViewWrapper.classList.remove('hidden');
            cardsViewWrapper.classList.add('hidden');
        });

        viewCardsBtn.addEventListener('click', () => {
            viewCardsBtn.classList.add('active-view');
            viewTableBtn.classList.remove('active-view');
            tableViewWrapper.classList.add('hidden');
            cardsViewWrapper.classList.remove('hidden');
        });
    }

    // Mobile Hamburger Menu
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mainNavLinks = document.getElementById('mainNavLinks');
    if (mobileNavToggle && mainNavLinks) {
        mobileNavToggle.addEventListener('click', () => {
            mainNavLinks.classList.toggle('mobile-open');
        });

        // Close menu on link click
        mainNavLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => mainNavLinks.classList.remove('mobile-open'));
        });
    }

    // Tour close events
    const tourOverlay = document.getElementById('tourOverlay');
    const tourOverlayCloseBtn = document.getElementById('tourOverlayCloseBtn');
    const tourTooltipCloseBtn = document.getElementById('tourTooltipCloseBtn');

    if (tourOverlayCloseBtn) tourOverlayCloseBtn.addEventListener('click', closeTour);
    if (tourTooltipCloseBtn) tourTooltipCloseBtn.addEventListener('click', closeTour);
    if (tourOverlay) {
        tourOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'tourOverlay') closeTour();
        });
    }

    // Event listeners with fast debouncing
    const debouncedCalculate = debounce(() => calculateNetProfits({ isUserAction: true }), 100);
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.addEventListener('input', debouncedCalculate);
    }

    document.getElementById('btnCalculate').addEventListener('click', () => calculateNetProfits({ isUserAction: true }));
    document.getElementById('cropSelect').addEventListener('change', () => calculateNetProfits({ isUserAction: true }));
    document.getElementById('villageSelect').addEventListener('change', () => calculateNetProfits({ isUserAction: true }));
    document.getElementById('vehicleSelect').addEventListener('change', () => calculateNetProfits({ isUserAction: true }));
    document.getElementById('algoSelect').addEventListener('change', () => calculateNetProfits({ isUserAction: true }));

    document.getElementById('btnExportCSV').addEventListener('click', exportCSV);
    document.getElementById('btnPrintReport').addEventListener('click', () => window.print());
    document.getElementById('btnOptimizeTruck').addEventListener('click', runKnapsackOptimization);
    document.getElementById('btnSearchBST').addEventListener('click', runBSTPriceSearch);
    document.getElementById('langModalBtn').addEventListener('click', openLanguageModal);
    document.getElementById('tourBtn').addEventListener('click', startTour);
    
    // Map View & Layer Control Event Listeners
    const btnAllIndia = document.getElementById('btnViewAllIndia');
    const btnMaharashtra = document.getElementById('btnViewMaharashtra');
    const btnFocusRoute = document.getElementById('btnFocusRoute');
    if (btnAllIndia) btnAllIndia.addEventListener('click', () => focusMapView('india'));
    if (btnMaharashtra) btnMaharashtra.addEventListener('click', () => focusMapView('maharashtra'));
    if (btnFocusRoute) btnFocusRoute.addEventListener('click', () => focusMapView('route'));

    const btnLayerVoyager = document.getElementById('btnLayerVoyager');
    const btnLayerDark = document.getElementById('btnLayerDark');
    const btnLayerSatellite = document.getElementById('btnLayerSatellite');
    if (btnLayerVoyager) btnLayerVoyager.addEventListener('click', () => switchMapLayer('voyager'));
    if (btnLayerDark) btnLayerDark.addEventListener('click', () => switchMapLayer('dark'));
    if (btnLayerSatellite) btnLayerSatellite.addEventListener('click', () => switchMapLayer('satellite'));

    // Quick GPS & Map Pick Buttons
    const btnGpsQuick = document.getElementById('btnGpsQuick');
    if (btnGpsQuick) btnGpsQuick.addEventListener('click', () => requestUserGeolocation(false));

    const btnMapPickQuick = document.getElementById('btnMapPickQuick');
    if (btnMapPickQuick) btnMapPickQuick.addEventListener('click', startMapPickMode);

    const btnMapPickOrigin = document.getElementById('btnMapPickOrigin');
    if (btnMapPickOrigin) btnMapPickOrigin.addEventListener('click', () => {
        if (isMapPickingMode) endMapPickMode();
        else startMapPickMode();
    });

    const btnCancelMapPick = document.getElementById('btnCancelMapPick');
    if (btnCancelMapPick) btnCancelMapPick.addEventListener('click', endMapPickMode);

    // Location Permission Modal Actions
    const btnModalAllowGps = document.getElementById('btnModalAllowGps');
    if (btnModalAllowGps) btnModalAllowGps.addEventListener('click', () => requestUserGeolocation(false));

    const btnModalSelectMap = document.getElementById('btnModalSelectMap');
    if (btnModalSelectMap) btnModalSelectMap.addEventListener('click', startMapPickMode);

    const btnModalSkipDefault = document.getElementById('btnModalSkipDefault');
    if (btnModalSkipDefault) btnModalSkipDefault.addEventListener('click', () => {
        closeLocationPromptModal();
        showToast("Using default origin: Junnar (Pune Valley)", "info");
    });

    // Handle responsive window resize on map with debounce
    window.addEventListener('resize', debounce(() => {
        if (leafletMap) leafletMap.invalidateSize();
    }, 150));

    // Intro Modal dual buttons
    const startTourFromModalBtn = document.getElementById('startTourFromModalBtn');
    if (startTourFromModalBtn) {
        startTourFromModalBtn.addEventListener('click', () => closeLanguageModal(true));
    }
    const closeLangModalBtn = document.getElementById('closeLangModalBtn');
    if (closeLangModalBtn) {
        closeLangModalBtn.addEventListener('click', () => closeLanguageModal(false));
    }

    document.getElementById('tourNextBtn').addEventListener('click', nextTourStep);
    document.getElementById('tourPrevBtn').addEventListener('click', prevTourStep);
    document.getElementById('tourSkipBtn').addEventListener('click', closeTour);
});
