import React, {  useContext, useEffect, useState } from 'react'
import { api } from "../../Interceptor/apiCall";
import { url } from "../../baseUrl";
import { Link, useNavigate } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import { Box, LinearProgress } from '@mui/material';
import { AuthContext } from '../../context/Auth';


function ViewBox({ stories }) {
    const [user, setUser] = useState()
    const [bar, setBar] = useState(0)
    const navigate = useNavigate()
    const context = useContext(AuthContext)

    useEffect(() => {
        if (!stories) return
        api.get(`${url}/user/get/${stories?.current?.owner}`).then((res) => {
            setUser(res.data)
            return api.put(`${url}/story/seen/${stories?.current?.id}`)
        }).then((res) => 
        console.log(res.data))
        .catch(err => console.log(err))
        const barValue = setInterval(() => {
            setBar(prev => {
                if (prev + 9 > 100) {
                    return 100
                } return prev + 9
            })
        }, 500)
        const timer = setTimeout(() => {
            clearInterval(barValue)
            if (!stories.next) navigate('/home')
            navigate(`/story/${stories.next.owner}?id=${stories.next.id}`)
        }, 6000)

        return () => {
            clearInterval(barValue);
            clearInterval(timer)
            setBar(0)
        }
        
    }, [navigate, stories])
    

  return (
    <section className='absolute top-[2.75vh] h-[95vh] w-[55vw] min-w-96'>
        <Box className=" w-full text-[#656565]">
            <LinearProgress className='absolute top-[0.55vh] w-[98%] left-1 rounded-md' variant="determinate" value={bar}/>
        </Box>
        <div className='flex flex-row items-center justify-between absolute top-4 w-full'>
            <div className='flex flex-row items-center text-white ml-3'>
                <Link to={`/profile/${user?.username}/stream`} className='flex items-center'>
                <img src={user?.avatar} alt="user" className=' w-8 rounded-full' />
                &nbsp;&nbsp;
                <p className=' text-sm text-[#c3c3c3]'>
                    {user?.username}
                </p>
                </Link>
                &nbsp;
                <p className=' text-xs text-[#c3c3c3]'>
                    {stories && (
                        <ReactTimeAgo
                        date={Date.parse(stories?.current?.createdAt || new Date())}
                timeStyle="twitter"
                        />
                    )}
                </p>
            </div>
            <div></div>
        </div>
        <img src={stories?.current?.data} className='w-full h-full object-cover rounded-md' alt="story" />
        {
            stories?.prev && (
                <button onClick={() =>
                    navigate(`/story/${stories.prev.owner}?id=${stories.prev.id}`)
                  } className='absolute -left-10 top-1/2 z-50 bg-[#5b5b5b] flex justify-center items-center rounded-full p-1'>
                    <i className='bx bxs-left-arrow bx-sm text-white'></i>
                </button>
            )
        }
        {
            stories?.next && (
                <button onClick={() =>
                    navigate(`/story/${stories.next.owner}?id=${stories.next.id}`)
                  } className='absolute -right-10 top-1/2 z-50 bg-[#5b5b5b] flex justify-center items-center rounded-full p-1'>
                    <i className='bx bxs-right-arrow bx-sm text-white'></i>
                </button>
            )
        }
    </section>
  )
}

export default ViewBox