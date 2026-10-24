package com.kisan.algo;

import com.kisan.exception.NoRouteException;

import java.io.Serializable;
import java.util.*;

/**
 * Graph data structure representing the rural and highway road network.
 * Demonstrates:
 * - Graph representation using Adjacency List (Map of Node -> List of Edges)
 * - Handcrafted Dijkstra's Shortest Path Algorithm for single-source shortest path
 * - Path reconstruction using predecessor tracking
 * - Object Serialization (implements Serializable)
 * - Static inner classes (Edge, PathResult)
 */
public class RoadNetworkGraph implements Serializable {
    private static final long serialVersionUID = 1L;

    // Adjacency list: Node name -> List of connected edges
    private final Map<String, List<Edge>> adjacencyList;

    public RoadNetworkGraph() {
        this.adjacencyList = new HashMap<>();
    }

    /**
     * Inner static class representing a directed weighted edge (road segment).
     */
    public static class Edge implements Serializable {
        private static final long serialVersionUID = 1L;

        private final String destination;
        private final double distanceKm;
        private final String roadType; // e.g. "Village Road", "State Highway", "National Highway"

        public Edge(String destination, double distanceKm, String roadType) {
            this.destination = destination;
            this.distanceKm = distanceKm;
            this.roadType = roadType;
        }

        public String getDestination() {
            return destination;
        }

        public double getDistanceKm() {
            return distanceKm;
        }

        public String getRoadType() {
            return roadType;
        }

        @Override
        public String toString() {
            return String.format("-> %s (%.1f km, %s)", destination, distanceKm, roadType);
        }
    }

    /**
     * Inner static class encapsulating the result of Dijkstra's algorithm.
     */
    public static class PathResult implements Serializable {
        private static final long serialVersionUID = 1L;

        private final String source;
        private final String destination;
        private final double totalDistanceKm;
        private final List<String> pathNodes;

        public PathResult(String source, String destination, double totalDistanceKm, List<String> pathNodes) {
            this.source = source;
            this.destination = destination;
            this.totalDistanceKm = totalDistanceKm;
            this.pathNodes = pathNodes;
        }

        public String getSource() {
            return source;
        }

        public String getDestination() {
            return destination;
        }

        public double getTotalDistanceKm() {
            return totalDistanceKm;
        }

        public List<String> getPathNodes() {
            return Collections.unmodifiableList(pathNodes);
        }

        public String getFormattedRoute() {
            return String.join(" -> ", pathNodes);
        }

        @Override
        public String toString() {
            return String.format("%s to %s = %.1f km via [%s]",
                    source, destination, totalDistanceKm, getFormattedRoute());
        }
    }

    /**
     * Helper node for Dijkstra's min-priority queue.
     */
    private static class NodeDistance implements Comparable<NodeDistance> {
        final String node;
        final double distance;

        NodeDistance(String node, double distance) {
            this.node = node;
            this.distance = distance;
        }

        @Override
        public int compareTo(NodeDistance other) {
            return Double.compare(this.distance, other.distance);
        }
    }

    /**
     * Adds a node to the graph if not already present.
     */
    public void addNode(String nodeName) {
        if (nodeName != null && !adjacencyList.containsKey(nodeName)) {
            adjacencyList.put(nodeName, new ArrayList<>());
        }
    }

    /**
     * Adds an undirected bidirectional road between two locations.
     */
    public void addRoad(String u, String v, double distanceKm, String roadType) {
        if (u == null || v == null || distanceKm <= 0) {
            return;
        }
        addNode(u);
        addNode(v);
        adjacencyList.get(u).add(new Edge(v, distanceKm, roadType));
        adjacencyList.get(v).add(new Edge(u, distanceKm, roadType));
    }

    /**
     * Checks if a node exists in the network.
     */
    public boolean containsNode(String nodeName) {
        return nodeName != null && adjacencyList.containsKey(nodeName);
    }

    /**
     * Returns all registered nodes (villages, junctions, mandis).
     */
    public Set<String> getAllNodes() {
        return Collections.unmodifiableSet(adjacencyList.keySet());
    }

