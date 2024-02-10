import React, { useContext, useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CommentsSection from "./comment/CommentsSection";
import { url } from "../baseUrl";
import { api } from "../Interceptor/apiCall";
import { AuthContext } from "../context/Auth";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import userImg from "../assets/default.png";
import ReactTimeAgo from "react-time-ago";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import RoomName from "../pages/chat/RoomName";

// comment expand
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function GetAllPost({
  img,
  likes,
  caption,
  time,
  comments,
  userId,
  id,
  saved,
  filterPosts,
  filterUserPosts,
}) {
  const context = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [commentsCount, setCommentsCount] = useState(comments.length);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(likes.includes(context?.auth?._id));
  const [user, setUser] = useState();
  const [isSaved, setIsSaved] = useState(saved.includes(context?.auth?._id));
  const [captionText, setCaptionText] = useState(caption);
  const [captionShow, setCaptionShow] = useState(caption);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [rooms, setRooms] = useState([]);


  const unFollow = () => {
    api.get(`${url}/user/handlefollow/${user._id}`).then((res) => {
      if (res.data?.success) {
        filterUserPosts(user._id);
        context.throwSuccess("Unfollowed User");
        handleClose();
      }
    });
  };

  useEffect(() => {
    api.get(`${url}/user/get/${userId}`).then((res) => {
      setUser(res.data);
    });
  }, [userId]);

  function handleLike() {
    api.put(`${url}/post/handlelike/${id}`).then((res) => {
      if (res.data) {
        if (isLiked) {
          setLikesCount((prev) => prev - 1);
        } else {
          setLikesCount((prev) => prev + 1);
        }
        setIsLiked((prev) => !prev);
      }
    });
  }

  function handleComment() {
    api
      .post(`${url}/post/addcomment/${id}`, {
        comment,
      })
      .then((res) => {
        if (res.data) {
          setCommentsCount((prev) => prev + 1);
          setComment("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSave() {
    api.get(`${url}/post/handlesave/${id}`).then((res) => {
      if (res.data) {
        setIsSaved((prev) => !prev);
      }
    });
  }

  function deletepost() {
    api.delete(`${url}/post/delete/${id}`).then((res) => {
      if (res.data) {
        handleClose();
        context.throwErr("Deleted Post");
        filterPosts(id);
      }
    });
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/seepost/${id}`);
    context.throwSuccess("Copied to clipboard");
    handleClose();
  };
  const commentRef = useRef();

  function getEmoji(emoji) {
    setComment((prev) => prev + emoji);
  }

  // comment expand
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  // menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // share

  const [openShare, setOpenShare] = useState(false);
  const handleShareOpen = () => {
    setOpenShare(true);
    context.setSharePost(id)
  };
  const handleShareClose = () => {
    setOpenShare(false);
    // setSharePost()
  };

  useEffect(() => {
    api
      .get(`${url}/chat/getRooms`)
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [context]);

  return (
    <>
      <Card
        className="dark:bg-[#202836] dark:text-[#a2a5b9]"
        onClick={() => setShowEmojiPicker(false)}
      >
        <CardHeader
          className=""
          avatar={
            <Link to={`/profile/${user?.username}/stream`}>
              <Avatar
                aria-label="recipe"
                scr={user?.avatar ? user.avatar : userImg}
              />
            </Link>
          }
          action={
            <IconButton
              aria-label="settings"
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <i className="bx bx-dots-vertical-rounded bx-sm font-medium dark:text-[#fff]"></i>
            </IconButton>
          }
          title={<span className="dark:text-[#ffff]">{user?.username}</span>}
          subheader={
            <span className="dark:text-[#a2a5b9] text-xs">
              <ReactTimeAgo date={Date.parse(time)} locale="en-US" className=" font-[Times-New-Roman]" />
            </span>
          }
        />
        <CardMedia component="img" image={img} alt="Paella dish" />
        <CardContent>
          <Typography
            variant="body2"
            className="text-gray-600 dark:text-[#a2a5b9]"
          >
            {captionShow}
          </Typography>
          <p>{likesCount} likes</p>
          {commentsCount !== 0 && (
            <div>
              <p>view all {commentsCount} comments</p>
            </div>
          )}
        </CardContent>
        <CardActions className="flex justify-between">

          <div>
            <IconButton
              className="w-10"
              aria-label="like"
              onClick={() => handleLike()}
            >
              {isLiked ? (
                <i className="bx bxs-heart text-red-500 bx-sm"></i>
              ) : (
                <i className="bx bx-heart bx-sm font-medium dark:text-[#ffff]"></i>
              )}
            </IconButton>
            <IconButton className="w-10" aria-label="share" onClick={()=>handleShareOpen()}>
              <i className="bx bx-share bx-sm font-medium dark:text-[#ffff]"></i>
            </IconButton>
            <IconButton
              className="w-10"
              aria-label="save"
              onClick={() => handleSave()}
            >
              {!isSaved ? (
                <i className="bx bx-bookmark bx-sm text-sm dark:text-[#ffff]"></i>
              ) : (
                <i className="bx bxs-bookmark text-red-500 font-medium bx-sm"></i>
              )}
            </IconButton>
          </div>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            className="w-10"
          >
            <i className="bx bx-chevron-down bx-sm font-medium dark:text-[#ffff]"></i>
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <CommentsSection
              filterPosts={filterPosts}
              postId={id}
              userId={userId}
            />
          </CardContent>
        </Collapse>
      </Card>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="-my-2">
          {userId === context?.auth?._id ? (
            <MenuItem
              onClick={() => deletepost()}
              className="dark:bg-[#202836] dark:text-[#a2a5b9]"
            >
              Delete
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => unFollow()}
              className="dark:bg-[#202836] dark:text-[#a2a5b9]"
            >
              Unfollow
            </MenuItem>
          )}
          <MenuItem
            onClick={() => handleCopy()}
            className="dark:bg-[#202836] dark:text-[#a2a5b9]"
          >
            Copy Link
          </MenuItem>
          <MenuItem
            onClick={() => handleClose()}
            className="dark:bg-[#202836] dark:text-[#a2a5b9]"
          >
            cancel
          </MenuItem>
        </div>
      </Menu>
      {/* share */}
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
        className=""
        onClose={handleShareClose}
        aria-labelledby="customized-dialog-title"
        open={openShare}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleShareClose} className="dark:bg-gray-800">
          <p
          className="text-center text-sm font-bold -mt-[5px] -mb-[3px] dark:text-white"
          >
            Suggestions
          </p>
        </DialogTitle>
        {
          <DialogContent
          className="-mt-2 min-w-1	dark:bg-gray-800"
            dividers
          >
            <ul className="space-y-1 font-medium">
            {rooms?.map((item) => (
                    <li key={item.roomId}>
                      <RoomName roomId={item.roomId} place={"home"} />
                    </li>
                  ))}
            </ul>
          </DialogContent>
        }
      </Dialog>
    </>
  );
}
