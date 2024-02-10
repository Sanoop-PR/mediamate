import React, { useEffect, useState } from 'react'
import { api } from "../../Interceptor/apiCall";
import { url } from "../../baseUrl";
import defaultImg from '../../assets/default.png'
import { Link } from 'react-router-dom';

function StoryContainer({ seen, owner, id }) {

  const [user, setUser] = useState()

  useEffect(() => {
    api.get(`${url}/user/get/${owner}`).then(res => setUser(res.data)).catch(err => console.log(err))
  }, [owner])

  return (
    <Link to={`/story/${user?._id}?id=${id}`} className='flex flex-col mx-2 w-14'>
      <div className='w-16 h-16 rounded-full flex items-center justify-center'>
        <img src={user?.avatar || defaultImg} alt="" className='w-14 h-14 rounded-full p-1' />
      </div>
        <p className=' text-xs text-center dark:text-white '>{user && user.username.slice(0, 7) + "..."}</p>
    </Link>
  )
}

export default StoryContainer