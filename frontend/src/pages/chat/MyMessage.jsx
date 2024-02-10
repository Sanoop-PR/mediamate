import React, { useContext } from "react";
import { useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { deleteDoc,doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/Auth";

function MyMessage({ msg }) {
  const [dropdown, setDropdown] = useState(false);
  const params = useParams();
  const context = useContext(AuthContext);

  
   function deleteMsg( documentId) {
    try {
       deleteDoc(doc(db, params.id, documentId));  
      
      console.log('Document deleted successfully.');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
    setDropdown(false)

  }

  function handleCopytext() {
    navigator.clipboard.writeText(msg.data.message)
    setDropdown(false)
  }

  return (
    <>
      <div className="flex items-start gap-2.5 mb-6">
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
              <button className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              type="button"
              onClick={()=>handleCopytext()}>
                Copy
              </button>
            </li>
            <li>
              <button
                type="button"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={()=>deleteMsg(msg.id)}
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
        <button
          id="dropdownMenuIconButton"
          data-dropdown-toggle="dropdownDots"
          data-dropdown-placement="bottom-start"
          className="inline-flex  items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
          type="button"
          onClick={() => setDropdown(!dropdown)}
        >
          <i className="bx bx-dots-vertical-rounded text-xl"></i>
        </button>
        <div className="flex flex-col gap-1 ">
          <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-l-xl rounded-br-xl dark:bg-gray-700 w-fit break-words max-w-[320px]">
            {msg.data.message === "like_true" ? (
              <i className="bx bxs-heart text-red-600 bx-md"></i>
            ) : msg.data.file ? (
              <div>
                <img src={msg.data.message} alt="img" />
              </div>
            ) : (
              <>
                <p className="text-sm font-normal text-gray-900 dark:text-white">
                  {msg.data.message}
                </p>

                <span className="font-normal text-gray-500 dark:text-gray-400">
                  {msg.data.time ? (
                    <ReactTimeAgo
                      date={msg.data.time}
                      locale="en-US"
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
      </div>
    </>
  );
}

export default MyMessage;
