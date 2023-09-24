import './App.css';
import Graph from './components/Graph';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import SideNav from './components/SideNav/SideNav';
import HistoryPane from './components/History/HistoryPane';
import { createGraph, getAllGraphNames, getGraph } from './services/graphServices';
import { setAdjacencyList, setAllNodeOccupancy } from './redux/graphSlice';
import { createAdjacencyList } from './utils/algorithmUtils';
import Constants from './constants/graphConstants';

function App() {
  const dispatch = useDispatch()
  const graphState = useSelector(state => state.graph)
  const history = useSelector(state => state.history)

  // useEffect(() => {
  //   const updateLocalStorageAdjacencyList = () => {
  //     localStorage.setItem('adjacencyList', JSON.stringify(graphState.adjacencyList))
  //   }
  //   updateLocalStorageAdjacencyList()
  // }, [graphState.adjacencyList])

  // useEffect(() => {
  //   const updateLocalStorageNodeOccupancy = () => {
  //     localStorage.setItem('nodeOccupancy', JSON.stringify(graphState.nodeOccupancy))
  //   }
  //   updateLocalStorageNodeOccupancy()
  // }, [graphState.nodeOccupancy])

  // useEffect(() => {
  //   const updateLocalStorageCarHistory = () => {
  //     localStorage.setItem('carHistory', JSON.stringify(history.carHistory))
  //   }
  //   updateLocalStorageCarHistory()
  // }, [history.carHistory])

  useEffect(() => {
      const intializeGraphNames = async () => {
        const graphNamesData =  await getAllGraphNames()
        if(!graphNamesData.success) {
          return;
        }

        // If there is no graph, create one
        if(graphNamesData.data.graphNames.length === 0){
          const newAdjacencyList = createAdjacencyList(Constants.defaultGraphSize)
          const createdGraphData = await createGraph(newAdjacencyList, {}, Constants.defaultGraphName)

          if(createdGraphData.success) {
              dispatch(setAdjacencyList(newAdjacencyList))
              dispatch(setAllNodeOccupancy({}))
            return;
          }
        }

        // If there is a graph, load it
        if(graphNamesData.data.graphNames[0]){
          const firstGraphData = await getGraph(graphNamesData.data.graphNames[0])
          if(firstGraphData.success) {
            dispatch(setAdjacencyList(firstGraphData.data.adjacencyList))
            dispatch(setAllNodeOccupancy(firstGraphData.data.nodeOccupancy))
            return; 
          }
        }
      }
      intializeGraphNames()
  },[])
  

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
