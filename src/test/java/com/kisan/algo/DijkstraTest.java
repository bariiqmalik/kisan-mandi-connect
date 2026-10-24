package com.kisan.algo;

import com.kisan.exception.NoRouteException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests verifying Dijkstra's algorithm and shortest path routing on RoadNetworkGraph.
 */
class DijkstraTest {

    private RoadNetworkGraph graph;

    @BeforeEach
    void setUp() {
        graph = new RoadNetworkGraph();
        // Construct a sample rural graph:
        // Village -> JunctionA (10 km)
        // Village -> JunctionB (25 km)
        // JunctionA -> MandiX (20 km)
        // JunctionB -> MandiX (4 km)  [Total via JunctionB = 25 + 4 = 29 km]
        // JunctionA -> JunctionB (8 km) [Total via JunctionA -> JunctionB -> MandiX = 10 + 8 + 4 = 22 km!]
        // MandiY is isolated (no roads connected)

        graph.addRoad("Village", "JunctionA", 10.0, "State Highway");
        graph.addRoad("Village", "JunctionB", 25.0, "District Road");
        graph.addRoad("JunctionA", "MandiX", 20.0, "National Highway");
        graph.addRoad("JunctionB", "MandiX", 4.0, "City Road");
        graph.addRoad("JunctionA", "JunctionB", 8.0, "Link Road");

        graph.addNode("MandiY"); // Isolated node
    }

    @Test
    @DisplayName("Dijkstra should find optimal multi-hop shortest path")
    void testDijkstraShortestPath() throws NoRouteException {
        RoadNetworkGraph.PathResult result = graph.findShortestPath("Village", "MandiX");

        assertNotNull(result);
        // Village -> JunctionA (10) -> JunctionB (8) -> MandiX (4) = 22.0 km
        // vs Village -> JunctionA (10) -> MandiX (20) = 30.0 km
        // vs Village -> JunctionB (25) -> MandiX (4) = 29.0 km
        assertEquals(22.0, result.getTotalDistanceKm(), 0.001, "Should pick the shortest path (22.0 km)");
        assertEquals("Village -> JunctionA -> JunctionB -> MandiX", result.getFormattedRoute());
    }

    @Test
    @DisplayName("Dijkstra throws NoRouteException for unreachable target")
    void testUnreachableNodeThrowsException() {
        assertThrows(NoRouteException.class, () -> graph.findShortestPath("Village", "MandiY"),
                "Should throw NoRouteException when target node cannot be reached");
    }

    @Test
    @DisplayName("Dijkstra throws NoRouteException for unknown source node")
    void testUnknownSourceThrowsException() {
        assertThrows(NoRouteException.class, () -> graph.computeShortestPaths("NonExistentVillage"));
    }

    @Test
    @DisplayName("Shortest path to self has 0 distance")
    void testSelfPathZeroDistance() throws NoRouteException {
        Map<String, RoadNetworkGraph.PathResult> allPaths = graph.computeShortestPaths("Village");
        RoadNetworkGraph.PathResult self = allPaths.get("Village");
        assertNotNull(self);
        assertEquals(0.0, self.getTotalDistanceKm());
    }
}
