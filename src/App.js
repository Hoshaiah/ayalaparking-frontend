import logo from './logo.svg';
import './App.css';
import { createAdjacencyList, dijkstra, findShortestPath, blockNodes } from './utils/graphUtils';
import Graph from './components/Graph';
import { useDispatch, useSelector } from 'react-redux';
import { setAdjacencyList, setGraphSize, setOriginalAdjacencyList, setShortestPath } from './redux/graphSlice';
import { useEffect } from 'react';
import SideNav from './components/SideNav/SideNav';
function App() {
  const dispatch = useDispatch()
  const graphState = useSelector(state => state.graph)
  
  useEffect(() => {
    const sizeOfGraph = 15
    const adjacencyList = createAdjacencyList(sizeOfGraph)
    dispatch(setGraphSize(sizeOfGraph))
    // const updatedAdjacencyList = blockNodes(adjacencyList, ["3-1","4-1","4-0","14-1","13-0"])
    // const data = dijkstra(updatedAdjacencyList, "0-0")
    // const shortestPath = findShortestPath(data.distances, data.previous, "0-0","12-0")
    // console.log(shortestPath)
    dispatch(setOriginalAdjacencyList(adjacencyList))
    dispatch(setAdjacencyList(adjacencyList))
    // dispatch(setShortestPath(shortestPath))

  }, [])

  
  return (
    <div className="flex flex-col items-center">
      <div className='fixed top-0 w-full h-12 bg-gradient-to-r from-pink to-sandy flex items-center pl-4'>
        <h1 className="text-3xl font-bold text-white">Ayala Parking</h1>
      </div>
      <div className="fixed top-12 flex flex-row w-full">
        <SideNav/>
        <Graph />
      </div>
    </div>
  );
}

export default App;
