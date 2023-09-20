
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
        updatedAdjacencyList[nodeToRemove] = [];

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

export const resetNodes = (adjacencyList, nodesToAdd, nodeOccupancy) => {
    let updatedAdjacencyList = { ...adjacencyList };
    let runningNodeOccupancy = {...nodeOccupancy}

    nodesToAdd.forEach(nodeToAdd => {
        const [row, col] = nodeToAdd.split('-');

        const neighbors = [
            `${parseInt(row, 10) + 1}-${col}`, // Bottom neighbor
            `${parseInt(row, 10) - 1}-${col}`, // Top neighbor
            `${row}-${parseInt(col, 10) + 1}`, // Right neighbor
            `${row}-${parseInt(col, 10) - 1}`  // Left neighbor
        ];
        // Step 1: Add adjacent neighbors to node back
        neighbors.forEach(neighbor => {
            const nodeIsNotBlocked = !runningNodeOccupancy[neighbor] || (runningNodeOccupancy[neighbor].parking && runningNodeOccupancy[neighbor].parking !== 'blocked')
            if(nodeIsNotBlocked && updatedAdjacencyList[neighbor]){
                if(!updatedAdjacencyList[nodeToAdd].includes(neighbor)){
                    updatedAdjacencyList[nodeToAdd] = [...updatedAdjacencyList[nodeToAdd], neighbor]
                }
            }
        })
        
        // Step 2: Reconnect with top, bottom, left, right neighbors to node
        neighbors.forEach(neighbor => {
            if (updatedAdjacencyList[neighbor]) {
                const nodeIsNotBlockedOrParking = !runningNodeOccupancy[neighbor] || !runningNodeOccupancy[neighbor].parking
                if (!updatedAdjacencyList[neighbor].includes(nodeToAdd) && nodeIsNotBlockedOrParking) {
                    updatedAdjacencyList[neighbor] = [
                        ...updatedAdjacencyList[neighbor],
                        nodeToAdd
                    ]
                }
            }
        });
        delete runningNodeOccupancy[nodeToAdd]
    });

    return {updatedAdjacencyList, runningNodeOccupancy};
};

export const disconnectNodeToOutgoing = (adjacencyList, nodesToDisconnect, nodeOccupancy) => {
    let updatedAdjacencyList = {...adjacencyList} 
    let runningNodeOccupancy = {...nodeOccupancy}
    updatedAdjacencyList = resetNodes(updatedAdjacencyList, nodesToDisconnect, runningNodeOccupancy).updatedAdjacencyList
    runningNodeOccupancy = resetNodes(updatedAdjacencyList, nodesToDisconnect, runningNodeOccupancy).runningNodeOccupancy

    nodesToDisconnect.forEach(nodeToDisconnect => {
        updatedAdjacencyList[nodeToDisconnect] = []
    })
    return updatedAdjacencyList;
}

export const deepCompare = (obj1, obj2, path = '') => {
    // Check if both inputs are arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        // Sort the arrays to ignore order
        const sortedObj1 = [...obj1].sort();
        const sortedObj2 = [...obj2].sort();

        if (JSON.stringify(sortedObj1) !== JSON.stringify(sortedObj2)) {
            return { [path]: { obj1, obj2 } };
        }

        return {};
    }

    // Check if both inputs are objects
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        const differences = {};

        for (const key of keys1) {
            const newPath = path ? `${path}.${key}` : key;
            if (!keys2.includes(key)) {
                differences[newPath] = { obj1: obj1[key], obj2: undefined };
            } else {
                const nestedDifferences = deepCompare(obj1[key], obj2[key], newPath);
                if (Object.keys(nestedDifferences).length > 0) {
                    Object.assign(differences, nestedDifferences);
                }
            }
        }

        for (const key of keys2) {
            if (!keys1.includes(key)) {
                const newPath = path ? `${path}.${key}` : key;
                differences[newPath] = { obj1: undefined, obj2: obj2[key] };
            }
        }

        return differences;
    }

    // If not objects or arrays, compare values directly
    if (obj1 !== obj2) {
        return { [path]: { obj1, obj2 } };
    }

    return {};
}
