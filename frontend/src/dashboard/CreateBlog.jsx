import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BACKEND_URL } from '../utils/utils'

const CreateBlog = () => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [about, setAbout] = useState("")

  const [blogImage, setBlogImage] = useState("")
  const [imagePreview, setImagePreview] = useState("")

  const changeImageHandler = (e) => {
    console.log(e)
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImagePreview(reader.result)
      setBlogImage(file)
    }
  }

  const handleCreateBlog = async(e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title',title)
    formData.append('category',category)
    formData.append('about',about)
    formData.append('blogImage',blogImage)
    try {
      const {data} = await axios.post(`${BACKEND_URL}/blogs/create`, formData,{
        withCredentials:true,
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      console.log(data)
      toast.success(data.message || "Blog post successfully" )
      setCategory("")
      setTitle("")
      setAbout("")
      setBlogImage("")
      setImagePreview("")
    } catch (error) {
      console.log(error)
      toast.error(error.message || "Error in blog posting")
    }
  } 


  return (
    <div>
      <div className='min-h-screen py-5'>
        <div className='max-w-xl mx-auto p-6 border border-gray-200 rounded-lg shadow-lg'>
            <h3 className='font-semibold text-2xl mb-5'>Create Blog</h3>
          <form onSubmit={handleCreateBlog} className='space-y-4'>
           <div className='space-y-2'>
             <label className='block text-lg'>Category</label>
            <select
              value={category}  
              onChange={(e)=>setCategory(e.target.value)}
              className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none'
            >
              <option value="">Select Category</option>
              <option value="food">Food</option>
              <option value="technology">Technology</option>
              <option value="travel">Travel</option>
              <option value="fashion">Fashion</option>
              <option value="sports">Sports</option>
              <option value="book">Books</option>
              <option value="finance">Finance</option>
            </select>
           </div>
            <div className='space-y-2'>
              <label htmlFor="title" className='block text-lg'>Title</label>
              <input
               type="text" 
               id='title'
               placeholder='Enter your blog title'
               value={title}
               onChange={(e)=>setTitle(e.target.value)}
               className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none'
              />
            </div>
            <div className='space-y-2'>
            <label className='block text-lg'>Blog Image</label>
              <div className='flex items-center justify-center'>
                <img 
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="Image" 
                  className='w-full max-w-sm h-auto rounded-md object-cover'  
                />
              </div>
                <input 
                  type="file" 
                  onChange={changeImageHandler}
                  className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none'
                />
            </div>
            <div className='space-y-2'>
              <label htmlFor="about" className='block text-lg'>About</label>
              <textarea 
                rows='5' 
                placeholder='Write Something about your blog'
                value={about}
                onChange={(e)=>setAbout(e.target.value)}
                className='w-full px-3 py-2  border border-gray-400 rounded-md outline-none'
                id="about"
              />
            </div>
            
            <button
              type='submit'
              className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200'
            >
              Post Blog
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateBlog