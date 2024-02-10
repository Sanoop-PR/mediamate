import {
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { url } from "../baseUrl";
import { api } from "../Interceptor/apiCall";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";

function Post() {
  const [imgurl, setImgUrl] = useState("");
  const [caption, setCaption] = useState("");
  const context = useContext(AuthContext);


  // get image
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (
      !(
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg"
      )
    ) {
      context.throwErr("FIle type not supported");
    }else {
      const storageRef = ref(storage, "images/" + file.name);
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
          });
        }
      );
    }
  };

  // handle post upload image
  const handlePostImage = async () =>{
    if (!caption) {
      return context.throwErr('cation required')
    }
    const data ={
      caption:caption,
      files:[{
        fileType: "image",
        link: imgurl
      }]
    }
    api.post(`${url}/post/create`,data).then((res)=>{
      if (res.data) {
        context.throwSuccess("posted")
        context.newPost(res.data)
      }
    })
  }
 
  return (
    <>
      <form className="grid gap-2 p-2 border-[1px] border-black bg-white dark:bg-[#202836]">
        <div className="">
          <label htmlFor="editor" className="sr-only">
            Publish post
          </label>
          {imgurl ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="imageup w-40">
                <img
                className="w-full h-full m-auto"
                  src={imgurl}
                  alt=""
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <textarea
            id="editor"
            rows="2"
            className="block w-full px-3 text-sm text-gray-800 bg-white border-0 dark:bg-gray-700 focus:ring-0 dark:text-white dark:placeholder-gray-400"
            placeholder="Write your post"
            value={caption}
            onChange={e => setCaption(e.target.value)}
          ></textarea>
        </div>
        <Divider />
        <ul className="flex justify-between">
          <li className="py-2 dark:text-[#888da8]">
            <label htmlFor="imgHandleUp" >
              <i className="bx bx-image-alt"></i>
              <span className="text-xs sm:text-sm">Image</span>
            </label>
            <input onChange={e => uploadImage(e)} id="imgHandleUp" type="file" multiple hidden />
          </li>
          {/* <li className="py-2 dark:text-[#888da8]">
            <i className="bx bxs-file-gif"></i>
            <span className="text-xs sm:text-sm">Gif</span>
          </li>
          <li className="py-2 dark:text-[#888da8]">
            <i className="bx bxs-file-plus"></i>
            <span className="text-xs sm:text-sm">Attachment</span>
          </li>
          <li className="py-2 dark:text-[#888da8]">
            <i className="bx bx-microphone"></i>
            <span className="text-xs sm:text-sm">Audio</span>
          </li> */}
          <li>
            <button onClick={()=> handlePostImage()} className="px-4 py-2 rounded-full bg-[#98E4FF] hover:bg-[#80B3FF] active:bg-[#687EFF] focus:outline-none focus:ring focus:ring-[#B6FFFA] text-xs sm:text-sm">
              post
            </button>
          </li>
        </ul>
      </form>
    </>
  );
}

export default Post;
