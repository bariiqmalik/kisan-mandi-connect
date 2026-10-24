package com.kisan.algo;

import com.kisan.model.MandiProfitResult;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Handcrafted Min-Heap data structure optimized to find the Top-K Best Mandis.
 *
 * Algorithm Concept (Viva explanation):
 * - To find the top K highest profit mandis among N options:
 *   Instead of sorting all N elements in O(N log N), we maintain a Min-Heap of size K.
 * - The root of the Min-Heap is always the SMALLEST profit among the top K seen so far.
 * - For each mandi:
 *   1. If heap size < K: insert mandi into heap (heapify-up).
 *   2. If heap size == K: compare current mandi profit with root (minimum in heap).
 *      If current mandi profit > root profit:
 *         replace root with current mandi and heapify-down!
 * - At the end, the heap contains the exact top K mandis.
 *
 * Complexity:
 * - Time: O(N log K) - substantially faster than O(N log N) when K << N.
 * - Auxiliary Space: O(K) space for the heap array.
 */
public class TopKHeap {

    private final int capacity;
    private final MandiProfitResult[] heap;
    private int size;

    @SuppressWarnings("unchecked")
    public TopKHeap(int k) {
        if (k <= 0) {
            throw new IllegalArgumentException("K must be greater than 0");
        }
        this.capacity = k;
        this.heap = new MandiProfitResult[k];
        this.size = 0;
    }

    /**
     * Finds the Top-K mandis with the highest net profit from an arbitrary list.
     *
     * @param items List of evaluated mandis
     * @param k Number of top items desired
     * @return List of Top-K mandis sorted in descending order of net profit
     */
    public static List<MandiProfitResult> getTopK(List<MandiProfitResult> items, int k) {
        if (items == null || items.isEmpty() || k <= 0) {
            return Collections.emptyList();
        }

        int actualK = Math.min(k, items.size());
        TopKHeap minHeap = new TopKHeap(actualK);

        for (MandiProfitResult item : items) {
            minHeap.processElement(item);
        }

        // Extract elements from heap (comes out in ascending order from Min-Heap)
        List<MandiProfitResult> extracted = new ArrayList<>(actualK);
        while (minHeap.size > 0) {
            extracted.add(minHeap.extractMin());
        }

        // Reverse to return highest net profit first (Rank 1, 2, ... K)
        Collections.reverse(extracted);
        for (int i = 0; i < extracted.size(); i++) {
            extracted.get(i).setRank(i + 1);
        }

        return extracted;
    }

    /**
     * Processes an element into the bounded size-K Min-Heap.
     */
    public void processElement(MandiProfitResult item) {
        if (size < capacity) {
            insert(item);
        } else if (item.getNetProfit() > heap[0].getNetProfit()) {
            // New item is more profitable than the smallest in our top K
            heap[0] = item;
            heapifyDown(0);
        }
    }

    /**
     * Inserts an element into the heap and restores min-heap property via swim/heapifyUp.
     */
    private void insert(MandiProfitResult item) {
        heap[size] = item;
        heapifyUp(size);
        size++;
    }

    /**
     * Extracts and returns the minimum element (root).
     */
    public MandiProfitResult extractMin() {
        if (size == 0) {
            return null;
        }
        MandiProfitResult min = heap[0];
        heap[0] = heap[size - 1];
        heap[size - 1] = null;
        size--;
        if (size > 0) {
            heapifyDown(0);
        }
        return min;
    }

    /**
     * Heapify-Up (Swim): moves element up while it is smaller than its parent.
     */
    private void heapifyUp(int index) {
        int current = index;
        while (current > 0) {
            int parent = (current - 1) / 2;
            // Min-heap condition: parent should be <= child
            if (heap[current].getNetProfit() < heap[parent].getNetProfit()) {
                swap(current, parent);
                current = parent;
            } else {
                break;
            }
        }
    }

    /**
     * Heapify-Down (Sink): moves element down while it is larger than its smallest child.
     */
    private void heapifyDown(int index) {
        int current = index;
        while (current < size) {
            int leftChild = 2 * current + 1;
            int rightChild = 2 * current + 2;
            int smallest = current;

            if (leftChild < size && heap[leftChild].getNetProfit() < heap[smallest].getNetProfit()) {
                smallest = leftChild;
            }
            if (rightChild < size && heap[rightChild].getNetProfit() < heap[smallest].getNetProfit()) {
                smallest = rightChild;
            }

            if (smallest != current) {
                swap(current, smallest);
                current = smallest;
            } else {
                break;
            }
        }
    }

    private void swap(int i, int j) {
        MandiProfitResult temp = heap[i];
        heap[i] = heap[j];
        heap[j] = temp;
    }

    public int getSize() {
        return size;
    }
}
