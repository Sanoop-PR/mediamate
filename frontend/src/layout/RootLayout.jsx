import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'


function RootLayout() {
  return (
    <div>
        <header className='sticky top-0 z-30'>
            <Header/>
        </header>
        <Outlet/>
    </div>
  )
}

export default RootLayout