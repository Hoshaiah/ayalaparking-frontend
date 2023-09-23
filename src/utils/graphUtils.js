
export const blockNodes = (adjacencyList, nodesToRemove) => {
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
            const nodeIsNotBlocked = !runningNodeOccupancy[neighbor] || !['small','medium','large','blocked'].includes(runningNodeOccupancy[neighbor].parkedCar)
            const nodeIsNotEntrance = !runningNodeOccupancy[neighbor] || !runningNodeOccupancy[neighbor].entrance
            if(nodeIsNotBlocked && updatedAdjacencyList[neighbor] && nodeIsNotEntrance){
                if(!updatedAdjacencyList[nodeToAdd].includes(neighbor)){
                    updatedAdjacencyList[nodeToAdd] = [...updatedAdjacencyList[nodeToAdd], neighbor]
                }
            }
        })
        
        // Step 2: Reconnect top, bottom, left, right neighbors to node
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

export const turnNodesToParking = (adjacencyList, nodesToDisconnect, nodeOccupancy) => {
    let updatedAdjacencyList = {...adjacencyList} 
    let runningNodeOccupancy = {...nodeOccupancy}
    const resetNodesData = resetNodes(updatedAdjacencyList, nodesToDisconnect, runningNodeOccupancy)
    updatedAdjacencyList = resetNodesData.updatedAdjacencyList
    runningNodeOccupancy = resetNodesData.runningNodeOccupancy

    nodesToDisconnect.forEach(nodeToDisconnect => {
        updatedAdjacencyList[nodeToDisconnect] = []
    })
    return updatedAdjacencyList;
}

export const turnNodestoEntrance= (adjacencyList, nodesToDisconnect, nodeOccupancy) => {
    let updatedAdjacencyList = {...adjacencyList} 
    let runningNodeOccupancy = {...nodeOccupancy}
    const resetNodesData = resetNodes(updatedAdjacencyList, nodesToDisconnect, runningNodeOccupancy)
    updatedAdjacencyList = resetNodesData.updatedAdjacencyList
    runningNodeOccupancy = resetNodesData.runningNodeOccupancy

    nodesToDisconnect.forEach( nodeToDisconnect => {
        const [row, col] = nodeToDisconnect.split('-');
        const neighbors = [
            `${parseInt(row, 10) + 1}-${col}`, // Bottom neighbor
            `${parseInt(row, 10) - 1}-${col}`, // Top neighbor
            `${row}-${parseInt(col, 10) + 1}`, // Right neighbor
            `${row}-${parseInt(col, 10) - 1}`  // Left neighbor
        ];

        neighbors.forEach(neighbor => {
            if (updatedAdjacencyList[neighbor]) {
                updatedAdjacencyList[neighbor] = updatedAdjacencyList[neighbor].filter(n => n !== nodeToDisconnect);
            }
        });
    })
    return updatedAdjacencyList;
}

export const countNumberOfEntrances = (nodes, occupancy) => {
    let count = 0;
    let nodeKeys = [...nodes]
    if(nodes.length === 0) {
        nodeKeys = Object.keys(occupancy)
    }
    nodeKeys.forEach(node => {
        if (occupancy[node] && occupancy[node].entrance === true) {
            count++;
        }
    });
    return count;
}

export const getEntranceNodes = (occupancy) => {
    const filteredNodes = Object.entries(occupancy)
        .filter(([key, value]) => value.entrance === true)
        .map(([key, value]) => key);

    return filteredNodes
}

export const getParkedCarNodes= (occupancy) => {
    const filteredNodes = Object.entries(occupancy)
        .filter(([key, value]) => ['small','medium','large'].includes(value.parkedCar))
        .map(([key, value]) => key);

    return filteredNodes
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
