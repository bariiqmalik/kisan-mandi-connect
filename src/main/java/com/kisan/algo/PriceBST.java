package com.kisan.algo;

import java.util.ArrayList;
import java.util.List;

/**
 * Handcrafted Binary Search Tree (BST) to index Mandis by crop price per quintal.
 *
 * Algorithm Concept (Viva explanation):
 * 1. BST Property: For every node with key P:
 *    - All nodes in its left subtree have key <= P
 *    - All nodes in its right subtree have key >= P
 * 2. Inorder Traversal: Visiting (Left -> Root -> Right) naturally yields all mandis
 *    sorted in ascending order of crop price!
 * 3. Range Query Optimization (Pruning):
 *    - To find mandis with price in [minPrice, maxPrice]:
 *      - If current.price > minPrice, the left subtree might contain valid mandis.
 *      - If minPrice <= current.price <= maxPrice, current node is included.
 *      - If current.price < maxPrice, the right subtree might contain valid mandis.
 *      - Branches outside the range are pruned, avoiding unnecessary checks!
 *
 * Complexity:
 * - Average Search/Insert: O(log N)
 * - Worst-case (skewed tree): O(N)
 * - Inorder traversal: O(N)
 */
public class PriceBST {

    /**
     * Inner static class representing a node in the Price BST.
     */
    public static class MandiPriceEntry {
        private final String mandiName;
        private final String district;
        private final String cropName;
        private final double pricePerQuintal;

        public MandiPriceEntry(String mandiName, String district, String cropName, double pricePerQuintal) {
            this.mandiName = mandiName;
            this.district = district;
            this.cropName = cropName;
            this.pricePerQuintal = pricePerQuintal;
        }

        public String getMandiName() {
            return mandiName;
        }

        public String getDistrict() {
            return district;
        }

        public String getCropName() {
            return cropName;
        }

        public double getPricePerQuintal() {
            return pricePerQuintal;
        }

        @Override
        public String toString() {
            return String.format("%s (%s) - %s @ ₹%.2f/qtl", mandiName, district, cropName, pricePerQuintal);
        }
    }

    private static class BSTNode {
        MandiPriceEntry entry;
        BSTNode left;
        BSTNode right;

        BSTNode(MandiPriceEntry entry) {
            this.entry = entry;
            this.left = null;
            this.right = null;
        }
    }

    private BSTNode root;
    private int size;

    public PriceBST() {
        this.root = null;
        this.size = 0;
    }

    /**
     * Inserts a mandi price entry into the BST.
     */
    public void insert(String mandiName, String district, String cropName, double pricePerQuintal) {
        MandiPriceEntry entry = new MandiPriceEntry(mandiName, district, cropName, pricePerQuintal);
        this.root = insertRecursive(this.root, entry);
        this.size++;
    }

    private BSTNode insertRecursive(BSTNode current, MandiPriceEntry entry) {
        if (current == null) {
            return new BSTNode(entry);
        }

        // Compare price keys:
        if (entry.getPricePerQuintal() < current.entry.getPricePerQuintal()) {
            current.left = insertRecursive(current.left, entry);
        } else {
            // Equal or greater prices go to the right subtree
            current.right = insertRecursive(current.right, entry);
        }

        return current;
    }

    /**
     * Performs an Inorder Traversal (Left, Root, Right).
     * Returns all entries sorted in ascending order of price.
     */
    public List<MandiPriceEntry> getInorderList() {
        List<MandiPriceEntry> results = new ArrayList<>();
        inorderHelper(root, results);
        return results;
    }

    private void inorderHelper(BSTNode node, List<MandiPriceEntry> results) {
        if (node != null) {
            inorderHelper(node.left, results);
            results.add(node.entry);
            inorderHelper(node.right, results);
        }
    }

    /**
     * Pruned Range Query: Finds all mandis where price is within [minPrice, maxPrice].
     * Demonstrates recursive pruning of irrelevant subtrees.
     *
     * @param minPrice Lower price bound (inclusive)
     * @param maxPrice Upper price bound (inclusive)
     * @return List of matching mandi price entries
     */
    public List<MandiPriceEntry> findMandisInPriceRange(double minPrice, double maxPrice) {
        List<MandiPriceEntry> results = new ArrayList<>();
        rangeSearchHelper(root, minPrice, maxPrice, results);
        return results;
    }

    private void rangeSearchHelper(BSTNode node, double minPrice, double maxPrice, List<MandiPriceEntry> results) {
        if (node == null) {
            return;
        }

        // 1. If current node's price is greater than minPrice, search left subtree
        if (node.entry.getPricePerQuintal() > minPrice) {
            rangeSearchHelper(node.left, minPrice, maxPrice, results);
        }

        // 2. If current node is within [minPrice, maxPrice], collect it
        if (node.entry.getPricePerQuintal() >= minPrice && node.entry.getPricePerQuintal() <= maxPrice) {
            results.add(node.entry);
        }

        // 3. If current node's price is less than maxPrice, search right subtree
        if (node.entry.getPricePerQuintal() < maxPrice) {
            rangeSearchHelper(node.right, minPrice, maxPrice, results);
        }
    }

    public int getSize() {
        return size;
    }

    public boolean isEmpty() {
        return root == null;
    }
}
