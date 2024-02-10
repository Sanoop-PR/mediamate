import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { url } from "../../baseUrl";
import { api } from "../../Interceptor/apiCall";
import { db } from "../../firebase";
import { AuthContext } from "../../context/Auth";
import DefaultImg from "../../assets/default.png";
import { Link } from "react-router-dom";
import { Divider } from "@mui/material";

function RoomName({ roomId,place }) {
  const q = useMemo(
    () => query(collection(db, roomId), orderBy("timestamp", "desc"), limit(1)),
    [roomId]
  );


  const context = useContext(AuthContext);
  const [roomImage, setRoomImage] = useState();
  const [roomName, setRoomName] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [online, setOnline] = useState(false);

  useEffect(() => {
    api
      .get(`${url}/chat/${roomId}`)
      .then((res) => {
        const nameArr = res.data.people.filter((id) => id !== context?.auth?._id);
        if (nameArr.length > 1) {
          return api.get(`${url}/user/get/${nameArr[0]}`).then((resp) => {
            return {
              data: {
                name: `${resp.data.name} and ${nameArr.length - 1} others`,
                avatar:
                  "https://images.squarespace-cdn.com/content/v1/53eba949e4b0c2eda84a38cc/1592250464335-933Q01Q1A0JOXSIRDVSR/social.png?format=500w",
                username: "",
                online: false,
              },
            };
          });
        }
        return api.get(`${url}/user/get/${nameArr[0]}`);
      }).then((resp) => {
        setOnline(resp.data.online);
        setRoomImage(resp.data.avatar);
        setRoomName(resp.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [context?.auth?._id, roomId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (querySnapShop) => {
      const messages = [];
      querySnapShop.forEach((doc) => {
        messages.push(doc.data());
      });
      // if use delete message then message not dispaly
      if (messages[0]?.hide[0]===context?.auth?._id || place==='home') {
        setLastMessage('');
      } else {
        setLastMessage(messages[0]?.message);
      }
    });
    return () => unsubscribe();
  }, [q]);

  return (
    <>
        <Link to={`/chats/${roomId}`} className="flex flex-row items-center px-2 py-3 cursor-pointer">
          <img src={roomImage || DefaultImg} alt="" className=" rounded-full w-10 h-10 relative object-cover bg-[#eaeaea] " />
          {online && <div className="bg-green-500 w-3 h-3 rounded-full relative top-4 -left-2 z-30" ></div>}
          <div className="flex flex-col items-start ml-3">
            <p className=" text-md dark:text-white">{roomName ? roomName : "...."}</p>
            <p className=" text-xs text-slate-500 z-50 ">
              {lastMessage === "like_true" ? (
                <i className="bx bxs-heart bx-xs text-red-500"></i>
              ) : lastMessage?.includes("http") ? (
                "image"
              ) : lastMessage?.length > 27 ? (
                lastMessage.slice(0, 27) + "  ..."
              ) : (
                lastMessage
              )}
            </p>
          </div>
        </Link>
        <Divider/>
    </>
  );
}

export default RoomName;
