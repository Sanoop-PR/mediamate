import React, { useContext, useEffect, useRef, useState } from "react";
import { api } from "../../Interceptor/apiCall";
import { url } from "../../baseUrl";
import { AuthContext } from "../../context/Auth";
import Emoji from "../Emoji";
import Comments from "./Comments";


function CommentsSection({ postId, userId, filterPosts }) {

  const context = useContext(AuthContext);
  const [post, setPost] = useState("");
  const [comment, setComment] = useState("");
  const [getComments, setGetComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [iFollow, setIFollow] = useState(false);
  const [user, setUser] = useState();
  const [isSaved, setIsSaved] = useState(false);
  const [captionText, setCaptionText] = useState('');
  const [captionShow, setCaptionShow] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const commentRef = useRef();

  const getAllcomment = () =>{
    api.get(`${url}/post/${postId}`).then((res) => {
      // setIsLiked(res.data.likes.includes(context?.auth?._id))
      // setIsLiked(res.data.saved.includes(context?.auth?._id))
      // setLikesCount(res.data.likes.length)
      setGetComments(res.data.comments.reverse())
      setPost(res.data)
      setCaptionShow(res.data.caption)
      setCaptionText(res.data.caption)
    })
  }

  useEffect(() => {
    api.get(`${url}/user/get/${userId}`).then((res) => {
      setUser(res.data)
      setIFollow(res.data.followers.includes(context?.auth?._id))
    })
  }, [context?.auth?._id,userId])
  
  useEffect(() => {
    if (!user) return;
    getAllcomment()
  }, [context?.auth?._id,postId,user])

  function handleComment() {
    api
      .post(`${url}/post/addcomment/${postId}`, {
        comment,
      })
      .then((res) => {
        if (res.data) {
          setGetComments((prev) => {
            return [
              {
                _id: new Date().toString(),
                createdAt: new Date(),
                comment,
                user: context?.auth?._id,
              },
              ...prev,
            ];
          });
          setComment("");
        }
      })
      .catch((err) => console.log(err));
  }
  
  function getEmoji(emoji) {
    setComment((prev) => prev + emoji);
  }
  
  function filterComment(id) {
    setGetComments((prev) => prev.filter((item) => item._id !== id));
  }

  

  return (
    <>
      <section className="">
        <div className="col-span-1 bg-white dark:bg-[#202836] sticky top-20 h-[85vh] p-5 rounded-md border overflow-y-auto scroll-smooth dark:border-[#37445c]">
          <div>
            <h2 className="font-semibold mb-4 text-center py-2 border-b-2 dark:border-[#37445c] dark:text-[#fff]">
              Recent Comments
            </h2>
            {getComments?.map((item)=>(
              <Comments filterComment={filterComment}
              key={item._id}
              owner={post?.owner}
              userId={item.user}
              time={item.createdAt}
              text={item.comment}
              postId={postId}
              id={item._id} />))}

            <button className="text-primary text-sm font-semibold mt-3 w-full dark:text-[#fff]" type="button" onClick={getAllcomment()}>
              Load More
            </button>
          </div>

          {getComments?.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg font-semibold mb-4">No Comments Yet</p>
          </div>
           )} 
        </div>
        <div className="relative">
          <form>
            <label htmlFor="chat" className="sr-only">
              Your message
            </label>
            <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
              <button
                type="button"
                className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                onClick={(e)=>{
                  e.stopPropagation();
                  setShowEmojiPicker((prev)=>!prev);
                }}
              >
                <i className='bx bx-happy bx-sm' ></i>
                <span className="sr-only">Add emoji</span>
              </button>
              <textarea
                id="chat"
                rows="1"
                className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Your comment..."
                value ={comment}
                onChange={(e)=>setComment(e.target.value)}
                ref={commentRef}
              ></textarea>
              <button
                className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                onClick={()=>handleComment()}
                type='button'
              >
                <i className='bx bx-send bx-sm'></i>
                <span className="sr-only">Send message</span>
              </button>
            </div>
          </form>
            {showEmojiPicker && (
        <div
          className="emoji-picker absolute bottom-14"
        >
          <Emoji getEmoji={getEmoji} />
        </div>
      )}
        </div>
      </section>
    </>
  );
}

export default CommentsSection;
