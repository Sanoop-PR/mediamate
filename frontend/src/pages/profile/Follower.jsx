import React, { useContext, useEffect, useState } from "react";
import { url } from "../../baseUrl";
import { api } from "../../Interceptor/apiCall";
import DefaultImg from "../../assets/default.png";
import { AuthContext } from "../../context/Auth";
import {useNavigate } from "react-router-dom";

function Follower({ userId, toggle, handleClose }) {
  const [users, setUsers] = useState([]);
  const context = useContext(AuthContext);
  const [iFollow, setIFollow] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) return;
    if (toggle === 1)
      api.get(`${url}/user/followers/${userId}`).then((res) => {
        setUsers(res.data);
      });
    if (toggle === 2)
      api.get(`${url}/user/followings/${userId}`).then((res) => {
        setUsers(res.data);
      });
  }, [toggle, userId,iFollow]);

  async function handleFollow(id) {
    api.get(`${url}/user/handlefollow/${id}`).then((res) => {
      if (res.data?.success) {
        setIFollow((prev) => !prev);
      }
    });
  }

  function nav(username) {
    navigate(`/profile/${username}/stream`);
    handleClose()
  }

  return (
    <div >
      {users.length === 0 && <p>Nothing to see</p>}
      {users.map((item) => (
        <section key={item?._id} className="flex justify-between">
          <div onClick={()=> nav(item?.username)} className="flex cursor-pointer">
            <img
              src={item?.avatar ? item.avatar : DefaultImg}
              alt={item.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="ps-3">
              <p className="font-[Montserrat] dark:text-white">{item?.username}</p>
              <p className="font-[Montserrat-Subrayada] dark:text-slate-300">{item?.name}</p>
            </div>
          </div>
          <div>
            {item?._id !== context?.auth?._id ? (
              item.followers.includes(context?.auth?._id) ? (
                <button onClick={() => handleFollow(item._id)} type="button" className="text-red-600">UnFollow</button>
              ) : (
                <button onClick={() => handleFollow(item._id)} type="button" className="text-blue-600">Follow</button>
              )
            ) : (
              <></>
            )}
          </div>
        </section>
      ))}
    </div>
  ); 
}

export default Follower;
