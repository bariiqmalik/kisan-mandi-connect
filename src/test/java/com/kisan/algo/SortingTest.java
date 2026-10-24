package com.kisan.algo;

import com.kisan.model.Crop;
import com.kisan.model.GrainCrop;
import com.kisan.model.Mandi;
import com.kisan.model.MandiProfitResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests verifying handcrafted QuickSort and MergeSort implementations.
 */
class SortingTest {

    private Crop sampleCrop;
    private Mandi mandiA;
    private Mandi mandiB;
    private Mandi mandiC;
    private Mandi mandiD;

    @BeforeEach
    void setUp() {
        sampleCrop = new GrainCrop("WHEAT", "Lokwan Wheat", 2400.0, 365, 12.0, 40.0);
        mandiA = new Mandi("M1", "Pune APMC", "Pune", "MH");
        mandiB = new Mandi("M2", "Nashik APMC", "Nashik", "MH");
        mandiC = new Mandi("M3", "Lasalgaon APMC", "Nashik", "MH");
        mandiD = new Mandi("M4", "Vashi APMC", "Thane", "MH");
    }

    private List<MandiProfitResult> createTestList() {
        List<MandiProfitResult> list = new ArrayList<>();
        // Create results with distinct net profits
        // mandiA net profit = 50,000 - 5,000 = 45,000
        list.add(new MandiProfitResult(mandiA, sampleCrop, 20.0, 50.0, Collections.emptyList(), 2500.0, 5000.0, 0, 0));
        // mandiB net profit = 60,000 - 8,000 = 52,000
        list.add(new MandiProfitResult(mandiB, sampleCrop, 20.0, 80.0, Collections.emptyList(), 3000.0, 8000.0, 0, 0));
        // mandiC net profit = 40,000 - 2,000 = 38,000
        list.add(new MandiProfitResult(mandiC, sampleCrop, 20.0, 20.0, Collections.emptyList(), 2000.0, 2000.0, 0, 0));
        // mandiD net profit = 70,000 - 12,000 = 58,000
        list.add(new MandiProfitResult(mandiD, sampleCrop, 20.0, 120.0, Collections.emptyList(), 3500.0, 12000.0, 0, 0));
        return list;
    }

    @Test
    @DisplayName("QuickSort should sort results in descending order of net profit")
    void testQuickSortDescendingOrder() {
        List<MandiProfitResult> list = createTestList();
        QuickSort qs = new QuickSort();
        qs.sort(list);

        assertEquals(4, list.size());
        assertEquals("Vashi APMC", list.get(0).getMandi().getName(), "Highest net profit should be Rank 1");
        assertEquals(58000.0, list.get(0).getNetProfit());
        assertEquals(1, list.get(0).getRank());

        assertEquals("Nashik APMC", list.get(1).getMandi().getName());
        assertEquals(52000.0, list.get(1).getNetProfit());

        assertEquals("Pune APMC", list.get(2).getMandi().getName());
        assertEquals(45000.0, list.get(2).getNetProfit());

        assertEquals("Lasalgaon APMC", list.get(3).getMandi().getName());
        assertEquals(38000.0, list.get(3).getNetProfit());

        assertTrue(qs.getComparisonCount() > 0, "QuickSort should track comparisons");
    }

    @Test
    @DisplayName("MergeSort should sort results in descending order of net profit")
    void testMergeSortDescendingOrder() {
        List<MandiProfitResult> list = createTestList();
        MergeSort ms = new MergeSort();
        ms.sort(list);

        assertEquals(4, list.size());
        assertEquals(58000.0, list.get(0).getNetProfit());
        assertEquals(52000.0, list.get(1).getNetProfit());
        assertEquals(45000.0, list.get(2).getNetProfit());
        assertEquals(38000.0, list.get(3).getNetProfit());

        assertTrue(ms.getComparisonCount() > 0, "MergeSort should track comparisons");
        assertTrue(ms.getMergeOperations() > 0, "MergeSort should track merge operations");
    }

    @Test
    @DisplayName("QuickSort and MergeSort handle single element or empty list gracefully")
    void testSortingEdgeCases() {
        QuickSort qs = new QuickSort();
        MergeSort ms = new MergeSort();

        List<MandiProfitResult> empty = new ArrayList<>();
        assertDoesNotThrow(() -> qs.sort(empty));
        assertDoesNotThrow(() -> ms.sort(empty));

        List<MandiProfitResult> single = new ArrayList<>();
        single.add(new MandiProfitResult(mandiA, sampleCrop, 10.0, 20.0, Collections.emptyList(), 2000.0, 1000.0, 0, 0));

        assertDoesNotThrow(() -> qs.sort(single));
        assertEquals(1, single.get(0).getRank());

        assertDoesNotThrow(() -> ms.sort(single));
        assertEquals(1, single.get(0).getRank());
    }
}
