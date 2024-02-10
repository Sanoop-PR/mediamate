import { Dialog, DialogTitle, Divider } from "@mui/material";
import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { api } from "../../Interceptor/apiCall";
import { url } from "../../baseUrl";
import { AuthContext } from "../../context/Auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "./Select";
import RoomName from "./RoomName";
import ViewChatBox from "./ViewChatBox";
import Emoji from "../../components/Emoji";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Resizer from "react-image-file-resizer";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";
import RoomDetail from "./RoomDetail";
import DefaultImg from "../../assets/default.png";
import Default from "./Default";
import Detail from "./Detail";

function ChatBox() {
  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const context = useContext(AuthContext);
  const [showEmojiPicker, setEmojiPicker] = useState(false);
  const [message, setMessage] = useState();
  const [detailss, setDetails] = useState(false);
  const [iid, setIid] = useState(params.id);
  const navigate = useNavigate();
  const [sharedPost, setSharedPost] = useState();
  const scrollRef = useRef();

  // shared post

  useEffect(() => {
    if (!context?.sharePost) return;
    api
      .get(`${url}/post/${context?.sharePost}`)
      .then((res) => {
        api.get(`${url}/user/get/${res.data.owner}`).then((ress) => {
          // setuser(res.data);
          setSharedPost(res.data);
          setMessage(`shared post from ${ress.data.username}`);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [context?.sharePost]);

  // shared post end

  useEffect(() => {
    setIid(params.id);
  }, [params.id]);

  useEffect(() => {
    api
      .get(`${url}/chat/getRooms`)
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.id, context]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function addRoom(room) {
    const present = rooms.filter((item) => item.roomId === room.roomId);
    if (present.length !== 0) return;
    setRooms((prev) => [...prev, room]);
  }

  function deleteRoom(roomId) {
    setRooms((prev) => prev.filter((item) => item.roomId !== roomId));
  }

  function handleKeyPress() {
    // if (e.keyCode !== 13 || !message || message.trim().length === 0) return;
    if (message === undefined || message === "") return;
    if (sharedPost) {
      sendMessage(sharedPost.files[0].link, true);
    }
    sendMessage(message);
  }

  async function sendMessage(m, file) {
    try {
      setMessage("");
      await addDoc(collection(db, params.id), {
        message: m,
        uid: context?.auth?._id,
        timestamp: serverTimestamp(),
        file: file ? true : false,
        time: Date.now(),
        hide: [],
      });
    } catch (e) {
      console.error(e);
    }
  }

  function handleMessageInput(e) {
    setMessage(e.target.value);
  }

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        2200,
        1800,
        "JPEG",
        70,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  async function handleUplaodImage(e) {
    const file = e.target.files[0];
    if (
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png"
    ) {
      const newFile = await resizeFile(file);
      const storageRef = ref(storage, "images/" + newFile.name);
      const uploadTask = uploadBytesResumable(storageRef, newFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
          context.throwErr("Some error occured");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            sendMessage(downloadURL, true).then(() => {
              console.log("done");
            });
          });
        }
      );
    } else {
      context.throwErr("File type not supported");
    }
  }

  async function handleLike() {
    sendMessage("like_true");
  }

  function handleDetailsToggle() {
    setDetails((prev) => !prev);
  }

  function handleLeaveChat() {
    api
      .put(`${url}/chat/delete`, {
        iid,
      })
      .then((res) => {
        if (res.data) {
          deleteRoom(iid);
          navigate("/chats/all");
          setDetails(false);
          context.setRoomDetails();
        }
      })
      .catch((err) => console.log(err));
  }

  function getEmoji(emoji) {
    setMessage((prev) => prev + emoji);
  }

  function updateScroll() {
    var element = scrollRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }

  return (
    <>
      <section className="fixed w-full h-screen">
        {/* nav bar */}

        <nav className="z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          {/*md:top-[4rem]*/}
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end">
                <button
                  onClick={() => setSideBarIsOpen(!sideBarIsOpen)}
                  data-drawer-target="logo-sidebar"
                  data-drawer-toggle="logo-sidebar"
                  aria-controls="logo-sidebar"
                  type="button"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Open sidebar</span>
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    ></path>
                  </svg>
                </button>
                <div className="ps-4 " onClick={() => handleDetailsToggle()}>
                  {context?.roomDetails ? (
                    <RoomDetail details={context?.roomDetails} />
                  ) : (
                    <span></span>
                  )}
                </div>
              </div>

              {/* profile */}

              <div className="flex items-center ">
                <div className="flex items-center ms-3">
                  <div>
                    <button
                      type="button"
                      className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      aria-expanded="false"
                      data-dropdown-toggle="dropdown-user"
                      onClick={() => setDropdown(!dropdown)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="w-8 h-8 rounded-full"
                        src={context.auth.avatar || DefaultImg}
                      />
                    </button>
                  </div>
                  <div
                    className={`z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 ${
                      dropdown ? "block absolute top-14 right-6" : "hidden"
                    }`}
                    id="dropdown-user"
                  >
                    <div className="px-4 py-3" role="none">
                      <p
                        className="text-sm text-gray-900 dark:text-white"
                        role="none"
                      >
                        {context.auth.name}
                      </p>
                      <p
                        className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                        role="none"
                      >
                        {context.auth.email}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                        {context.auth ? (
                      <li>
                          <Link to={`/profile/${context.auth.username}/stream`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem">
                            Settings
                          </Link>
                        </li>
                        ) : (
                          ""
                        )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex">
          {/* sidebar */}

          <div className="relative">
            <aside
              id="logo-sidebar"
              className={`max-sm:fixed left-0 z-50 w-64 h-screen  transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 ${
                sideBarIsOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              aria-label="Sidebar"
            >
              {/* fixed top-[4rem] */}
              <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                <ul className="space-y-1 font-medium">
                  <li className="py-2">
                    <div className="w-60 flex justify-between ">
                      <span className="dark:text-white">
                        {context.auth.username}
                      </span>
                      <i
                        className="bx bxs-edit bx-sm dark:text-white"
                        onClick={handleClickOpen}
                      ></i>
                    </div>
                    <Dialog
                      onClose={handleClose}
                      aria-labelledby="customized-dialog-title"
                      open={open}
                    >
                      <DialogTitle
                        id="customized-dialog-title"
                        onClose={handleClose}
                        className=" flex flex-row justify-between items-center h-4 dark:bg-gray-800"
                      >
                        <i
                          className="bx bx-x dark:text-white"
                          sx={{
                            fontSize: "22px",
                            marginLeft: "-8px",
                            cursor: "pointer",
                          }}
                          onClick={handleClose}
                        />
                        <p className="text-center text-sm font-bold -mt-[5px] -mb-[3px] dark:text-white">
                          {"New Message"}
                        </p>
                        <p> &nbsp; </p>
                      </DialogTitle>
                      <Select addRoom={addRoom} handleClose={handleClose} />
                    </Dialog>
                  </li>
                  <Divider />
                  {rooms?.map((item) => (
                    <li key={item.roomId}>
                      <RoomName roomId={item.roomId} place={"chat"} />
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <div className="dark:bg-gray-500 w-full h-screen">
            {/* view message */}

            <div className="p-2" onClick={() => setEmojiPicker(false)}>
              <div
                className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-[#D8D9DA] h-[65vh] overflow-y-scroll scrollbar_hide dark:bg-gray-500"
                ref={scrollRef}
              >
                {detailss ? (
                  <Detail
                    handleLeaveChat={handleLeaveChat}
                    handleDetailsToggle={handleDetailsToggle}
                  />
                ) : params.id === "all" ? (
                  <Default />
                ) : (
                  <ViewChatBox deleteRoom={deleteRoom} roomId={params.id} />
                )}
              </div>
            </div>

            {/* sent message */}
            {!detailss ? (
              <div className=" fixed bottom-0  md:w-[73%] w-full">
                <form className="relative">
                  <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <input
                      onChange={(e) => handleUplaodImage(e)}
                      type="file"
                      id="image_chat"
                      hidden
                    />
                    <label
                      htmlFor="image_chat"
                      className="flex items-center justify-center cursor-pointer"
                    >
                      <i className="bx bx-image bx-sm text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"></i>
                    </label>
                    <button
                      type="button"
                      className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmojiPicker((prev) => !prev);
                      }}
                    >
                      <i className="bx bx-happy bx-sm"></i>
                      <span className="sr-only">Add emoji</span>
                    </button>
                    <input
                      id="chat"
                      rows="1"
                      className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Your message..."
                      onChange={handleMessageInput}
                      value={message}
                      type="text"
                    />
                    <button
                      onClick={() => handleLike()}
                      className="no_style"
                      style={{
                        background: "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      type="button"
                    >
                      <i className="bx bxs-heart text-red-500"></i>
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                      onClick={() => handleKeyPress()}
                    >
                      <i className="bx bx-send bx-sm"></i>
                      <span className="sr-only">Send message</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <span></span>
            )}
            {showEmojiPicker && (
              <div
                className="emoji-picker"
                style={{ position: "absolute", bottom: "70px", left: "20px" }}
              >
                <Emoji getEmoji={getEmoji} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ChatBox;
