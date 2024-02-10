import React from 'react'
import logo from '../../assets/logo2.png'
import { Link, useNavigate } from 'react-router-dom'


function TopBar() {
    const navigate = useNavigate()
  return (
    <div className='w-full flex flex-row items-center justify-between m-[auto] py-3 px-2 '>
        <Link>
        <img src={logo} alt="logo" className=' w-28 ' />
        </Link>
        <i className='bx bx-x bx-md text-white cursor-pointer' onClick={() => navigate('/home') }></i>
    </div>
  )
}

export default TopBar