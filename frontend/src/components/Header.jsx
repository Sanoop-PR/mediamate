import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import logo from "../assets/mediamate-high-resolution-logo-transparent.png";
import { Link } from "react-router-dom";
import { useContext } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useState } from "react";
import { Divider } from "@mui/material";
import { AuthContext } from "../context/Auth";
import { api } from "../Interceptor/apiCall";
import { url } from "../baseUrl";
import defaultImg from "../assets/default.png";
import { useEffect } from "react";
import SuggestedSingleUser from "../components/SuggestedSingleUser";
import Notifications from "./Notifications";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  marginLeft: "10px",
  width: "50%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Header() {
  const context = useContext(AuthContext);
  const [noti, setNoti] = useState([]);

  //todo logout
  const logout = async () => {
    api
      .post(`${url}/auth/logout`, {
        token: localStorage.getItem("refresh_token"),
      })
      .then((resp) => {
        if (resp.data) {
          localStorage.clear();
          window.location.reload();
          context.setAuth(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  context.logout = logout;

  //! search
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);
  const [userResults, setuserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invisible, setInvisible] = React.useState(false);

  useEffect(() => {
    const time = setTimeout(() => {
      if (!text) {
        setLoading(false);
        return;
      }
      api.get(`${url}/user/search/${text}`).then((res) => {
        if (res.data) {
          setuserResults(res.data);
        }
        setLoading(false);
      });
    }, 1200);
    return () => {
      clearInterval(time);
      setuserResults([]);
      setLoading(true);
    };
  }, [text]);

  // todo  get notification
  useEffect(() => {
    api
      .get(`${url}/user/view/notifications`)
      .then((res) => {
        setNoti(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [context]);

  //  profile menu -start
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          bgcolor: "#757575",
          color: "#F9FAFB",
          border: "1px solid black",
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
            bgcolor: "#757575",
            borderLeft: "1px solid black",
            borderTop: "1px solid black",
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={handleMenuClose}>
        {context.auth ? (
          <Link to={`profile/${context?.auth?.username}/stream`}>Profile</Link>
        ) : (
          ""
        )}
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => logout()}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          bgcolor: "#bdbdbd",
          border: "1px solid black",
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            // bgcolor: 'background.paper',
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
            bgcolor: "#bdbdbd",
            borderLeft: "1px solid black",
            borderTop: "1px solid black",
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Link to="chats/all">
        <MenuItem onClick={handleMenuClose}>
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            color="inherit"
            className="max-md:hidden"
          >
            <Badge color="error">
              <i className="bx bx-chat bx-sm"></i>
            </Badge>
          </IconButton>
          <p>Chat</p>
        </MenuItem>
      </Link>
      {context.auth ? (
        <Link to={`profile/${context?.auth?.username}/stream`}>
          <MenuItem onClick={handleMenuClose}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <box-icon name="user-circle" type="solid"></box-icon>
            </IconButton>
            <p>Profile</p>
          </MenuItem>
        </Link>
      ) : (
        ""
      )}
      <Divider />
      <MenuItem onClick={() => logout()}>Logout</MenuItem>
    </Menu>
  );
  //$ menu-end

  //! notification menu
  const [anchorElNot, setAnchorElNot] = React.useState(null);

  const openNot = Boolean(anchorElNot);
  const handleClickNotification = (event) => {
    setAnchorElNot(event.currentTarget);
    setInvisible(true);
  };
  const handleCloseNotification = () => {
    setAnchorElNot(null);
  };

  const notificationMenu = (
    <Menu
      anchorEl={anchorElNot}
      id="account-menu"
      open={openNot}
      onClose={handleCloseNotification}
      onClick={handleCloseNotification}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          width: "470px",
          minHeight: "30px",
          maxHeight: "400px",
          bgcolor: "#424769",
          mt: 1.5,
          paddingX: "8px",
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "#424769",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <div className="w-full max-h-52 overflow-y-scroll scrollbar_hide bg-white dark:bg-transparent">
        {noti.map((item) => (
          <Notifications
            key={item._id}
            seen={item.seen}
            userId={item.user}
            content={item.content}
            postId={item.postId}
            NotificationType={item.NotificationType}
            followbtn={item.NotificationType === 3}
            time={item.time}
            id={item._id}
          />
        ))}
      </div>
    </Menu>
  );
  //  notification menu end
  // dark and light mode
  const { theme, setTheme } = useContext(ThemeSwitcher);
  const handleThemeChange = () => {
    const isCurrentDark = theme === "dark";
    setTheme(isCurrentDark ? "light" : "dark");
    localStorage.setItem("theme", isCurrentDark ? "light" : "dark");
  };

  function serachClickClose() {
    setShow(false)
    setText('')
  }

  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      <AppBar position="static">
        <Toolbar className="shadow-inner bg-[#4CB9E7] dark:bg-[#11235A]">
          <Link to="home">
            <img
              src={logo}
              alt="logo"
              className="w-10 h-10 mix-blend-normal rounded-lg	"
            />
          </Link>
          {
            context?.auth?(
          <Search className="border-dotted border-2 border-yellow-400 max-md:flex">
            <SearchIconWrapper>
              <i className="bx bx-search bx-sm text-[#F4CE14] "></i>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputprops={{ "aria-label": "search" }}
              onClick={() => setShow(true)}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {show && (
              <i className="bx bx-x pe-2 max-md:pt-2" onClick={() => serachClickClose()}></i>
            )}
          </Search>

            ):(
              <span></span>
            )
          }
          {show && (
            <div className="absolute top-16 md:w-96 w-10/12 min-h-20 max-h-80 overflow-auto py-2 px-4 z-50 border-[1px] border-black bg-white dark:bg-[#202836] dark:border-[#DADADA]">
              {userResults.length === 0 && !loading ? (
                <p className="text-black dark:text-white">Nothing to see !</p>
              ) : (
                <>
                  {userResults.map((user) => (
                    <SuggestedSingleUser
                      key={user._id}
                      userId={user._id}
                      avatar={user.avatar}
                      username={user.username}
                      name={user.name}
                    />
                  ))}
                </>
              )}
            </div>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {/* //todo notification  */}
          {
            context?.auth ?(
          <>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              className="max-md:hidden"
              onClick={handleClickNotification}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Badge
                badgeContent={noti.length}
                color="error"
                invisible={invisible}
              >
                <i className="bx bx-bell bx-sm text-[#f4ce14]"></i>
              </Badge>
            </IconButton>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              <Link to="chats/all">
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                  className="max-md:hidden"
                >
                  <Badge color="error">
                    <i className="bx bx-chat bx-sm text-[#F4CE14]"></i>
                  </Badge>
                </IconButton>
              </Link>
  
              <div className="w-10 h-10 relative ">
                <img
                  className="absolute w-auto h-full rounded-full hover:scale-75 z-10 transition duration-700 ease-in-out"
                  src={context?.auth?.avatar || defaultImg}
                  onClick={handleProfileMenuOpen}
                />
                <div className="animate-spin rounded-full  w-auto h-full outline-dotted outline-2 outline-[#f4ce14]"></div>
              </div>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <div className="w-10 h-10 relative ">
                <img
                  className="absolute w-auto h-full rounded-full hover:scale-75 z-10 transition duration-700 ease-in-out"
                  src={context?.auth?.avatar || defaultImg}
                  onClick={handleMobileMenuOpen}
                />
                <div className="animate-spin rounded-full  w-auto h-full outline-dotted outline-2 outline-[#f4ce14]"></div>
              </div>
            </Box>
          </>

            ):(
              <span></span>
            )
          }
          <Box className="ps-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />

              <div
                className={`peer ring-0   rounded-full outline-none duration-300 after:items-center peer-hover:after:scale-75 after:-rotate-180 peer-checked:after:rotate-0 after:duration-500 w-10 h-10  shadow-md   peer-focus:outline-none   after:rounded-full after:absolute after:outline-none after:h-8 after:w-8 after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center ${
                  theme === "light"
                    ? "bg-[#FFC436] after:content-['☀️']   "
                    : "after:content-['🌑'] bg-[#C2D9FF]"
                }  `}
                onClick={handleThemeChange}
              ></div>
            </label>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {renderMenu}
      {notificationMenu}
    </Box>
  );
}
