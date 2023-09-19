import logo from './logo.svg';
import './App.css';
import { createAdjacencyList } from './utils/graphUtils';
import Graph from './components/Graph';


function App() {
  const adjacencyList = createAdjacencyList(10)
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-400">Hellow orld</h1>
      <Graph adjacencyList={adjacencyList}/>
    </div>
  );
}

export default App;
