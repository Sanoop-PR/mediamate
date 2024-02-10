import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AuthContext } from "../../context/Auth";

import { url } from "../../baseUrl";
import { api } from "../../Interceptor/apiCall";

function ProfileNav() {
  const [user, setUser] = useState();
  const context = useContext(AuthContext);
  const params = useParams();

  useEffect(() => {
    api
      .get(`${url}/user/${params.username}`)
      .then((resp) => {
        setUser(resp.data);
        if (resp.data._id === context?.auth?._id) {
          // context.handleActive("myprofile");
        } else {
          context.handleActive();
        }
      })
      .catch((err) => console.log(err));
    return () => setUser();
  }, [context, params.username]);
  return (
    <div className=" sticky top-20 ">
      <List className="hidden bg-white dark:bg-[#202836] dark:text-[#ffff] md:block">
        <ListSubheader className="dark:bg-[#202836]" component="div" id="nested-list-subheader">
          <h1 className="dark:text-[#ffff]">My Profile</h1>
        </ListSubheader>
        <Link to="stream" >
          <ListItemButton>
            <ListItemIcon>
              <i className="bx bx-home dark:text-[#a2a5b9]"></i>
            </ListItemIcon>
            <ListItemText primary="Stream" />
          </ListItemButton>
        </Link>
        <Link to="profile_about" >
          <ListItemButton>
            <ListItemIcon>
              <i className="bx bx-user-circle dark:text-[#a2a5b9]"></i>
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItemButton>
        </Link>
        {user?._id === context?.auth?._id && (
        <>
          <Link to="profile_account">
            <ListItemButton>
              <ListItemIcon>
                <i className="bx bx-cog dark:text-[#a2a5b9]"></i>
              </ListItemIcon>
              <ListItemText primary="Account" />
            </ListItemButton>
          </Link>
          <Link to="saved-posts">
            <ListItemButton>
              <ListItemIcon>
                <i className="bx bx-bookmark dark:text-[#a2a5b9]"></i>
              </ListItemIcon>
              <ListItemText primary="Saved Posts" />
            </ListItemButton>
          </Link>
        </>)}
      </List>
      <div className="hidden bg-white dark:bg-[#202836] max-md:block">
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-xs md:text-sm font-medium text-center">
            <li>
              <Link to='stream' className="inline-block p-4 border-b-2 rounded-t-lg dark:text-[#a2a5b9] dark:hover:text-white">
                Stream
              </Link>
            </li>
            <li>
              <Link to='profile_about' className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-white dark:text-[#a2a5b9]">
                About
              </Link>
            </li>
            {user?._id === context?.auth?._id && (
           <>
              <li>
                <Link to='profile_account' className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-white dark:text-[#a2a5b9]">
                Account
                </Link>
              </li>
              <li>
                <Link to="saved-posts" className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-white dark:text-[#a2a5b9] ">
                  Saved Posts
                </Link>
              </li>
           </>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfileNav;
