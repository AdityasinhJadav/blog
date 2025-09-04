import React from 'react'
import { useDispatch } from 'react-redux'
import authservice  from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogoutBtn() {
    const dispatch=useDispatch()

    const logoutHandler=()=>{
        authservice.logout()
        .then(()=>{
            dispatch(logout())
        })
    }

  return (
    <button 
        className='inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-lg'
        onClick={logoutHandler}
    >
        Log out
    </button>
  )
}

export default LogoutBtn