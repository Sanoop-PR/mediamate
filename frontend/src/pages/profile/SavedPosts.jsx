import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { url } from "../../baseUrl";
import { api } from "../../Interceptor/apiCall";
import { AuthContext } from "../../context/Auth";
import Loader from "../../components/Loader";
import GetAllPost from "../../components/GetAllPost";
GetAllPost
function SavedPosts() {
  const params = useParams();
  const [viewSavedPost, setViewSavedPost] = useState(false);
  const context = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [singleSavedPostData, setSingleSavedPostData] = useState('');

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

    return () => {
      setPosts([]);
    };
  }, [user]);

  function viewPosts(item) {
    setSingleSavedPostData(item)
    setViewSavedPost(true)
  }

  function filterPosts(id) {
    setPosts(posts => posts.filter(item => item._id !== id))
  }

  function filterUserPosts(uid) {
    setPosts(posts => posts.filter(item =>item.owner !== uid))
  }


  return (
    <div className="bg-white p-5 dark:bg-[#202836] cursor-pointer">
      {viewSavedPost === false ? (
        <>
          {posts.length === 0 && loading && <Loader />}
          {posts.length === 0 && !loading && <p className="dark:text-white">No posts to see</p>}

          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {posts?.map((item) => (
                <div key={item._id}>
                <img
                  className="h-auto max-w-full rounded-lg"
                  key={item._id}
                  src={item.files[0].link}
                  alt=""
                  onClick={() => viewPosts(item)}
                />
              </div>
            ))}
              
            </div>
          </div>
        </>
      ) : (
        <div>
          <button type="button" className="cursor-pointer duration-200 hover:scale-125 active:scale-100" onClick={() => setViewSavedPost(false)}>
          <i className='bx bx-left-arrow-alt bx-sm dark:text-white'></i>
          </button> 
          <GetAllPost 
                  filterUserPosts = {filterUserPosts}
                  filterPosts = {filterPosts}
                  key={singleSavedPostData._id}
                  id={singleSavedPostData._id}
                  img={singleSavedPostData.files[0].link}
                  saved={singleSavedPostData.saved}
                  userId={singleSavedPostData.owner}
                  avatar=""
                  username=""
                  caption={singleSavedPostData.caption}
                  comments={singleSavedPostData.comments}
                  time={singleSavedPostData.createdAt}
                  likes={singleSavedPostData.likes}/>
        </div>
      )}
    </div>
  );
}

export default SavedPosts;
