import React from 'react'
import { Outlet } from 'react-router-dom'
const Layout = () => {
  return (
    <main className='max-w-full h-full p-8 '>
        <Outlet />
    </main>
  )
}

export default Layout