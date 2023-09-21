
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
            const nodeIsNotBlocked = !runningNodeOccupancy[neighbor] || (runningNodeOccupancy[neighbor].parkedCar && !['small','medium','large','blocked'].includes(runningNodeOccupancy[neighbor].parkedCar))
            if(nodeIsNotBlocked && updatedAdjacencyList[neighbor]){
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
    updatedAdjacencyList = resetNodes(updatedAdjacencyList, nodesToDisconnect, runningNodeOccupancy).updatedAdjacencyList
    runningNodeOccupancy = resetNodes(updatedAdjacencyList, nodesToDisconnect, runningNodeOccupancy).runningNodeOccupancy

    nodesToDisconnect.forEach(nodeToDisconnect => {
        updatedAdjacencyList[nodeToDisconnect] = []
    })
    return updatedAdjacencyList;
}

export const turnNodestoEntrance= (adjacencyList, nodesToDisconnect, nodeOccupancy) => {
    let updatedAdjacencyList = {...adjacencyList} 
    let runningNodeOccupancy = {...nodeOccupancy}
    updatedAdjacencyList = resetNodes(updatedAdjacencyList, nodesToDisconnect, runningNodeOccupancy).updatedAdjacencyList
    runningNodeOccupancy = resetNodes(updatedAdjacencyList, nodesToDisconnect, runningNodeOccupancy).runningNodeOccupancy

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

export const calculateHourDifference = (dateString1, dateString2) => {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    if (date2 < date1) {
       return -1 
    }

    const differenceInMilliseconds = Math.abs(date2 - date1);
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

    return differenceInHours;
}

export const calculateParkingCost = (hours, parkingSize) => {
    const parkingPrices = {
        small: 20,
        medium: 60,
        large: 100
    }
    let costBreakdown = {}
    let runningHour = hours
    if(runningHour <= 3) {
         costBreakdown = {
             flatHours: Math.ceil(runningHour),
             flatHourTotal: 40,

             total: 40,
             totalHours: Math.round(hours*100)/100
         }
         return costBreakdown
    } 
    if(hours <= 24) {
        runningHour -= 3
        const continuousTotal = Math.ceil(runningHour) * parkingPrices[parkingSize]
        costBreakdown = {
            flatHours: 3,
            flatHourTotal: 40,

            continuousHours: Math.ceil(runningHour),
            continuousTotal: continuousTotal,

            parkingSize: parkingSize,
            total: 40 + continuousTotal,
            totalHours: Math.round(hours*100)/100
        }
        return costBreakdown
    }

    if(hours> 24) {
        const numberOfFullDaysParked = Math.floor(runningHour/24)
        const fullDayCosts = numberOfFullDaysParked * 5000
        runningHour -= numberOfFullDaysParked * 24
        
        const continuousTotal = Math.ceil(runningHour) * parkingPrices[parkingSize]
        costBreakdown = {
            numberOfFullDays: numberOfFullDaysParked,
            fullDayCosts: fullDayCosts,

            continuousHours: Math.ceil(runningHour),
            continuousTotal: continuousTotal,

            parkingSize: parkingSize,
            total: fullDayCosts + continuousTotal,
            totalHours: Math.round(hours*100)/100
        }
        return costBreakdown
    }
}

export const getDateTimeNow = () => {
    const now = new Date();
    const year = now.getFullYear().toString().padStart(4, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    const initialDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    return initialDateTime
}

export const validateDateFormat = (input) => {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    return regex.test(input);
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
