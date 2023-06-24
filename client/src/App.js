import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import Home from './pages/Home'
import Chat from './pages/Chat'
import Signup from './pages/Signup'
import {useState} from 'react'
import io from 'socket.io-client'


const socket = io.connect('http://localhost:4000')

function App() {
  const [username, setUsername] = useState('')
  return (
    <Router>
      <div className='App'>
        <Routes>

          <Route 
          path = '/' 
          element = {
            <Home username = {username} setUsername = {setUsername} socket = {socket}/>
          }/>

          <Route
            path = '/chat'
            element = {<Chat username = {username} socket = {socket}/>}
          />

          <Route path = '/signup' element = {<Signup/>}/>
        </Routes>
      </div>
    </Router>

  );
}

export default App;
