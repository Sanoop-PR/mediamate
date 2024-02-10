import { Chip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SelectUser from './SelectUser'
import { url } from "../../baseUrl";
import { api } from "../../Interceptor/apiCall";

function Select({handleClose,addRoom}) {
    const [selected, setSelected] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [users, setUsers] = useState([])
    const [aaaa, setaaaa] = useState()
    const navigate = useNavigate()
    useEffect(() => {
      api.get(`${url}/user/allusers`).then((res) => {
        setUsers(res.data)
      }).catch((err) => {
        console.log(err)
      })
    }, [])

    function handleSelect(user) {
        setSelected(prev=>[...prev,user])
        setSelectedIds(prev => [...prev,user._id])
    }
    function removeUser(userId) {
        setSelected(prev => prev.filter(item => userId !== item._id))
        setSelectedIds(prev => prev.filter(item => item !== userId))
    }

    function handleCreateRoom() {
        api.post(`${url}/chat/handshake`,{
            people:selectedIds
        }).then((res) => {
            handleClose()
            navigate(`/chats/${res.data.roomId}`)
            addRoom(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    function findUser(name) {
        const ddd = users.filter(book => book.username.toLowerCase() === name.toLowerCase())
        setSelectedIds(ddd)
    }

    
    

  return (
    <div className='dark:bg-gray-800 dark:text-gray-400 p-3'>
        <p onClick={()=> handleCreateRoom()}
        className=' absolute text-sm text-[#0092F9] cursor-pointer  right-3 top-3 '>next</p>
        <div className='min-w-11 border-2 border-b-gray-300 flex flex-row px-3 items-start dark:border-gray-700'>
            <h5 className='tracking-wide ml-1 mt-4 '>TO:</h5>
            <div className=' py-3 px-2'>
                <div>
                    {
                        selected.map(selects => 
                            <Chip
                            color='primary'
                            label={selects.username}
                            key={selects._id}
                            onDelete={()=>
                            removeUser(selects._id)}
                            sx={{ margin: '2px 5px' }}
                            />
                            )
                    }
                </div>
                <input className=' w-11/12 ml-2 h-4/5 py-1 dark:bg-gray-700' type="text" placeholder='search...' onChange={(e)=>findUser(e.target.value)} />
            </div>
        </div>
        <div>
            <h5 className=' ml-4 mt-3 mb-4 ' >Suggested</h5>
            <div>
                {
                    users.map(user =>
                        <SelectUser
                        selects={selectedIds}
                        key={user._id}
                        handleSelect={handleSelect}
                        removeUser={removeUser}
                        user={user}
                        />)
                }
            </div>
        </div>
    </div>
  )
}

export default Select