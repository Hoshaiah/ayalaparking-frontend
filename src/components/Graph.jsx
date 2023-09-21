
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToSelectedNodes, removeAllSelectedNodes, removeToSelectedNodes, setCurrentView } from '../redux/viewSlice';
import { deepCompare } from '../utils/graphUtils';

const Graph = () => {
    const dispatch = useDispatch()
    const graphState= useSelector(state => state.graph)
    const viewState = useSelector(state => state.view)
    const [rows, setRows] = useState()
    

    const handleNodeClick = (node, nodeIsSelected) => {
        if(viewState.currentView !== 'editView'){
            dispatch(setCurrentView('editView'))
        }
        if(!nodeIsSelected) {
            dispatch(addToSelectedNodes(node))
        } else {
            dispatch(removeToSelectedNodes(node))
        }
    }

    const determineNodeParkingColor = (nodeOccupancy, node) => {
        if(!nodeOccupancy[node]) {
            return ''
        }

        if(nodeOccupancy[node].parking === 'blocked') {
            return 'bg-black'
        }

        if(nodeOccupancy[node].parking === 'small') {
            return 'bg-red-200'
        }

        if(nodeOccupancy[node].parking === 'medium') {
            return 'bg-green-500'
        }
        if(nodeOccupancy[node].parking === 'large') {
            return 'bg-blue-700'
        }
        if(nodeOccupancy[node].entrance === true) {
            return 'bg-orange-700'
        }
        return ''
    }

    const determineNodeParkedCar = (nodeOccupancy, node) => {
        if(!nodeOccupancy[node] || !nodeOccupancy[node].parkedCar) {
            return ''
        } 


        if(nodeOccupancy[node].parkedCar === 'small'){
            return 'S'
        }

        if(nodeOccupancy[node].parkedCar === 'medium'){
            return 'M'
        }
        if(nodeOccupancy[node].parkedCar === 'large'){
            return 'L'
        }

        return ''
    }


    useEffect(() => {
        const mapNodes = () => {
            const shortestPath = new Set(graphState.shortestPath)
            const selectedNodes = new Set(viewState.selectedNodes)
            const nodeOccupancy = graphState.nodeOccupancy
            const adjacencyList = graphState.adjacencyList
            const gridSize = Math.sqrt(Object.keys(adjacencyList).length);
            const rowToSet = Array.from({ length: gridSize }, (_, rowIndex) => {
                const nodesInRow = Object.keys(adjacencyList).filter(node => {
                    const [row] = node.split('-');
                    return parseInt(row, 10) === rowIndex;
                });
        
                return (
                    <div key={rowIndex} className="flex flex-col-reverse">
                        {nodesInRow.map(node => {
                            const [row, col] = node.split('-');
                            const nodeInShortestPath = shortestPath.has(node)
                            const nodeIsSelected = selectedNodes.has(node)
                            const nodeParkingColor = determineNodeParkingColor(nodeOccupancy, node) 
                            return (
                                <div onClick={() => {handleNodeClick(node, nodeIsSelected)}} key={node} className={`border-black border w-12 h-12 flex flex-col items-center justify-between cursor-pointer 
                                ${nodeInShortestPath && viewState.currentView === 'parkView' ? 'bg-yellow-300' : ''}
                                ${nodeParkingColor}
                                ${viewState.currentView === "editView" && nodeIsSelected ? 'border-2 border-yellow-400': ''}
                                `} >
                                    <div className='h-4 text-lg flex justify-center items-center pt-5'>{determineNodeParkedCar(nodeOccupancy, node)}</div>
                                    {/* <div className='h-8 text-lg'>{'S'}</div> */}
                                    <div className='text-[0.7rem] h-4'>{node}</div>
                                </div>
                            );
                        })}
                    </div>
                );
            });
            setRows(rowToSet)
            // console.log(deepCompare(graphState.originalAdjacencyList, graphState.adjacencyList))
            // console.log(graphState.originalAdjacencyList)
            // console.log(graphState.adjacencyList)
        }
        mapNodes()
    }, [graphState.shortestPath, viewState.selectedNodes, graphState.nodeOccupancy, graphState.adjacencyList, viewState.currentView])


    return (
        <div className="flex flex-row border-black border w-fit h-fit text-xs">
            {rows}
        </div>
    );
};

export default Graph;
