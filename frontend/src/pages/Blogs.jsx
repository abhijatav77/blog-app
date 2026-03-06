import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const Blogs = () => {
  const {blogs} = useAuth()
  return (
    <div>
      <div className='container mx-auto my-6 p-4'>
        <h1 className='text-2xl font-bold mb-6'>All blogs goes here!</h1>
        <p className='text-center mb-8'>The concept of food reflects culture, tradition, identity, and the way communities connect and celebrate life.</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {blogs && blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <Link 
                to={`/blog/${blog._id}`}
                key={index}
                className='relative rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300'
                >
                  <img src={blog.blogImage.url} alt={blog.title} className='w-full h-48 object-cover' />
                  <div className='absolute inset-0 bg-black opacity-30'></div>
                  <div className='absolute bottom-4 left-4 text-white'>
                    <h2 className='text-lg font-semibold '>{blog.title}</h2>
                  </div>
              </Link>
            ))
          ) : ( <div></div> )}
        </div>
      </div>
    </div>
  )
}

export default Blogs