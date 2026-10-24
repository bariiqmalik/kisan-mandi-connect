package com.kisan.model;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;

/**
 * Result model capturing the financial evaluation of selling a crop lot at a specific Mandi.
 * Represents:
 *   Net Profit = Gross Revenue - Transport Freight Cost - Mandi Cess - Spoilage/Packaging Loss
 *
 * Implements Comparable to allow natural descending comparison by net profit.
 */
public class MandiProfitResult implements Comparable<MandiProfitResult>, Serializable {
    private static final long serialVersionUID = 1L;

    private int rank;
    private Mandi mandi;
    private Crop crop;
    private double quantityQuintals;
    private double distanceKm;
    private List<String> routePath;
    private double pricePerQuintal;
    private double grossRevenue;
    private double transportCost;
    private double mandiCessAmount;
    private double transitLossAmount;
    private double netProfit;

    public MandiProfitResult() {
    }

    public MandiProfitResult(Mandi mandi, Crop crop, double quantityQuintals, double distanceKm,
                             List<String> routePath, double pricePerQuintal, double transportCost,
                             double mandiCessAmount, double transitLossAmount) {
        this.mandi = mandi;
        this.crop = crop;
        this.quantityQuintals = quantityQuintals;
        this.distanceKm = distanceKm;
        this.routePath = routePath;
        this.pricePerQuintal = pricePerQuintal;
        this.grossRevenue = pricePerQuintal * quantityQuintals;
        this.transportCost = transportCost;
        this.mandiCessAmount = mandiCessAmount;
        this.transitLossAmount = transitLossAmount;
        // Core economic calculation:
        this.netProfit = this.grossRevenue - this.transportCost - this.mandiCessAmount - this.transitLossAmount;
    }

    /**
     * Natural order comparison: sorts descending by Net Profit.
     * Higher net profit comes first.
     */
    @Override
    public int compareTo(MandiProfitResult other) {
        if (other == null) {
            return -1;
        }
        return Double.compare(other.netProfit, this.netProfit);
    }

    // Getters and Setters
    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public Mandi getMandi() {
        return mandi;
    }

    public void setMandi(Mandi mandi) {
        this.mandi = mandi;
    }

    public Crop getCrop() {
        return crop;
    }

    public void setCrop(Crop crop) {
        this.crop = crop;
    }

    public double getQuantityQuintals() {
        return quantityQuintals;
    }

    public void setQuantityQuintals(double quantityQuintals) {
        this.quantityQuintals = quantityQuintals;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public List<String> getRoutePath() {
        return routePath != null ? Collections.unmodifiableList(routePath) : Collections.emptyList();
    }

    public void setRoutePath(List<String> routePath) {
        this.routePath = routePath;
    }

    public double getPricePerQuintal() {
        return pricePerQuintal;
    }

    public void setPricePerQuintal(double pricePerQuintal) {
        this.pricePerQuintal = pricePerQuintal;
    }

    public double getGrossRevenue() {
        return grossRevenue;
    }

    public void setGrossRevenue(double grossRevenue) {
        this.grossRevenue = grossRevenue;
    }

    public double getTransportCost() {
        return transportCost;
    }

    public void setTransportCost(double transportCost) {
        this.transportCost = transportCost;
    }

    public double getMandiCessAmount() {
        return mandiCessAmount;
    }

    public void setMandiCessAmount(double mandiCessAmount) {
        this.mandiCessAmount = mandiCessAmount;
    }

    public double getTransitLossAmount() {
        return transitLossAmount;
    }

    public void setTransitLossAmount(double transitLossAmount) {
        this.transitLossAmount = transitLossAmount;
    }

    public double getNetProfit() {
        return netProfit;
    }

    public void setNetProfit(double netProfit) {
        this.netProfit = netProfit;
    }

    public String getRouteDisplay() {
        if (routePath == null || routePath.isEmpty()) {
            return "Direct Road";
        }
        return String.join(" -> ", routePath);
    }

    @Override
    public String toString() {
        return String.format("#%d %s | Dist: %.1f km | Price: ₹%.2f/qtl | Gross: ₹%.2f | Transport: ₹%.2f | Net Profit: ₹%.2f",
                rank, mandi.getName(), distanceKm, pricePerQuintal, grossRevenue, transportCost, netProfit);
    }
}
