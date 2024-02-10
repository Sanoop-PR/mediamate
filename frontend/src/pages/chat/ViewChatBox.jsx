import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import { db, storage } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../Interceptor/apiCall";
import { url } from "../../baseUrl";
import { AuthContext } from "../../context/Auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import DefaultImg from "../../assets/default.png";
import Resizer from "react-image-file-resizer";
import ReactTimeAgo from "react-time-ago";
import Emoji from "../../components/Emoji";
import { socket } from "../../App";
import Typing from "./Typing";
import { useParams } from "react-router-dom";


function ViewChatBox({ roomId, deleteRoom }) {
  const typesocket = useMemo(() => socket, []);
  const context = useContext(AuthContext);
  const [snapShotMessages, setSnapShotMessages] = useState([]);
  const [details, setDetails] = useState(false);
  const [typing, setTyping] = useState();
  const params = useParams();
  const [message, setMessage] = useState();

  const q = useMemo(
    () => query(collection(db, roomId), orderBy("timestamp", "asc")),
    [roomId]
  );

  const scrollRef = useRef();

  useEffect(() => {
    setDetails(false);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          data: doc.data()
        });
      });
      setSnapShotMessages(messages);
    });
    return () => unsubscribe();
  }, [q, roomId]);


  useEffect(() => {
    updateScroll();
  }, [snapShotMessages]);

  useEffect(() => {
    typesocket.on(`typinglistenon${roomId}`, (uid) => {
      setTyping(uid);
      updateScroll();
    });
    typesocket.on(`typinglistenoff${roomId}`, (uid) => {
      setTyping(undefined);
      updateScroll();
    });
  }, [roomId, typesocket]);

  useEffect(() => {
    if (message === undefined) return;
    const timer = setTimeout(() => {
      typesocket.emit("typingoff", { uid: context?.auth?._id, roomId });
    }, 1500);
    typesocket.emit("typingon", { uid: context?.auth?._id, roomId });
    return () => clearTimeout(timer);
  }, [context?.auth?._id, message, roomId, typesocket]);

  function updateScroll() {
    var element = scrollRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }


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
      })
      .then((resp) => {
        context.setRoomDetails({
          roomDetails: resp.data.username,
          room: resp.data.name,
          online: resp.data.online,
          lastSeen: resp.data.lastSeen,
          image: resp.data.avatar,
        });
      })
      .catch((err) => console.log(err));
  }, [context?.auth?._id, roomId,params.id]);


  return (
    <div ref={scrollRef}>
      {snapShotMessages.map((msg, index) => {
        return (
          <div key={index}>
            {context?.auth?._id === msg.data.uid ? (
              <div className="flex justify-end">
                <MyMessage msg={msg}/>
              </div>
            ) : (
              <OtherMessage msg={msg} />
            )}
          </div>
        );
      })}
      {typing && <Typing user={typing} />}
    </div>
  );
}

export default ViewChatBox;
