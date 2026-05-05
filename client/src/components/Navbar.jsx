import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate, NavLink } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useClerk, useUser, UserButton } from '@clerk/clerk-react'
import axios from 'axios'

const Navbar = () => {

  const navigate = useNavigate()
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const [open, setOpen] = useState(false)
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"

  useEffect(() => {
    const syncCurrentUser = async () => {
      if (!user) return

      try {
        const res = await axios.post(`${API_BASE}/api/users/sync`, {
          clerk_user_id: user.id,
          full_name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          avatar_url: user.imageUrl || "",
          role: "tourist",
        })

        if (res.data?.token) {
          localStorage.setItem("token", res.data.token)
        }
      } catch (error) {
        console.error("Failed to sync user:", error)
      }
    }

    syncCurrentUser()
  }, [user, API_BASE])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/Explore' },
    { name: 'My Bookings', path: '/bookings' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <>
      {/* Navbar */}
      <div className='fixed z-50 w-full backdrop-blur-2xl flex justify-between items-center px-4 py-3 sm:px-20 xl:px-32 border-b border-gray-400 '>
        {/* Logo */}
        <img
          src={assets.logo}
          className='w-32 sm:w-44 cursor-pointer rounded-lg'
          alt='logo'
          onClick={() => navigate('/')}
        />

        {/* Desktop Links */}
        <div className='hidden md:flex items-center gap-8 text-sm font-medium text-slate-700'>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                isActive ? 'text-sky-500' : 'hover:text-sky-500 transition'
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Right */}
        <div className='hidden md:flex'>
          {user ? (
            <UserButton />
          ) : (
            <button
              onClick={openSignIn}
              className='flex bg-sky-400 items-center gap-2 rounded-full text-sm cursor-pointer text-white px-6 py-2.5'
            >
              Login
              <ArrowRight className='w-4 h-4' />
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <button
          onClick={() => setOpen(true)}
          className='md:hidden'
        >
          <Menu className='w-7 h-7 text-slate-700' />
        </button>
      </div>

      {/* Full Screen Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white z-[60] transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top Actions */}
        <div className='flex justify-between items-center p-5 border-b'>
          {user ? (
            <UserButton />
          ) : (
            <button
              onClick={() => {
                openSignIn()
                setOpen(false)
              }}
              className='flex bg-sky-400 items-center gap-2 rounded-full text-sm text-white px-6 py-2.5'
            >
              Login
              <ArrowRight className='w-4 h-4' />
            </button>
          )}

          <button onClick={() => setOpen(false)}>
            <X className='w-6 h-6 text-slate-700' />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className='flex flex-col p-5 gap-8 text-lg text-slate-700 font-medium'>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setOpen(false)}
              className={ ({ isActive }) =>
                isActive ? 'text-sky-500' : ''
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

       
      </div>
    </>
  )
}

export default Navbar