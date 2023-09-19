
export const createAdjacencyList = (N) => {
    const adjacencyList = {};

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const node = `${i}-${j}`;
            const neighbors = [];

            if (i > 0) neighbors.push(`${i - 1}-${j}`);
            if (i < N - 1) neighbors.push(`${i + 1}-${j}`);
            if (j > 0) neighbors.push(`${i}-${j - 1}`);
            if (j < N - 1) neighbors.push(`${i}-${j + 1}`);

            adjacencyList[node] = neighbors;
        }
    }
    return adjacencyList;
}

export const dijkstra = (adjacencyList, startNode) => {
    const visited = new Set();
    const distances = {};
    const previous = {};
    const nodes = Object.keys(adjacencyList);

    // Initialize distances and previous nodes
    nodes.forEach(node => {
        distances[node] = Infinity;
        previous[node] = null;
    });

    distances[startNode] = 0;

    while (nodes.length > 0) {
        const currentNode = nodes.reduce((minNode, node) => (
            distances[node] < distances[minNode] ? node : minNode
        ), nodes[0]);

        nodes.splice(nodes.indexOf(currentNode), 1);
        const neighbors = adjacencyList[currentNode];

        for (const neighbor of neighbors) {
            const tentativeDistance = distances[currentNode] + 1; // Assuming all edges have weight 1

            if (tentativeDistance < distances[neighbor]) {
                distances[neighbor] = tentativeDistance;
                previous[neighbor] = currentNode;
            }
        }

        visited.add(currentNode);
    }

    return { distances, previous };
}

export const findShortestPath = (distances, previous, startNode, endNode) => {
    console.log(distances)
    console.log(previous)
    console.log({startNode, endNode})
    console.log(distances[startNode])
    console.log(distances[endNode])
    // if (!distances[startNode] || !distances[endNode]) {
    //     return []; // Either startNode or endNode does not exist
    // }

    const path = [];
    let currentNode = endNode;

    while (currentNode !== startNode) {
        if (!previous[currentNode]) {
            return []; // No path exists between startNode and endNode
        }
        path.unshift(currentNode);
        currentNode = previous[currentNode];
    }

    path.unshift(startNode);
    return path;
}


export const removeNodes = (adjacencyList, nodesToRemove) => {
    const updatedAdjacencyList = { ...adjacencyList };

    nodesToRemove.forEach(nodeToRemove => {
        // Step 1: Remove the node
        delete updatedAdjacencyList[nodeToRemove];

        // Step 2: Remove references from top, bottom, left, right neighbors
        const [row, col] = nodeToRemove.split('-');
        const neighbors = [
            `${parseInt(row, 10) + 1}-${col}`, // Bottom neighbor
            `${parseInt(row, 10) - 1}-${col}`, // Top neighbor
            `${row}-${parseInt(col, 10) + 1}`, // Right neighbor
            `${row}-${parseInt(col, 10) - 1}`  // Left neighbor
        ];

        neighbors.forEach(neighbor => {
            if (updatedAdjacencyList[neighbor]) {
                updatedAdjacencyList[neighbor] = updatedAdjacencyList[neighbor].filter(n => n !== nodeToRemove);
            }
        });
    });

    return updatedAdjacencyList;
}