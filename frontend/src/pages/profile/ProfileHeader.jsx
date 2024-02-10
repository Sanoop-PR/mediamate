import React, { useEffect, useState } from "react";
import { url } from "../../baseUrl";
import { api } from "../../Interceptor/apiCall";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth";
import { useNavigate, useParams } from "react-router-dom";
import DefaultImg from "../../assets/default.png";
import Loader from "../../components/Loader.jsx";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Follower from "./Follower.jsx";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase.js";
import Resizer from "react-image-file-resizer";
import whiteBgImg from "../../assets/white-background.jpg";

function ProfileHeader() {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const [user, setUser] = useState();
  const [iFollow, setIFollow] = useState(false);
  const [toggle, setToggle] = useState(1);
  const [followers, setFollowers] = useState(0);
  const [open, setOpen] = useState(false);
  const [imgurl, setImgUrl] = useState("");
  const [avatar, setAvatar] = useState(context?.auth?.avatar);
  const params = useParams();

  useEffect(() => {
    api
      .get(`${url}/user/${params.username}`)
      .then((resp) => {
        setUser(resp.data);
        setFollowers(resp.data.followers.length);
        setIFollow(resp.data.followers.includes(context?.auth?._id));
      })
      .catch((err) => console.log(err));
    return () => setUser();
  }, [context, params.username, imgurl,iFollow,followers]);

  // dialog

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const uploadBgImage = async (e) => {
    const file = e.target.files[0];
    if (
      !(
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg"
      )
    ) {
      context.throwErr("FIle type not supported");
    }
    const storageRef = ref(storage, "profileBgImg/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
        context.throwErr("some error occurred");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downLoadUrl) => {
          setImgUrl(downLoadUrl);
          const data = {
            user: context?.auth?._id,
            link: downLoadUrl,
          };
          api
            .put(`${url}/user/bgimgchange`, data)
            .then((res) => {
              if (res.data) {
                context.throwSuccess("posted");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    );
  };

  // change profile image
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        20,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  async function handleChangeAvatar(e) {
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
            setAvatar(downloadURL);
            edit();
          });
        }
      );
    } else {
      context.throwErr("File type not supported");
    }
  }

  function edit() {
    let data = {
      avatar,
    };
    api
      .put(`${url}/user`, data)
      .then((res) => {
        if (res.data) {
          context.throwSuccess("updated");
          context.auth = {
            ...context.auth,
            ...data,
          };
          localStorage.setItem("user", JSON.stringify(context.auth));
        }
      })
      .catch((err) => {
        context.throwErr(err.response.data.message);
      });
  }

  const handShake = () => {
    if (!user) return;
    api
      .post(`${url}/chat/handshake`, {
        people: [user._id],
      })
      .then((res) => {
        navigate(`/chats/${res.data.roomId}`);
      })
      .catch((err) => console.log(err));
  };

  async function handleFollow() {
    api.get(`${url}/user/handlefollow/${user._id}`).then((res) => {
      if (res.data?.success) {
        setIFollow((prev) => !prev);
      }
      if (iFollow) {
        setFollowers((f) => f - 1);
      } else {
        setFollowers((f) => f + 1);
      }
    });
  }

  return (
    <>
      {user ? (
        <section className={`relative w-full h-72`}>
          <div className="w-full px-10 py-5 absolute bottom-0 ">
            <div className="rounded-full w-28 h-28 mx-auto">
              <label htmlFor="dropzone-file">
                {/* <div> */}
                <div className="p-3 drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 h-28 w-28 aspect-square rounded-full">
                  <img
                    className="rounded-full w-full h-full cursor-pointer"
                    src={user.avatar || DefaultImg}
                    alt="image description"
                  />
                </div>
                {/* </div> */}
                {user?._id === context?.auth?._id && (
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleChangeAvatar(e)}
                  />
                )}
              </label>
            </div>
            <div className="flex justify-between">
              <div className="">
                <h1 className="text-2xl	font-semibold	font-[Audiowide] text-white textShadow stroke-black	">
                  {user.name.toUpperCase()}
                </h1>
                <p className="text-white font-[Faster-One] font-medium text-xl textShadow">
                  {user?.posts?.length} Post
                </p>
                <span
                  className=" cursor-pointer text-white font-[Faster-One] font-medium text-xl textShadow"
                  onClick={() => {
                    setToggle(1);
                    handleClickOpen();
                  }}
                >
                  {followers} Followers
                </span>
                <br />
                <span
                  className=" cursor-pointer text-white font-[Faster-One] font-medium text-xl textShadow"
                  onClick={() => {
                    setToggle(2);
                    handleClickOpen();
                  }}
                >
                  {user?.followings?.length} Following
                </span>
              </div>

              <div className="grid bottom-0">
                {user?._id === context?.auth?._id && (
                  <div className="flex items-end" >
                    <label htmlFor="imgHandleUp">
                    <span className="group w-12 hover:w-44 h-12 relative  rounded text-neutral-50 duration-700 before:duration-700 before:hover:500 font-bold flex justify-start gap-2 items-center text-center before:absolute">
                    <i className="bx bx-camera bx-sm drop-shadow-md "></i>
                      <span className="origin-left inline-flex duration-100 group-hover:duration-300 group-hover:delay-500 opacity-0 group-hover:opacity-100 border-l-2 transform scale-x-0 group-hover:scale-x-100 transition-all text-base drop-shadow-md ">
                        Edit cover image
                      </span>
                    </span>
                    </label>
                    <input
                        id="imgHandleUp"
                        type="file"
                        className="text-gray-900 bg-[#9DDFD3] border  focus:outline-none hover:bg-[#70dcc7] focus:ring-4 focus:ring-[#97ded1] font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2"
                        onChange={(e) => uploadBgImage(e)}
                        hidden
                      />
                  </div>
                )}

                {user?._id !== context?.auth?._id && (
                  <button
                    type="button"
                    onClick={() => handShake()}
                    className="flex items-center bg-blue-500 text-white gap-1 px-4 py-2 cursor-pointer text-sm font-medium rounded-md hover:bg-blue-400 duration-300 hover:gap-2 hover:translate-x-3 mb-6"
                  >
                    message
                  </button>
                )}

                {user?._id === context?.auth?._id ? (
                  <>{""}</>
                ) : iFollow ? (
                  <button
                  className="flex items-center bg-red-500 text-white gap-1 px-4 py-2 cursor-pointer text-sm font-medium rounded-md hover:bg-red-400 duration-300 hover:gap-2 hover:translate-x-3 mb-6"
                    type="button"
                    onClick={() => handleFollow()}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                  className="flex items-center bg-blue-500 text-white gap-1 px-4 py-2 cursor-pointer font-medium text-sm rounded-md hover:bg-blue-400 duration-300 hover:gap-2 hover:translate-x-3 mb-6"
                    type="button"
                    onClick={() => handleFollow()}
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
          <Dialog
            PaperProps={{
              style: {
                minHeight: "15%",
                maxHeight: "55%",
                minWidth: "400px",
                maxWidth: "400px",
                padding: 0,
                overflowY: "auto",
                borderRadius: "15px",
              },
            }}
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose} className="dark:bg-gray-800">
              <p
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginTop: "-5px",
                  marginBottom: "-3px",
                }}
                className=" dark:text-white"
              >
                {toggle === 2 ? <span>Followings</span> : <span>Followers</span>}
              </p>
            </DialogTitle>
            {
              <DialogContent
                style={{ marginTop: "-9px", minHeight: "5px" }}
                dividers
                className="dark:bg-gray-800"
              >
                <Follower
                  handleClose={handleClose}
                  toggle={toggle}
                  userId={user?._id}
                  
                />
              </DialogContent>
            }
          </Dialog>
          <img
            src={user.bgImage || whiteBgImg}
            alt={user.name}
            className="w-full h-full"
          />
        </section>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default ProfileHeader;
