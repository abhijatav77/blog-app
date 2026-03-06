import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { BACKEND_URL } from '../utils/utils'

const UpdateBlog = () => {
  const { id } = useParams()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [about, setAbout] = useState("")

  const [blogImage, setBlogImage] = useState("")
  const [imagePreview, setImagePreview] = useState("")

  const navigate = useNavigate()

  const changeImageHandler = (e) => {
    // console.log(e)
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImagePreview(reader.result)
      setBlogImage(file)
    }
  }

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
        setCategory(data.category)
        setTitle(data.title)
        setAbout(data.about)
        setBlogImage(data.blogImage.url)
      } catch (error) {
        console.log(error.message)
        toast.error(error.response?.data?.message || "Error occurred")
      }
    }
    fetchBlog()
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('category', category)
    formData.append('about', about)
    formData.append('blogImage', blogImage)
    try {
      const { data } = await axios.put(`${BACKEND_URL}/blogs/update/${id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      console.log(data)
      toast.success(data.message || "Blog updated successfully")
      navigate("/dashboard")
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Error occurred")
    }
  }

  return (
    <div>
      <div className='container mx-auto my-12 p-4'>
        <section className='max-w-xl mx-auto'>
          <h3 className='text-2xl font-bold mb-6'>UPDATE BLOG</h3>
          <form>
            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>Category</label>
              <select
                className='w-full p-2 border rounded-md'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Blog Category</option>
                <option value="food">Food</option>
                <option value="book">Book</option>
                <option value="sports">Sports</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="fashion">Fashion</option>
                <option value="travel">Travel</option>
              </select>
            </div>
            <input
              type="text"
              placeholder='BLOG MAIN TITLE'
              className='w-full p-2 mb-4 border rounded-md'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>BLOG IMAGE</label>
              <img
                src={
                  imagePreview
                    ? imagePreview
                    : blogImage
                      ? blogImage
                      : "/imgPL.webp"
                }
                alt="blogImage"
                className='w-full h-48 object-cover mb-4 rounded-md'
              />
              <input
                type="file"
                className='w-full p-2 border rounded-md'
                onChange={changeImageHandler}
              />
            </div>
            <textarea
              rows="6"
              className='w-full p-2 mb-4 border rounded-md'
              placeholder='BLOG INTRO... (Must contain at least 20 characters!)'
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            <button
              className='w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer'
              onClick={handleUpdate}
            >
              UPDATE
            </button>

          </form>
        </section>
      </div>
    </div>
  )
}

export default UpdateBlog