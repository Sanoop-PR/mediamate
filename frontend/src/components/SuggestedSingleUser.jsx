import React from 'react'
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Avatar } from '@mui/material';
import { useState } from 'react';
import { api } from "../Interceptor/apiCall";
import { url } from "../baseUrl";
import  defaultImg  from "../assets/default.png";
import { Link } from 'react-router-dom';

function SuggestedSingleUser({avatar,username,name,userId}) {

    const [iFollow, setIFollow] = useState(false)
    async function handleFollow() {
        api.get(`${url}/user/handlefollow/${userId}`).then((res)=>{
            if (res.data) {
              setIFollow(prev=>!prev)
            }
        })
    }

  return (
    <ListItem>
            <ListItemAvatar>
          <Link to={`/profile/${username}/stream`}>
              <Avatar src={avatar ?? defaultImg}/>
            </Link>
            </ListItemAvatar>
            <ListItemText
              className="dark:text-[#ffff]"
              primary={<span className='text-black dark:text-white'>{username}</span>}
              secondary={
                <span className="dark:text-[#a2a5b9] text-sm">{name}</span>
              }
            />
            <button onClick={() =>handleFollow()}>
              {iFollow?
              <i className="bx bx-check-circle bx-sm font-medium" style={{ color: !iFollow ? '#0095F6' : '#65B741'}}></i>
              :
              <i className="bx bx-user-plus bx-sm font-medium" style={{ color: !iFollow ? '#0095F6' : '#65B741'}}></i>
              }
            </button>
          </ListItem>
  )
}

export default SuggestedSingleUser