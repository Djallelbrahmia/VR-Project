
import { Route, Routes } from 'react-router-dom'
import './App.css'
import HanoiContainer from './components/hanoi/HanoiContainer'
import HanoiContainerVR from './components/hanoi-vr/HanoiContainer'
import { DiskProvider } from './contexts/DiskContext'

function App() {

  return (
    <Routes>
      <Route path='/' element={<HanoiContainer/>}/>
      <Route path='/vr' element={<HanoiContainerVR/>}/>





    </Routes>
  )
}

export default App
