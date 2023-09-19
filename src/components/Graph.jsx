
import React, { useState } from 'react';

const Graph = ({ adjacencyList }) => {
    const gridSize = Math.sqrt(Object.keys(adjacencyList).length);

    const rows = Array.from({ length: gridSize }, (_, rowIndex) => {
        const nodesInRow = Object.keys(adjacencyList).filter(node => {
            const [row] = node.split('-');
            return parseInt(row, 10) === rowIndex;
        });

        return (
            <div key={rowIndex} className="flex flex-col-reverse">
                {nodesInRow.map(node => {
                    const [row, col] = node.split('-');
                    const left = col * 50; // Assuming each node is 50px wide
                    const top = (gridSize - 1 - row) * 50; // Reverse row order and assuming each node is 50px tall

                    return (
                        <button key={node} className="border-black border w-8 h-8 flex items-center justify-center" >
                            {/* {node} */}
                        </button>
                    );
                })}
            </div>
        );
    });

    return (
        <div className="flex flex-row border-black border w-fit">
            {rows}
        </div>
    );
};

export default Graph;
