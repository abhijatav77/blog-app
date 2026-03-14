import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { BACKEND_URL } from '../utils/utils.jsx'
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([])
  const [profile, setProfile] = useState()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(!isAuthenticated) return;
    const fetchProfile = async () => {
      try {
          const { data } = await axios.get(`${BACKEND_URL}/users/my-profile`, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"
            },
          })
          console.log(data)
          setProfile(data)
          setIsAuthenticated(true);
        // }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    };
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/blogs/all-blogs`)
        console.log(data)
        setBlogs(data)
      } catch (error) {
        console.log(error)
      }
    };
    fetchBlogs();
    fetchProfile();
  }, [])
  return (
    <AuthContext.Provider value={{ blogs, profile, setProfile, isAuthenticated, setIsAuthenticated, loading }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)