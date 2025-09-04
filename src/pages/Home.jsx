import React, { useEffect, useState } from 'react'
import { PostCard, Container } from '../components'
import services from '../appwrite/config'


function Home() {

    const [posts, setPosts] = useState([])
    
    useEffect(() => {
        services.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    if (posts.length === 0) {
        return (
            <div className="w-full py-16 text-center">
                <Container>
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-800">Welcome to the blog</h1>
                    <p className="mt-2 text-gray-600">No posts yet. {" "}
                        <span className="font-medium">Login</span> to create or view posts.
                    </p>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post.$id} {...post} />
                    ))}
                </div>
            </Container>
        </div>
    )



}

export default Home