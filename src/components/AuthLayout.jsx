import React ,{useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Protected({children,authentication=true}) {
    const navigate=useNavigate()
    const [loader,SetLoader]=useState(true)
    const authStatus= useSelector(state=>state.auth.status)

    useEffect(()=>{
        if (authentication && authentication !== authStatus){
            navigate('/login')
        }
        else if (!authentication && authentication !== authStatus ){
            navigate('/')
        }
        SetLoader(false)
    },[navigate,authStatus,authentication])



  return loader ? <h1>Loading...</h1> : <>{children}</>
}
