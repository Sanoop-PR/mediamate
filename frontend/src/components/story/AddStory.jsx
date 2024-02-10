import React, { useContext, useEffect, useState } from "react";
import { api } from "../../Interceptor/apiCall";
import { url } from "../../baseUrl";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { AuthContext } from "../../context/Auth";
import { Link } from "react-router-dom";
import defaultImg from '../../assets/default.png'

function AddStory() {
  const context = useContext(AuthContext);
  const [story, setStrory] = useState([]);
  const [iSaw, setisaw] = useState(true);

  useEffect(() => {
    if (!context?.auth?._id) return;
    api
      .get(`${url}/story/user/${context?.auth?._id}`)
      .then((res) => {
        const seenAll = res.data.reduce(
          (prev, item) => prev && item.seen.includes(context?.auth?._id),
          true
        );
        setisaw(seenAll);
        setStrory(res.data);
      })
      .catch((err) => console.log(err));
  }, [context?.auth?._id]);
  async function handleStoryUpload(e) {
    const file = e.target.files[0];
    if (
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png"
    ) {
      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
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
            api
              .post(`${url}/story`, {
                data: downloadURL,
              })
              .then((res) => {
                if (res.data) {
                  context.throwSuccess("story uplaoded");
                }
              })
              .catch((err) => console.log(err));
          });
        }
      );
    } else {
      context.throwErr("File type not supported");
    }
  }

  return (
    <div>
      <div className="relative flex flex-row items-center">
        {story.length !== 0 ? (
          <Link
            to={`/story/${context?.auth?._id}?id=${story[0].id}&profile=${true}`}
          >
            <img
              src={context?.auth?.avatar || defaultImg}
              alt="image"
              className="w-14 h-14 rounded-full p-1"
            />
          </Link>
        ) : (
          <img
              src={context?.auth?.avatar || defaultImg}
              alt="image"
              className="w-14 h-14 rounded-full p-1"
            />
        )}

        <input
          onChange={(e) => handleStoryUpload(e)}
          type="file"
          id="story_up"
          hidden
        />
        <label
          htmlFor="story_up"
          title="Add new story"
          style={{
            position: "relative",
            top: "15px",
            left: "-12px",
            backgroundColor: "#0095F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            padding: "2px",
            cursor: "pointer",
          }}
        >
          <i className="bx bx-plus text-white text-xs"></i>
        </label>
      </div>
      <span className="text-xs dark:text-white text-center">{"" || context?.auth?.username}</span>
    </div>
  );
}

export default AddStory;