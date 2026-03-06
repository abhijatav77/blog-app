import React from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Footer from './components/Footer.jsx'
import {Navigate, Route, Routes, useLocation} from 'react-router-dom'
import Blogs from './pages/Blogs.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Creator from './pages/Creator.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { useAuth } from './context/AuthProvider.jsx'
import UpdateBlog from './dashboard/UpdateBlog.jsx'
import {Toaster} from "react-hot-toast"
import Detail from './pages/Detail.jsx'
import NotFound from './pages/NotFound.jsx'

const App = () => {

  const location = useLocation()
  const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(location.pathname)

  const {blogs, isAuthenticated, loading} = useAuth()
  console.log("isAuthenticated: ",isAuthenticated)

  if(loading) return null
  return (
    <div>
      <Toaster />
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path='/' element={isAuthenticated ? <Home /> : <Navigate to={'/login'} />}/>
        <Route path='/blogs' element={<Blogs />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/creator' element={<Creator />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/dashboard' element={<Dashboard />}/>

        {/* Single Page Route */}
        <Route path='/blog/:id' element={<Detail />}/>

        {/* Update page route */}
        <Route path='/blog/update/:id' element={<UpdateBlog />}/>

        {/* Universal Route */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </div>
  )
}

export default App