import React, { useContext, useEffect, useState } from "react";
import Post from "../components/Post";
import GetAllPost from "../components/GetAllPost";
import SuggestedFriends from "../components/SuggestedFriends";
import { api } from "../Interceptor/apiCall";
import { url } from "../baseUrl";
import { AuthContext } from "../context/Auth";
import StoryContainer from "../components/story/StoryContainer";
import AddStory from "../components/story/AddStory";

function Home() {
  
  const [posts, setPosts] = useState([]);
  const context = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [Story, setStory] = useState(context.stories);

  useEffect(() => {
    api
      .get(`${url}/post/get/home`)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      setPosts([]);
    };
  }, []);

  function filterPosts(id) {
    setPosts((posts) => posts.filter((item) => item._id !== id));
  }

  function filterUserPosts(uid) {
    setPosts((posts) => posts.filter((item) => item.owner !== uid));
  }

  function newpost(post) {
    setPosts((posta) => [post, ...posts]);
  }
  context.newPost = newpost;

  return (
    <>
      <div className="home-layout h-auto px-3 gap-4 bg-[#F1F0E8] dark:bg-[#344258]">
        <div className="home-post pt-5">
          <div className="grid gap-4">
            <section className="flex flex-row items-center overflow-scroll border-[1px] scrollbar_hide border-black bg-white dark:bg-[#202836] px-2">
              <AddStory />
              {Story.map((story) => (
                <StoryContainer
                  key={story[0].id}
                  id={story[0].id}
                  owner={story[0].owner}
                  seen={[]}
                />
              ))}
            </section>
            <Post />
            {posts?.length === 0 && !loading && (
              <p className="dark:text-white">No Post to see</p>
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
        <div className="home-right pt-5">
          <div className="grid gap-4">
            <SuggestedFriends />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
