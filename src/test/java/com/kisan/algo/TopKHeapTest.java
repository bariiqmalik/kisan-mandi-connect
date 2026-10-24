package com.kisan.algo;

import com.kisan.model.Crop;
import com.kisan.model.GrainCrop;
import com.kisan.model.Mandi;
import com.kisan.model.MandiProfitResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests verifying TopKHeap handcrafted min-heap behavior.
 */
class TopKHeapTest {

    @Test
    @DisplayName("TopKHeap should extract the top K highest profit elements in descending order")
    void testTopKExtraction() {
        Crop crop = new GrainCrop("SOYBEAN", "Soybean", 4900.0, 180, 12.0, 40.0);

        List<MandiProfitResult> list = new ArrayList<>();
        list.add(new MandiProfitResult(new Mandi("M1", "Mandi 1", "D1", "MH"), crop, 10, 10, Collections.emptyList(), 2000, 1000, 0, 0)); // Net 19,000
        list.add(new MandiProfitResult(new Mandi("M2", "Mandi 2", "D2", "MH"), crop, 10, 10, Collections.emptyList(), 5000, 1000, 0, 0)); // Net 49,000
        list.add(new MandiProfitResult(new Mandi("M3", "Mandi 3", "D3", "MH"), crop, 10, 10, Collections.emptyList(), 3000, 1000, 0, 0)); // Net 29,000
        list.add(new MandiProfitResult(new Mandi("M4", "Mandi 4", "D4", "MH"), crop, 10, 10, Collections.emptyList(), 6000, 1000, 0, 0)); // Net 59,000
        list.add(new MandiProfitResult(new Mandi("M5", "Mandi 5", "D5", "MH"), crop, 10, 10, Collections.emptyList(), 4000, 1000, 0, 0)); // Net 39,000

        List<MandiProfitResult> top3 = TopKHeap.getTopK(list, 3);

        assertEquals(3, top3.size());
        assertEquals(59000.0, top3.get(0).getNetProfit());
        assertEquals("M4", top3.get(0).getMandi().getId());

        assertEquals(49000.0, top3.get(1).getNetProfit());
        assertEquals("M2", top3.get(1).getMandi().getId());

        assertEquals(39000.0, top3.get(2).getNetProfit());
        assertEquals("M5", top3.get(2).getMandi().getId());
    }

    @Test
    @DisplayName("TopKHeap when K is greater than list size")
    void testKGreaterThanSize() {
        Crop crop = new GrainCrop("WHEAT", "Wheat", 2400.0, 180, 12.0, 40.0);
        List<MandiProfitResult> list = new ArrayList<>();
        list.add(new MandiProfitResult(new Mandi("1", "M1", "D1", "MH"), crop, 10, 10, Collections.emptyList(), 2000, 500, 0, 0));
        list.add(new MandiProfitResult(new Mandi("2", "M2", "D2", "MH"), crop, 10, 10, Collections.emptyList(), 3000, 500, 0, 0));

        List<MandiProfitResult> top5 = TopKHeap.getTopK(list, 5);
        assertEquals(2, top5.size());
        assertEquals(29500.0, top5.get(0).getNetProfit());
        assertEquals(19500.0, top5.get(1).getNetProfit());
    }
}
