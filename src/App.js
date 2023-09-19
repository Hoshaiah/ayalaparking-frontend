import logo from './logo.svg';
import './App.css';
import { createAdjacencyList, dijkstra, findShortestPath } from './utils/graphUtils';
import Graph from './components/Graph';
import { useDispatch, useSelector } from 'react-redux';
import { setAdjacencyList, setShortestPath } from './redux/graphSlice';
import { useEffect } from 'react';
function App() {
  const dispatch = useDispatch()
  const graphState = useSelector(state => state.graph)
  
  useEffect(() => {
    const adjacencyList = createAdjacencyList(15)
    const data = dijkstra(adjacencyList, "0-0")
    const shortestPath = findShortestPath(data.distances, data.previous, "0-0","0-1")
    dispatch(setAdjacencyList(adjacencyList))
    dispatch(setShortestPath(shortestPath))

  }, [])

  
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-400">Hellow orld</h1>
      <Graph adjacencyList={graphState.adjacencyList}/>
    </div>
  );
}

export default App;
