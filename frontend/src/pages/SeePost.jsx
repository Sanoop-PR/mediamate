import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../baseUrl";
import { AuthContext } from "../context/Auth";
import {  useNavigate } from "react-router-dom";
import { api } from "../Interceptor/apiCall";
import GetAllPost from "../components/GetAllPost";


function SeePost() {
    const [post, setPost] = useState();
    const params = useParams()
    useEffect(() => {
        api
          .get(`${url}/post/${params.id}`)
          .then((res) => {
            setPost(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }, [params.id]);

  return (
    <div>
        {post&&
            <GetAllPost 
        filterUserPosts={'filterUserPosts'}
        filterPosts={'filterPosts'}
        key={post._id}
        id={post?._id}
        img={post.files[0].link}
        saved={post.saved}
        userId={post.owner}
        avatar=""
        username=""
        caption={post.caption}
        comments={post.comments}
        time={post.createdAt}
        likes={post.likes}/>}
    </div>
  )
}

export default SeePost