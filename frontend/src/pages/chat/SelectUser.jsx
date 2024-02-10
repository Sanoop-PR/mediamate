import React, { useEffect, useState } from 'react'
import defaultImg from '../../assets/default.png'
import { Checkbox } from '@mui/material'

function SelectUser({user,handleSelect,removeUser,selects}) {
    const [checked, setChecked] = useState(false)

    function handleCheckBoxClick() {
        if (checked) {
            removeUser(user._id)
        } else {
            handleSelect(user)
        }
        setChecked(prev=> !prev)
    }

    useEffect(() => {
      if (selects.includes(user._id)) return;
      setChecked(false)
    }, [selects,user._id])
    

  return (
    <div className='flex flex-row my-1 items-start py-1 px-3' >
        <div>
            <img src={user?.avatar || defaultImg} alt="" className='w-10 h-10 object-cover rounded-full mr-1 ' />
        </div>
        <div className=' flex flex-col ml-2 '>
            <div className=' text-sm font-bold'>{user.username}</div>
            <p className=' text-xs'>{user.name}</p>
        </div>
        <div className=' ml-auto' >
            <Checkbox 
            checked={checked}
            onClick={()=>
            handleCheckBoxClick()}
            icon={<i className='bx bx-radio-circle bx-sm'></i>}
            checkedIcon={<i className='bx bxs-check-circle bx-sm'></i>}
            />
        </div>
    </div>
  )
}

export default SelectUser