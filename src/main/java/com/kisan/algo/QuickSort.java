package com.kisan.algo;

import com.kisan.model.MandiProfitResult;

import java.util.List;

/**
 * Handcrafted Quick Sort algorithm to rank Mandis by Net Profit in descending order.
 *
 * Algorithm Concept (Viva explanation):
 * 1. Divide and Conquer strategy.
 * 2. Choose a 'pivot' element from the array (here, middle element to avoid worst-case on pre-sorted data).
 * 3. Partition: Rearrange elements such that all elements with higher profit than pivot
 *    are placed before it, and lower profit elements are placed after it.
 * 4. Recurse: Apply QuickSort recursively to the left sub-array and right sub-array.
 * 5. Base case: Sub-array with 0 or 1 element is already sorted.
 *
 * Time Complexity:
 * - Best & Average Case: O(N log N)
 * - Worst Case: O(N^2) (e.g. if poorly chosen pivot on pathological inputs)
 * Space Complexity:
 * - O(log N) auxiliary space on the call stack for recursive calls (in-place partitioning).
 */
public class QuickSort {

    // Metrics for educational demonstration and comparison
    private long comparisonCount = 0;
    private long swapCount = 0;

    public QuickSort() {
    }

    /**
     * Sorts the given list of MandiProfitResult in-place in descending order of net profit.
     *
     * @param list List of mandi profit evaluations
     */
    public void sort(List<MandiProfitResult> list) {
        if (list == null || list.isEmpty()) {
            return;
        }
        if (list.size() == 1) {
            updateRanks(list);
            return;
        }
        this.comparisonCount = 0;
        this.swapCount = 0;
        quickSortRecursive(list, 0, list.size() - 1);
        updateRanks(list);
    }

    /**
     * Recursive quicksort helper.
     */
    private void quickSortRecursive(List<MandiProfitResult> list, int low, int high) {
        if (low < high) {
            // Partition the array and get the pivot index
            int pivotIndex = partition(list, low, high);

            // Recursively sort elements before and after partition
            quickSortRecursive(list, low, pivotIndex - 1);
            quickSortRecursive(list, pivotIndex + 1, high);
        }
    }

    /**
     * In-place Lomuto-style partition choosing the high element as pivot,
     * sorting in DESCENDING order (higher net profit first).
     */
    private int partition(List<MandiProfitResult> list, int low, int high) {
        // Choose middle element as pivot and swap with high to mitigate sorted input degradation
        int mid = low + (high - low) / 2;
        swap(list, mid, high);

        double pivotValue = list.get(high).getNetProfit();
        int i = low - 1; // Index of smaller (or here, higher profit) boundary

        for (int j = low; j < high; j++) {
            comparisonCount++;
            // For descending order: if current element's profit is greater than pivot
            if (list.get(j).getNetProfit() > pivotValue) {
                i++;
                swap(list, i, j);
            }
        }

        // Place pivot in its correct sorted position
        swap(list, i + 1, high);
        return i + 1;
    }

    /**
     * Swaps two elements in the list.
     */
    private void swap(List<MandiProfitResult> list, int i, int j) {
        if (i != j) {
            MandiProfitResult temp = list.get(i);
            list.set(i, list.get(j));
            list.set(j, temp);
            swapCount++;
        }
    }

    /**
     * Sets rank 1, 2, 3... on the sorted result objects.
     */
    private void updateRanks(List<MandiProfitResult> list) {
        for (int i = 0; i < list.size(); i++) {
            list.get(i).setRank(i + 1);
        }
    }

    public long getComparisonCount() {
        return comparisonCount;
    }

    public long getSwapCount() {
        return swapCount;
    }
}
