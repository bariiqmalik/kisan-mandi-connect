package com.kisan.io;

import com.kisan.algo.RoadNetworkGraph;

import java.io.*;

/**
 * Handles object serialization and deserialization of the RoadNetworkGraph.
 * Demonstrates:
 * - Java Object Serialization: ObjectOutputStream and ObjectInputStream
 * - Saving complex in-memory graph objects directly to binary files
 * - Restoring graph topology without re-parsing raw datasets
 */
public class RoadNetworkSerializer {

    /**
     * Serializes and persists a RoadNetworkGraph object to a binary file.
     *
     * @param graph The road network graph to serialize
     * @param filePath Target binary file path (e.g. "data/road_network.ser")
     * @throws IOException on serialization write failure
     */
    public static void saveNetwork(RoadNetworkGraph graph, String filePath) throws IOException {
        if (graph == null) {
            throw new IllegalArgumentException("Cannot serialize null graph object.");
        }

        File file = new File(filePath);
        File parentDir = file.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }

        try (ObjectOutputStream oos = new ObjectOutputStream(
                new BufferedOutputStream(new FileOutputStream(file)))) {
            oos.writeObject(graph);
            oos.flush();
        }
    }

    /**
     * Deserializes and loads a RoadNetworkGraph object from a binary file.
     *
     * @param filePath Path to the serialized .ser file
     * @return Deserialized RoadNetworkGraph instance
     * @throws IOException on read failure
     * @throws ClassNotFoundException if the RoadNetworkGraph class definition cannot be found
     */
    public static RoadNetworkGraph loadNetwork(String filePath) throws IOException, ClassNotFoundException {
        File file = new File(filePath);
        if (!file.exists()) {
            throw new FileNotFoundException("Serialized network file does not exist at: " + filePath);
        }

        try (ObjectInputStream ois = new ObjectInputStream(
                new BufferedInputStream(new FileInputStream(file)))) {
            Object obj = ois.readObject();
            if (obj instanceof RoadNetworkGraph) {
                return (RoadNetworkGraph) obj;
            } else {
                throw new IOException("Deserialized object is not of type RoadNetworkGraph. Found: " +
                        (obj != null ? obj.getClass().getName() : "null"));
            }
        }
    }
}