    /**
     * Handcrafted Dijkstra's Algorithm:
     * Computes the shortest driving distance and route from a source node to ALL reachable nodes.
     *
     * Algorithm Steps (Viva explanation):
     * 1. Initialize dist[v] = infinity for all vertices, dist[source] = 0.
     * 2. Use a Min-Priority Queue to repeatedly extract the vertex 'u' with minimum tentative distance.
     * 3. For each neighbor 'v' of 'u', relax edge (u, v):
     *    if (dist[u] + weight(u, v) < dist[v]) {
     *        dist[v] = dist[u] + weight(u, v);
     *        prev[v] = u; // record path
     *        pq.offer(new NodeDistance(v, dist[v]));
     *    }
     * 4. Repeat until PQ is empty.
     * 5. Reconstruct shortest paths using the prev[] predecessor map.
     *
     * Time Complexity: O((V + E) log V) with Priority Queue.
     * Space Complexity: O(V) for dist, prev, and visited maps.
     *
     * @param sourceNode Starting village or town
     * @return Map of target node name -> PathResult
     * @throws NoRouteException if source node does not exist in graph
     */
    public Map<String, PathResult> computeShortestPaths(String sourceNode) throws NoRouteException {
        if (!containsNode(sourceNode)) {
            throw new NoRouteException(sourceNode, "Unknown source node in road network");
        }

        // 1. Distance table and predecessor map
        Map<String, Double> distances = new HashMap<>();
        Map<String, String> predecessors = new HashMap<>();
        Set<String> visited = new HashSet<>();

        for (String node : adjacencyList.keySet()) {
            distances.put(node, Double.POSITIVE_INFINITY);
        }
        distances.put(sourceNode, 0.0);

        // 2. Min-Priority Queue based on tentative distance
        PriorityQueue<NodeDistance> pq = new PriorityQueue<>();
        pq.offer(new NodeDistance(sourceNode, 0.0));

        // 3. Main Dijkstra relaxation loop
        while (!pq.isEmpty()) {
            NodeDistance current = pq.poll();
            String u = current.node;

            // Skip if already visited (handles stale duplicate entries in PQ)
            if (visited.contains(u)) {
                continue;
            }
            visited.add(u);

            // Relax all outgoing edges from node u
            List<Edge> neighbors = adjacencyList.getOrDefault(u, Collections.emptyList());
            for (Edge edge : neighbors) {
                String v = edge.getDestination();
                if (visited.contains(v)) {
                    continue;
                }

                double weight = edge.getDistanceKm();
                double newDist = distances.get(u) + weight;

                if (newDist < distances.get(v)) {
                    distances.put(v, newDist);
                    predecessors.put(v, u); // Track path for backtracking
                    pq.offer(new NodeDistance(v, newDist));
                }
            }
        }

        // 4. Construct PathResult for all reachable destinations
        Map<String, PathResult> results = new HashMap<>();
        for (String target : adjacencyList.keySet()) {
            double totalDist = distances.get(target);
            if (!Double.isInfinite(totalDist)) {
                List<String> path = reconstructPath(sourceNode, target, predecessors);
                results.put(target, new PathResult(sourceNode, target, totalDist, path));
            }
        }

        return results;
    }

    /**
     * Finds shortest path between specific source and destination.
     */
    public PathResult findShortestPath(String source, String destination) throws NoRouteException {
        Map<String, PathResult> allPaths = computeShortestPaths(source);
        if (!allPaths.containsKey(destination)) {
            throw new NoRouteException(source, destination);
        }
        return allPaths.get(destination);
    }

    /**
     * Helper to backtrack through predecessor map and build path list in forward order.
     */
    private List<String> reconstructPath(String source, String destination, Map<String, String> predecessors) {
        LinkedList<String> path = new LinkedList<>();
        String curr = destination;

        while (curr != null) {
            path.addFirst(curr);
            if (curr.equals(source)) {
                break;
            }
            curr = predecessors.get(curr);
        }

        // If path does not start with source, destination is unreachable
        if (path.isEmpty() || !path.getFirst().equals(source)) {
            return Collections.emptyList();
        }
        return path;
    }

    public int getNodeCount() {
        return adjacencyList.size();
    }

    public int getEdgeCount() {
        int count = 0;
        for (List<Edge> edges : adjacencyList.values()) {
            count += edges.size();
        }
        return count / 2; // Undirected graph has 2 directed edges per road
    }
}
