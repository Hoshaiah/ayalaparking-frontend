import logo from './logo.svg';
import './App.css';
import { createAdjacencyList, dijkstra, findShortestPath, removeNodes } from './utils/graphUtils';
import Graph from './components/Graph';
import { useDispatch, useSelector } from 'react-redux';
import { setAdjacencyList, setOriginalAdjacencyList, setShortestPath } from './redux/graphSlice';
import { useEffect } from 'react';
import SideNav from './components/SideNav';
function App() {
  const dispatch = useDispatch()
  const graphState = useSelector(state => state.graph)
  
  useEffect(() => {
    const adjacencyList = createAdjacencyList(15)
    // const updatedAdjacencyList = removeNodes(adjacencyList, ["3-1","4-1","4-0","14-1","13-0"])
    // const data = dijkstra(updatedAdjacencyList, "0-0")
    // const shortestPath = findShortestPath(data.distances, data.previous, "0-0","12-0")
    // console.log(shortestPath)
    dispatch(setOriginalAdjacencyList(adjacencyList))
    dispatch(setAdjacencyList(adjacencyList))
    // dispatch(setShortestPath(shortestPath))

  }, [])

  
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-400">Hello world</h1>
      <div className="flex flex-row w-full h-full">
        <SideNav/>
        <div className="h-[calc(100vh-36px)] w-full bg-slate-100 flex justify-center pt-20 ">
          <Graph />
        </div>
      </div>
    </div>
  );
}

export default App;
