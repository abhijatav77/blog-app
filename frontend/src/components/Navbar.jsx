import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../utils/utils';


const Navbar = () => {
  const [show, setShow] = useState(false)

  const { profile, isAuthenticated, setIsAuthenticated } = useAuth()
  console.log("Hello :", profile)
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.get(`${BACKEND_URL}/users/logout`, {
        withCredentials: true
      })
      toast.success(data.message || "User logged out successfully")
      setIsAuthenticated(false)
      navigate("/login")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Logout is not working")
    }
  }

  return (
    <>
      <nav className='shadow-lg px-4 py-3'>
        <div className="flex items-center justify-between container mx-auto">
          <div className='font-semibold text-xl'>
            Cilli<span className='text-blue-500'>Blog</span>
          </div>
          {/* Desktop */}
          <div>
            <ul className='hidden md:flex space-x-6'>
              <Link to={"/"} className='hover:text-blue-500'>HOME</Link>
              <Link to={"/blogs"} className='hover:text-blue-500'>BLOGS</Link>
              <Link to={"/creator"} className='hover:text-blue-500'>CREATORS</Link>
              <Link to={"/about"} className='hover:text-blue-500'>ABOUT</Link>
              <Link to={"/contact"} className='hover:text-blue-500'>CONTACT</Link>
            </ul>
          </div>
          <div className='flex space-x-2'>
            {isAuthenticated && profile?.user?.role === 'admin' ? (
              <Link to={'/dashboard'} className='bg-blue-600 text-white font-semibold hover:bg-blue-800 duration-300 px-4 py-2 rounded'>DASHBOARD</Link>
            ) : null}

            {!isAuthenticated ? (
              <Link to={'/login'} className='bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded'>LOGIN</Link>
            ) : (
              <div>
                <button
                  onClick={handleLogout} className='bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded cursor-pointer'
                >
                  LOGOUT
                </button>
              </div>
            )}
          </div>
          <div className='md:hidden' onClick={() => setShow(!show)}>{show ? <IoCloseSharp size={24} /> : <AiOutlineMenu size={24} />}</div>
        </div>
        {/* Mobile navbar */}
        {show && (
          <div className='bg-white'>
            <ul className='flex flex-col h-screen items-center justify-center space-y-5 md:hidden text-xl'>
              <Link to={"/"} onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeclass="active" className='hover:text-blue-500'>HOME</Link>
              <Link to={"/blogs"} onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeclass="active" className='hover:text-blue-500'>BLOGS</Link>
              <Link to={"/creator"} onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeclass="active" className='hover:text-blue-500'>CREATORS</Link>
              <Link to={"/about"} onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeclass="active" className='hover:text-blue-500'>ABOUT</Link>
              <Link to={"/contact"} onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeclass="active" className='hover:text-blue-500'>CONTACT</Link>
            </ul>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar