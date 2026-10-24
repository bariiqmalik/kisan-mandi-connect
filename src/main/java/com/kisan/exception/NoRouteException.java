package com.kisan.exception;

/**
 * Custom exception thrown when Dijkstra's algorithm cannot find a connected road
 * between the farmer's village and a target mandi.
 */
public class NoRouteException extends KisanException {
    private static final long serialVersionUID = 1L;

    private final String sourceNode;
    private final String targetNode;

    public NoRouteException(String sourceNode, String targetNode) {
        super(String.format("No navigable road route found connecting '%s' to '%s'.", sourceNode, targetNode));
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
    }

    public String getSourceNode() {
        return sourceNode;
    }

    public String getTargetNode() {
        return targetNode;
    }
}
