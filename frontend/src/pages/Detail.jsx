import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { useParams } from 'react-router-dom'
import { BACKEND_URL } from '../utils/utils'

const Detail = () => {

    const { id } = useParams()
    const [blogs, setBlogs] = useState({})


    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_URL}/blogs/single-blog/${id}`, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                console.log(data)
                setBlogs(data)
            } catch (error) {
                console.log(error.message)
                toast.error(error.response?.data?.message || "Error occurred")
            }
        }
        fetchBlog()
    }, [id])

    return (
        <div>
            {blogs && (
                <section className='container mx-auto p-4'>
                    <div className='text-blue-500 uppercase text-xs font-bold mb-4'>
                        {blogs?.category}
                    </div>
                    <h1 className='text-4xl font-bold mb-6'>{blogs?.title}</h1>
                    <div>
                        <img 
                            src={blogs?.adminPhoto} 
                            alt="blog image" 
                            className='w-12 h-12 rounded-full mr-4'
                        />
                        <p className='text-lg font-semibold'>{blogs?.adminName}</p>
                    </div>

                    <div className='flex flex-col md:flex-row items-center2'>
                        {blogs?.blogImage && (
                            <img
                                src={blogs?.blogImage?.url} 
                                alt="blog image" 
                                className='md:w-1/2 w-full h-auto mb-6 rounded-lg shadow-lg cursor-pointer border'
                            />
                        )}
                        <div className='md:w-1/2 w-full md:pl-6'>
                            <p className='text-lg mb-6'>{blogs?.about}</p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default Detail