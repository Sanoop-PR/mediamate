import React, { useContext, useEffect, useState } from "react";
import { api } from "../Interceptor/apiCall";
import { url } from "../baseUrl";
import ReactTimeAgo from "react-time-ago";
import { Link } from "react-router-dom";
import defaultImg from "../assets/default.png";
import { AuthContext } from "../context/Auth";

function Notifications({
  content,
  time,
  followbtn,
  postId,
  userId,
  seen,
  NotificationType,
  id,
}) {
  const context = useContext(AuthContext);

  const [user, setUser] = useState();
  const [post, setPost] = useState();
  useEffect(() => {
    api
      .get(`${url}/user/get/${userId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  useEffect(() => {
    if (!postId) return;
    api
      .get(`${url}/post/${postId}`)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [postId]);


  


  return (
    <section className="flex flex-row my-1 items-start py-2 px-5 ">
      <div>
        <Link to={`profile/${user?.username}/stream`}>
          <img
            src={user?.avatar ? user.avatar : defaultImg}
            alt="user"
            className="w-11 h-11 object-cover rounded-full mr-1 "
          />
        </Link>
      </div>
      <div className="flex flex-row ml-1 items-center mt-1">
        <div>
          <p className="text-sm dark:text-white">
            <Link to={`profile/${user?.username}/stream`}>
              {user?.username}
            </Link>{" "}
            &nbsp; {content && content}
          </p>
          <p>
            {
              <ReactTimeAgo
                date={Date.parse(time)}
                locale="en-US"
                timeStyle="twitter"
                className="text-xs text-gray-400"
              />
            }
          </p>
        </div>
      </div>
      {post && postId && NotificationType === 2 && (
        <img
          src={post.files[0].link}
          alt="image"
          className="w-11 h-11 object-cover ml-auto rounded-md"
        />
      )}
    </section>
  );
}

export default Notifications;
