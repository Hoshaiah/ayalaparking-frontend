import './App.css';
import Graph from './components/Graph';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import SideNav from './components/SideNav/SideNav';
import HistoryPane from './components/History/HistoryPane';
function App() {
  const graphState = useSelector(state => state.graph)
  const history = useSelector(state => state.history)

  useEffect(() => {
    const updateLocalStorageAdjacencyList = () => {
      localStorage.setItem('adjacencyList', JSON.stringify(graphState.adjacencyList))
    }
    updateLocalStorageAdjacencyList()
  }, [graphState.adjacencyList])

  useEffect(() => {
    const updateLocalStorageNodeOccupancy = () => {
      localStorage.setItem('nodeOccupancy', JSON.stringify(graphState.nodeOccupancy))
    }
    updateLocalStorageNodeOccupancy()
  }, [graphState.nodeOccupancy])

  useEffect(() => {
    const updateLocalStorageCarHistory = () => {
      localStorage.setItem('carHistory', JSON.stringify(history.carHistory))
    }
    updateLocalStorageCarHistory()
  }, [history.carHistory])
  

  return (
    <div className="flex flex-col items-center">
      <div className='fixed top-0 w-full h-12 bg-gradient-to-r from-pink to-sandy flex items-center pl-4'>
        <h1 className="text-3xl font-bold text-white">Ayala Parking</h1>
      </div>
      <div className="fixed top-12 flex flex-row w-full">
        <SideNav/>
        <Graph />
        <HistoryPane/>
      </div>
    </div>
  );
}

export default App;
