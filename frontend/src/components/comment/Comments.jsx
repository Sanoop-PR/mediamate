import React, { useContext, useEffect, useRef, useState } from "react";
import { api } from "../../Interceptor/apiCall";
import { url } from "../../baseUrl";
import defaultImg from "../../assets/default.png";
import ReactTimeAgo from "react-time-ago";
import { AuthContext } from "../../context/Auth";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";


function Comments({ text, time, userId, owner, postId, id, filterComment }) {

  

    const context = useContext(AuthContext);
    const [user, setUser] = useState();
    const [commentShow, setCommentShow] = useState(text);

    useEffect(() => {
        api.get(`${url}/user/get/${userId}`).then((res) => {
          setUser(res.data);
        });
      }, [userId]);

  return (
    <>
      <div className="flex flex-col bg-white dark:bg-[#202836] p-2 border-b w-full dark:border-[#37445c]">
        <div className="flex gap-1">
          <Avatar src={user?.avatar ? user.avatar : defaultImg} alt="User Avatar" />

          <div className="flex flex-col">
            <span className="text-md font-semibold hover:underline dark:text-[#fff]">
              <Link to={`/profile/${user?.username}/stream`}>
              {user?.username}
              </Link>
              <span className=" ps-2 text-sm ">
              {commentShow}
              </span>
            </span>
            <ReactTimeAgo
                date={Date.parse(time)}
                locale="en-US"
                timeStyle="round-minute" className="text-gray-500 text-xs"
              />
          </div>
        </div>
      </div>
    </>
  );
}

export default Comments;
