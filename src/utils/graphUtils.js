
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