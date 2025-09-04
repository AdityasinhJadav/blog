import React from 'react'
import services from '../appwrite/config'
import {Link} from 'react-router-dom'

function PostCard({ $id, title, featuredImage }) {
  const previewUrl = services.getPreview(featuredImage)

  return (
    <Link to={`/post/${$id}`}>
      <div className='w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'>
        <div className='w-full aspect-[16/10] bg-gray-100 overflow-hidden'>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={title}
              className='w-full h-full object-cover'
              loading='lazy'
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-400'>
              <span className='text-sm'>No image</span>
            </div>
          )}
        </div>
        <div className='p-4'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 line-clamp-2'>{title}</h2>
        </div>
      </div>
    </Link>
  )
}


export default PostCard