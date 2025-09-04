import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import {login , logout} from './store/authSlice'
import authservice from './appwrite/auth'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
 


function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authservice.getCurrentUser()
      .then((userData) => {
        if (userData) {
          console.log("User data found:", userData);
          dispatch(login(userData))
        } else {
          console.log("No user data found");
          dispatch(logout())
        }
      })
      .catch((error) => {
        console.error("Auth error:", error);
        dispatch(logout())
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return !loading ? (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header/>
      <main className="flex-1 py-6">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  ) : null

  
}

export default App
