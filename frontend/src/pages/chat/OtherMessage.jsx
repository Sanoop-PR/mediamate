import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { api } from "../../Interceptor/apiCall";
import { url } from "../../baseUrl";
import DefaultImg from "../../assets/default.png";
import ReactTimeAgo from "react-time-ago";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase";

function OtherMessage({ msg }) {
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState({});
  const params = useParams();
  const context = useContext(AuthContext);
  const [roomMembers, setRoomMembers] = useState();
  const [showMsg, setshowMsg] = useState(false);

  useEffect(() => {
    const item = msg.data.hide.find((element) => element === context?.auth?._id);
    if (item) {
      // console.log(item);
      setshowMsg(true)
    }
  }, [context,msg])
  

  useEffect(() => {
    api
      .get(`${url}/user/get/${msg.data.uid}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [msg.data.uid]);

  // for get room members
  useEffect(() => {
    api
      .get(`${url}/chat/${params.id}`)
      .then((res) => {
        const nameArr = res.data.people.filter((id) => id !== context?.auth?._id);
        setRoomMembers(nameArr.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.id]);

  async function updateDocc(id) {
    const docRef = doc(db, params.id, id);
     await updateDoc(docRef, {
      hide: arrayUnion(context?.auth?._id)
  });
  setDropdown(false)
  }

  function handleCopytext() {
    navigator.clipboard.writeText(msg.data.message)
    setDropdown(false)
  }

  return (
    <div>
      {
        showMsg?(
          <></>
        ):(

      <div className="flex items-start gap-2.5 mb-6">
        {roomMembers > 1 ? (
          <img
            className="w-8 h-8 rounded-full"
            src={user?.avatar || DefaultImg}
            alt={user.name}
          />
        ) : (
          ""
        )}
        <div className="flex flex-col gap-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {roomMembers > 1 ? (
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {user.name}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700 w-fit max-w-[320px] break-words	h-fit">
            {msg.data.message === "like_true" ? (
              <i className="bx bxs-heart text-red-600 bx-md"></i>
            ) : msg.data.file ? (
              <img src={msg.data.message} alt="" />
            ) : (
              <>
                <p className="text-sm font-normal text-gray-900 dark:text-white">
                  {msg.data.message}
                </p>
                <span className="font-normal text-gray-500 dark:text-gray-400">
                  {msg.data.time ? (
                    <ReactTimeAgo
                      date={msg.data.time}
                      locale="en"
                      timeStyle="round-minute"
                      className="text-xs"
                    />
                  ) : (
                    ""
                  )}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          id="dropdownMenuIconButton"
          data-dropdown-toggle="dropdownDots"
          data-dropdown-placement="bottom-start"
          className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
          type="button"
          onClick={() => setDropdown(!dropdown)}
        >
          <i className="bx bx-dots-vertical-rounded text-xl"></i>
        </button>
        <div
          id="dropdownDots"
          className={`z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600 ${
            dropdown ? "block" : "hidden"
          }`}
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownMenuIconButton"
          >
            <li>
              <button
                type="button"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={()=>handleCopytext()}
              >
                Copy
              </button>
            </li>
            <li>
              <button
                type="button"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => updateDocc(msg.id)}
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
        )
      }
    </div>
  );
}

export default OtherMessage;
