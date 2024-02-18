import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import './App.css';
import { RoomProvider } from './context/RoomContext';

function App() {
  return (
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </RoomProvider>
    </BrowserRouter>
  )
}

export default App
