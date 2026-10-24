package com.kisan.io;

import com.kisan.model.MandiProfitResult;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Generates and exports financial reports to CSV and plain text formats.
 * Demonstrates:
 * - Java IO package: File, FileWriter, BufferedWriter, PrintWriter
 * - Exception handling with Try-With-Resources for automatic resource closure
 */
public class ProfitReportWriter {

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Exports mandi profit ranking results to a structured CSV file.
     *
     * @param results Ranked list of MandiProfitResult
     * @param targetFilePath Destination file path (e.g. "data/profit_report.csv")
     * @throws IOException on file write failure
     */
    public static void exportToCSV(List<MandiProfitResult> results, String targetFilePath) throws IOException {
        if (results == null || results.isEmpty()) {
            throw new IllegalArgumentException("Cannot export empty results list to CSV.");
        }

        File file = new File(targetFilePath);
        File parentDir = file.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }

        try (PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(file)))) {
            // Write CSV Header
            writer.println("Rank,Mandi Name,District,State,Crop,Quantity (qtl),Distance (km),Price (INR/qtl),Gross Revenue (INR),Transport Cost (INR),Mandi Cess (INR),Transit Loss (INR),Net Profit (INR),Route");

            // Write Data Rows
            for (MandiProfitResult r : results) {
                writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,\"%s\"%n",
                        r.getRank(),
                        r.getMandi().getName(),
                        r.getMandi().getDistrict(),
                        r.getMandi().getState(),
                        r.getCrop().getName(),
                        r.getQuantityQuintals(),
                        r.getDistanceKm(),
                        r.getPricePerQuintal(),
                        r.getGrossRevenue(),
                        r.getTransportCost(),
                        r.getMandiCessAmount(),
                        r.getTransitLossAmount(),
                        r.getNetProfit(),
                        r.getRouteDisplay()
                );
            }
        }
    }

    /**
     * Generates a beautifully formatted human-readable text report.
     *
     * @param results Ranked list of MandiProfitResult
     * @param sourceVillage Farmer's origin village
     * @param targetFilePath Destination text file path
     * @throws IOException on file write failure
     */
    public static void exportToTextReport(List<MandiProfitResult> results, String sourceVillage, String targetFilePath) throws IOException {
        if (results == null || results.isEmpty()) {
            throw new IllegalArgumentException("Cannot export empty results list to Text Report.");
        }

        File file = new File(targetFilePath);
        File parentDir = file.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }

        MandiProfitResult bestOption = results.get(0);

        try (PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(file)))) {
            writer.println("=========================================================================================");
            writer.println("                             KISAN MANDI CONNECT - PROFIT REPORT                        ");
            writer.println("=========================================================================================");
            writer.printf("Generated At    : %s%n", LocalDateTime.now().format(DATE_FORMATTER));
            writer.printf("Farmer Village  : %s%n", sourceVillage);
            writer.printf("Crop Type       : %s (%s)%n", bestOption.getCrop().getName(), bestOption.getCrop().getCategory());
            writer.printf("Harvest Quantity: %.2f Quintals (%.0f kg)%n",
                    bestOption.getQuantityQuintals(), bestOption.getQuantityQuintals() * 100);
            writer.println("-----------------------------------------------------------------------------------------");
            writer.println("TOP RECOMMENDATION (MAXIMUM NET PROFIT):");
            writer.printf("  Mandi Name      : %s [%s, %s]%n",
                    bestOption.getMandi().getName(), bestOption.getMandi().getDistrict(), bestOption.getMandi().getState());
            writer.printf("  Net Profit      : ₹%,.2f%n", bestOption.getNetProfit());
            writer.printf("  Mandi Price     : ₹%.2f / quintal%n", bestOption.getPricePerQuintal());
            writer.printf("  Gross Revenue   : ₹%,.2f%n", bestOption.getGrossRevenue());
            writer.printf("  Transport Cost  : ₹%,.2f (Distance: %.1f km)%n",
                    bestOption.getTransportCost(), bestOption.getDistanceKm());
            writer.printf("  Recommended Route: %s%n", bestOption.getRouteDisplay());
            writer.println("-----------------------------------------------------------------------------------------");
            writer.printf("%-5s %-22s %-10s %-12s %-12s %-12s %-14s%n",
                    "Rank", "Mandi Name", "Dist (km)", "Price/qtl", "Gross (₹)", "Freight (₹)", "Net Profit (₹)");
            writer.println("-----------------------------------------------------------------------------------------");

            for (MandiProfitResult r : results) {
                writer.printf("%-5d %-22s %-10.1f ₹%-11.2f ₹%-11.2f ₹%-11.2f ₹%-13.2f%n",
                        r.getRank(),
                        r.getMandi().getName(),
                        r.getDistanceKm(),
                        r.getPricePerQuintal(),
                        r.getGrossRevenue(),
                        r.getTransportCost(),
                        r.getNetProfit()
                );
            }
            writer.println("=========================================================================================");
            writer.println("Formula: Net Profit = (Mandi Price x Quantity) - Transport Freight - Mandi Cess - Losses");
            writer.println("=========================================================================================");
        }
    }
}
