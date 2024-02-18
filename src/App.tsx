import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import { io } from 'socket.io-client';

const SocketUrl = import.meta.env.VITE_SOCKET_URL;

const socket = io(SocketUrl);

function App() {
  const [count, setCount] = useState(0);

  socket.emit('connected', "socket is connected");

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("recieved message from server:", message);
    })
  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          {SocketUrl}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
