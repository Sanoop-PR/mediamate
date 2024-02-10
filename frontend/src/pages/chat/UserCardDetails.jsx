import React, { useEffect } from "react";
import { useState } from "react";
import { api } from "../../Interceptor/apiCall";
import { url } from "../../baseUrl";
import { Link } from "react-router-dom";
import DefaultImg from "../../assets/default.png";

function UserCardDetails({ uid, showOnline = false }) {
  const [user, setUser] = useState();
  useEffect(() => {
    api
      .get(`${url}/user/get/${uid}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, [uid]);
  return (
    <>
    <Link to={`/profile/${user?.username}/stream`} className="flex flex-row items-center px-2 py-3 cursor-pointer">
      <img src={user?.avatar ? user.avatar : DefaultImg} alt="" className=" rounded-full w-10 h-10 relative object-cover bg-[#eaeaea] " />
      {showOnline && user?.online && <div className="bg-green-500 w-3 h-3 rounded-full relative top-4 -left-2" ></div>}
      <div className="flex flex-col items-start ml-3">
        <p className=" text-md dark:text-white">{user?.username}</p>
        <p className=" text-xs text-slate-500 ">
        {user?.name}
        </p>
      </div>
    </Link>
</>
  );
}

export default UserCardDetails;
