import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { api } from "../../Interceptor/apiCall";
import { url } from "../../baseUrl";
import { AuthContext } from "../../context/Auth";
import { useParams } from "react-router-dom";
import UserCardDetails from "./UserCardDetails";

function Detail({ handleDetailsToggle, handleLeaveChat }) {
  const params = useParams();
  const [people, setPeople] = useState([]);
  const context = useContext(AuthContext);
  useEffect(() => {
    api
      .get(`${url}/chat/${params.id}`)
      .then((resp) => {
        setPeople(resp.data.people.filter((item) => item !== context?.auth?._id));
      })
      .catch((err) => console.log(err));
  }, [context?.auth?._id, params.id]);
  return (
    <div className="-z-10">
      <h1>Members</h1>
      {people.map((userId) => (
        <UserCardDetails showOnline={true} key={userId} uid={userId} />
      ))}
      
      <div className="px-4 border-b ">
        <p className=" ml-2 text-sm mt-4 mb-3 text-red-600 cursor-pointer " onClick={() => handleLeaveChat()}>{people.length !== 1 ? "Leave chat" : "Delete chat"}</p>
      </div>
    </div>
  );
}

export default Detail;
