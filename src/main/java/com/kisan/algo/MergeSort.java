package com.kisan.algo;

import com.kisan.model.MandiProfitResult;

import java.util.ArrayList;
import java.util.List;

/**
 * Handcrafted Merge Sort algorithm to rank Mandis by Net Profit in descending order.
 *
 * Algorithm Concept (Viva explanation):
 * 1. Divide and Conquer strategy.
 * 2. Divide: Split the list into two halves at the midpoint.
 * 3. Conquer: Recursively sort both the left half and right half.
 * 4. Combine (Merge): Compare elements from both sorted halves and merge them
 *    back in descending order of net profit.
 * 5. Guarantee: Stable sort with guaranteed O(N log N) time in all cases.
 *
 * Time Complexity:
 * - Best, Average, and Worst Case: O(N log N) (predictable performance)
 * Space Complexity:
 * - O(N) auxiliary space required for merging sublists.
 */
public class MergeSort {

    private long comparisonCount = 0;
    private long mergeOperations = 0;

    public MergeSort() {
    }

    /**
     * Sorts the list of MandiProfitResult in-place in descending order of net profit.
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
        this.mergeOperations = 0;
        mergeSortRecursive(list, 0, list.size() - 1);
        updateRanks(list);
    }

    /**
     * Recursive merge sort helper.
     */
    private void mergeSortRecursive(List<MandiProfitResult> list, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;

            // Sort first and second halves
            mergeSortRecursive(list, left, mid);
            mergeSortRecursive(list, mid + 1, right);

            // Merge the sorted halves
            merge(list, left, mid, right);
        }
    }

    /**
     * Merges two sorted sublists: list[left..mid] and list[mid+1..right]
     * in DESCENDING order of net profit.
     */
    private void merge(List<MandiProfitResult> list, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        // Temporary auxiliary lists for left and right partitions
        List<MandiProfitResult> leftList = new ArrayList<>(n1);
        List<MandiProfitResult> rightList = new ArrayList<>(n2);

        for (int i = 0; i < n1; i++) {
            leftList.add(list.get(left + i));
        }
        for (int j = 0; j < n2; j++) {
            rightList.add(list.get(mid + 1 + j));
        }

        int i = 0, j = 0;
        int k = left;

        // Merge back into original list in descending order
        while (i < n1 && j < n2) {
            comparisonCount++;
            if (leftList.get(i).getNetProfit() >= rightList.get(j).getNetProfit()) {
                list.set(k, leftList.get(i));
                i++;
            } else {
                list.set(k, rightList.get(j));
                j++;
            }
            k++;
            mergeOperations++;
        }

        // Copy remaining elements of leftList, if any
        while (i < n1) {
            list.set(k, leftList.get(i));
            i++;
            k++;
            mergeOperations++;
        }

        // Copy remaining elements of rightList, if any
        while (j < n2) {
            list.set(k, rightList.get(j));
            j++;
            k++;
            mergeOperations++;
        }
    }

    private void updateRanks(List<MandiProfitResult> list) {
        for (int idx = 0; idx < list.size(); idx++) {
            list.get(idx).setRank(idx + 1);
        }
    }

    public long getComparisonCount() {
        return comparisonCount;
    }

    public long getMergeOperations() {
        return mergeOperations;
    }
}
