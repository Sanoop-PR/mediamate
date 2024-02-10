import React, { useContext, useEffect, useState } from "react";
import GetAllPost from "../../components/GetAllPost.jsx";
import { api } from "../../Interceptor/apiCall.js";
import { url } from "../../baseUrl";
import { AuthContext } from "../../context/Auth";
import Loader from "../../components/Loader.jsx";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase.js";
import { useParams } from "react-router-dom";

function Stream() {
  const post = true;

  const [posts, setPosts] = useState([]);
  const context = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [imgurl, setImgUrl] = useState("");
  const [caption, setCaption] = useState("");
  const params = useParams();

  useEffect(() => {
    api
      .get(`${url}/user/${params.username}`)
      .then((resp) => {
        setUser(resp.data);
        if (resp.data._id === context?.auth?._id) {
          context.handleActive("myprofile");
        } else {
          context.handleActive();
        }
      })
      .catch((err) => console.log(err));
    return () => setUser();
  }, [context, params.username]);

  useEffect(() => {
    if (!user) return;
    if (post) {
      api
        .get(`${url}/post/userpost/${user?._id}`)
        .then((data) => {
          setLoading(false);
          if (data) {
            setPosts(data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (!post) {
      api
        .get(`${url}/post/get/saved`)
        .then((data) => {
          setLoading(false);
          if (data) {
            setPosts(data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {
      setPosts([]);
    };
  }, [post, user]);

  function filterPosts(id) {
    setPosts((posts) => posts.filter((item) => item._id !== id));
  }

  function filterUserPosts(uid) {
    setPosts((posts) => posts.filter((item) => item.owner !== uid));
  }

  // upload post
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
    }
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
  };

  // handle post upload image
  const handlePostImage = async () => {
    if (!caption) {
      return context.throwErr("cation required");
    }
    const data = {
      caption: caption,
      files: [
        {
          fileType: "image",
          link: imgurl,
        },
      ],
    };
    api.post(`${url}/post/create`, data).then((res) => {
      if (res.data) {
        context.throwSuccess("posted");
        context.newPost(res.data);
        setImgUrl("");
        setCaption("");
      }
    });
  };

  return (
    <div className="">
      {user?._id === context?.auth?._id && (
      <div>
        <form>
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
              {imgurl ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div className="imageup w-40">
                    <img className="w-full h-full m-auto" src={imgurl} alt="" />
                  </div>
                </div>
              ) : (
                ""
              )}
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows="4"
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Publish post..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
              <button
                type="button"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                onClick={() => handlePostImage()}
              >
                post
              </button>
              <div className="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">
                <button
                  type="button"
                  className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 12 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"
                    />
                  </svg>
                  <span className="sr-only">Attach file</span>
                </button>
                <span className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                  <label htmlFor="imgHandleUp">
                    <i className="bx bx-image-alt"></i>
                  </label>
                  <input
                    onChange={(e) => uploadImage(e)}
                    id="imgHandleUp"
                    type="file"
                    multiple
                    hidden
                  />
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>)}
      <div className="grid gap-5">
        {posts.length === 0 && loading && <Loader />}

        {posts.length === 0 && !loading && (
          <p
            style={{
              textAlign: "center",
              marginTop: "72px",
              width: "100%",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            No posts to see
          </p>
        )}
        {posts.map((item) => (
          <GetAllPost
            filterUserPosts={filterUserPosts}
            filterPosts={filterPosts}
            key={item._id}
            id={item._id}
            img={item.files[0].link}
            saved={item.saved}
            userId={item.owner}
            avatar=""
            username=""
            caption={item.caption}
            comments={item.comments}
            time={item.createdAt}
            likes={item.likes}
          />
        ))}
      </div>
    </div>
  );
}

export default Stream;
