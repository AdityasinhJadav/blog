import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Protected from './components/AuthLayout.jsx'

import AddPost from './pages/AddPost.jsx'
import Login from './pages/Login'
import Signup from './pages/Signup.jsx'
import AllPosts from './pages/AllPosts.jsx'
import EditPost from './pages/EditPost.jsx'
import Post from './pages/Post.jsx'
import Home from './pages/Home.jsx'

const router=createBrowserRouter([{
  path:'/', 
  element:<App />,
  children:[
    {
      path:'/',
      element:<Home />
    },
    {
      path:'/login',
      element:(
        <Protected authentication={false}>
          <Login />
        </Protected>
      )
    },
    {
      path:'/signup',
      element:(
        <Protected authentication={false}>
          <Signup />
        </Protected>
      )
    },
    {
      path:'/all-posts',
      elements:(
        <Protected authentication={true}>
          {' '}
          <AllPosts />
        </Protected>
      )
    },
    {
      path:'add-post',
      element:(
        <Protected authentication={true}>
          {' '}
          <AddPost />
        </Protected>
      )
    },
    {
      post:'/edit-post/:slug',
      element:(
        <Protected authentication={true}>
          {' '}
          <EditPost />
        </Protected>
      )
    },
    {
      path:'/post/:slug',
      element: <Post/>,
    }
    
  ]
}])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
