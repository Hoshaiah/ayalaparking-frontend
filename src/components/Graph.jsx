
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToSelectedNodes, removeToSelectedNodes, setCurrentView } from '../redux/viewSlice';
import { setShortestPath } from '../redux/graphSlice';
import { determineNodeParkedCar } from '../utils/graphUtils';

const Graph = () => {
    const dispatch = useDispatch()
    const graphState= useSelector(state => state.graph)
    const viewState = useSelector(state => state.view)
    const [rows, setRows] = useState()
    

    const handleNodeClick = (node, nodeIsSelected) => {
        if(graphState.nodeOccupancy[node] && ['small','medium','large'].includes(graphState.nodeOccupancy[node].parkedCar)) {
            return;
        }

        if(viewState.currentView !== 'editView'){
            dispatch(setCurrentView('editView'))
            dispatch(setShortestPath([]))
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
        let nodeDesign = ''
        if(nodeOccupancy[node].parking === 'blocked') {
            nodeDesign += 'bg-tree '
        }

        if(nodeOccupancy[node].parking === 'small') {
            nodeDesign += 'bg-saffron '
        }

        if(nodeOccupancy[node].parking === 'medium') {
            nodeDesign += 'bg-sandy '
        }
        if(nodeOccupancy[node].parking === 'large') {
            nodeDesign += 'bg-pink '
        }
        if(nodeOccupancy[node].entrance === true) {
            nodeDesign += 'bg-teal '
        }

        const graphShortestPath = graphState.shortestPath || []
        const destintation = graphShortestPath[graphShortestPath.length-1]
        const origin = graphShortestPath[0]

        if(destintation && destintation === node){
            nodeDesign += 'animate-pulse '
        }

        if(origin && origin === node) {
            nodeDesign +=' border-4 border-ice '
        }

       return nodeDesign
    }

    useEffect(() => {
        const mapNodes = () => {
            const shortestPath = new Set(graphState.shortestPath.slice(1,-1))
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
                                <div 
                                    onClick={() => {handleNodeClick(node, nodeIsSelected)}}
                                    key={node}
                                    className={`border-black border w-10 h-10 flex flex-col items-center justify-between cursor-pointer 
                                        ${nodeInShortestPath && viewState.currentView === 'parkView' ? 'bg-ice' : ''}
                                        ${nodeParkingColor}
                                        ${viewState.currentView === "editView" && nodeIsSelected ? 'border-ice border-4': ''}
                                    `}>
                                    <div className='h-4 text-lg flex justify-center items-center pt-[8px] select-none'>
                                        {determineNodeParkedCar(nodeOccupancy, node)}
                                    </div>
                                    <div className='text-[0.6rem] h-4 select-none'>
                                        {node}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            });
            setRows(rowToSet)
        }
        mapNodes()
    }, [graphState.shortestPath, viewState.selectedNodes, graphState.nodeOccupancy, graphState.adjacencyList, viewState.currentView])


    return (
        <div className="w-full bg-slate-100 flex justify-center pt-10">
            <div className="flex flex-row border-black border w-fit h-fit text-xs">
                {rows}
            </div>
        </div>
    );
};

export default Graph;
