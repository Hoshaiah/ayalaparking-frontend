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

export const findNearestParking = (distances, nodeOccupancy, vehicleSize, prioritizeCost) => {

    // Filter nodes
    let parkingNodes = Object.entries(nodeOccupancy)
        .filter(([key, value]) => {
            if(vehicleSize==='small') {
                return ['small','medium','large'].includes(value.parking)
            } else if (vehicleSize === 'medium') {
                return ['medium','large'].includes(value.parking)
            } else if(vehicleSize === 'large') {
                return ['large'].includes(value.parking)
            }
        })
        .filter(([key, value]) => nodeOccupancy[key].parkedCar === '')
        .filter(([key, value]) => distances[key] !== Infinity)
        .map(([key, value]) => (
            {
                node: key,
                parking: value.parking,
                distance: distances[key]
            }));

    // Sort nodes
    const sizeOrder = { small: 1, medium: 2, large: 3 };
    if(prioritizeCost) {
        parkingNodes = parkingNodes.sort((a, b) => {
            const sizeA = sizeOrder[a.parking];
            const sizeB = sizeOrder[b.parking];
        
            if (sizeA !== sizeB) {
              return sizeA - sizeB;
            }
        
            return a.distance - b.distance;
        });
        return parkingNodes
    }

    parkingNodes = parkingNodes.sort((a, b) => {
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
      
        const sizeA = sizeOrder[a.parking];
        const sizeB = sizeOrder[b.parking];
      
        return sizeA - sizeB;
    });
    return parkingNodes
}