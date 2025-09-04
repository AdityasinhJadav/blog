import React from 'react'
import {Container,Logo,LogoutBtn}  from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
function Header() {
    const authStatus=useSelector((state)=> state.auth.status)

    const navItem = React.useMemo(() => [
        {
            name: 'Home',
            slug: '/',
            active: true
        },
        {
            name: "Login",
            slug: '/login',
            active: !authStatus
        },
        {
            name: "Signup",
            slug: '/signup',
            active: !authStatus
        },
        {
            name: 'All Posts',
            slug: '/all-posts',
            active: authStatus
        },
        {
            name: 'Add Post',
            slug: '/add-post',
            active: authStatus
        }
    ], [authStatus])

  return (
    <header className='sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200'>
        <Container>
            <nav className='flex h-16 items-center'>
                <div className='mr-4'>
                    <Link to='/'>
                    <Logo width='70px'/>
                    </Link>
                </div>

                <ul className='flex ml-auto items-center gap-1'>
                    {navItem.map((item) => 
                        item.active ? (
                            <li key={item.name}>
                                <Link 
                                    to={item.slug}
                                    className='inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-lg'
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ) : null
                    )}
                    {authStatus && (
                        <li>
                            <LogoutBtn/>
                        </li>
                    )}

                </ul>

            </nav>
        </Container>

    </header>
  )
}

export default Header