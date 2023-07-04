import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import Home from './pages/Home'
import Chat from './pages/Chat'
import Signup from './pages/Signup'
import ProtectedRoutes from './components/ProtectedRoutes';
import io from 'socket.io-client'
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const socket = io.connect('https://phuc-chatroom-app.onrender.com/')

function App() {
  const [username, setUsername] = useLocalStorage('username', '');
  useEffect(() => {
    document.title = 'Online Chatroom';
  }, [])
  return (
    <Router>
      <div className='App'>
        <Routes>

          <Route 
          path = '/' 
          element = {
            <Home username = {username} setUsername = {setUsername} socket = {socket}/>
          }/>


          <Route path = '/signup' element = {<Signup/>}/>

          <Route element = {<ProtectedRoutes/>}>
            <Route
              path = '/chat'
              element = {<Chat username = {username} socket = {socket}/>}
            />
          </Route>
        </Routes>
      </div>
    </Router>

  );
}

export default App;
