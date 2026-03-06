import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URL } from '../utils/utils'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthProvider'

const Register = () => {

  const {isAuthenticated, setIsAuthenticated, setProfile} = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [education, setEducation] = useState("")
  const [photo, setPhoto] = useState("")
  const [photoPreview, setphotoPreview] = useState("")

  const navigate = useNavigate()

  const changePhotoHandler = (e) => {
    console.log(e)
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setphotoPreview(reader.result)
      setPhoto(file)
    }
  }

  const handleRegister = async(e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name',name)
    formData.append('email',email)
    formData.append('phone',phone)
    formData.append('password',password)
    formData.append('role',role)
    formData.append('education',education)
    formData.append('photo',photo)
    try {
      const {data} = await axios.post(`${BACKEND_URL}/users/register`, formData,{
        withCredentials:true,
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      console.log(data)
      toast.success(data?.message || "User registered successfully" )
      setProfile(data)
      setIsAuthenticated(true)
      navigate('/')
      setName("")
      setEmail("")
      setPhone("")
      setPassword("")
      setRole("")
      setPhoto("")
      setphotoPreview("")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  } 

  return (
    <div>
      <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
          <form onSubmit={handleRegister}>
            <div className='font-semibold text-xl items-center text-center'>
              Cilli<span className='text-blue-500'>Blog</span>
            </div>
            <h1 className='font-semibold text-xl mb-6'>Register</h1>
            <select value={role} required onChange={(e) => setRole(e.target.value)} className='w-full p-2 mb-4 border rounded-md'>
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className='mb-4'>
              <input
                type="text"
                required
                placeholder='Your Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full p-2 border rounded-md' />
            </div>
            <div className='mb-4'>
              <input
                type="email"
                required
                placeholder='Your Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full p-2 border rounded-md' />
            </div>
            <div className='mb-4'>
              <input
                type="number"
                required
                placeholder='Phone Number'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='w-full p-2 border rounded-md' />
            </div>
            <div className='mb-4'>
              <input
                type="password"
                required
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-2 border rounded-md' />
            </div>
            <select value={education} required onChange={(e) => setEducation(e.target.value)} className='w-full p-2 mb-4 border rounded-md'>
              <option value="">Select Your Education</option>
              <option value="bca">BCA</option>
              <option value="mca">MCA</option>
              <option value="btech">B.Tech</option>
              <option value="bsc">BSC</option>
            </select>
            <div className='flex items-center mb-4'>
              <div className='w-20 h-20 mr-4'>
                {/* {photo && (
                  <img src={photoPreview} alt="Preview" className='rounded-md' />
                  )} */}
                  <img src={photoPreview ? `${photoPreview}` : "Preview"} alt="Preview" className='rounded-md' />
              </div>
              <input 
              type='file' required
               onChange={changePhotoHandler}
               className='w-full p-2 border rounded-md' />
            </div>
            <p className='text-center mb-4'>Already registered? <Link to={'/login'} className='text-blue-600'>Login Now</Link></p>
            <button type='submit' className='w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white cursor-pointer'>Register</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register