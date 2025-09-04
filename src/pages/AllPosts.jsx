import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Query } from 'appwrite'
import services from '../appwrite/config'
import { PostCard, Container } from '../components'



function AllPosts() {
    const [posts, setPosts] = useState([])
    const user = useSelector((state) => state.auth.userData)

    useEffect(() => {
        // If user not logged in, clear posts
        if (!user?.$id) {
            setPosts([])
            return
        }

        const queries = [Query.equal('userId', user.$id)]
        services.getPosts(queries).then((res) => {
            if (res && Array.isArray(res.documents)) {
                setPosts(res.documents)
            } else {
                setPosts([])
            }
        })
    }, [user?.$id])

    return (
        <div className='w-full py-8'>
            <Container>
                {posts.length === 0 ? (
                    <div className="py-10 text-center text-gray-600">
                        No posts yet. Create your first post to see it here.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {posts.map((post) => (
                            <PostCard key={post.$id} {...post} />
                        ))}
                    </div>
                )}
            </Container>

        </div>
    )
}

export default AllPosts