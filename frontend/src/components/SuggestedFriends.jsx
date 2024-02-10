import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Divider } from "@mui/material";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "../context/Auth";
import { api } from "../Interceptor/apiCall";
import { url } from "../baseUrl";
import SuggestedSingleUser from "./SuggestedSingleUser";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

export default function SuggestedFriends() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [completeSuggestions, setCompleteSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  // dialog open
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    api
      .get(`${url}/user/suggestions?limit=15`)
      .then((res) => {
        setSuggestedUsers(res.data.slice(0, 5));
        setCompleteSuggestions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <List className="bg-white rounded-lg dark:bg-[#202836] dark:text-[#a2a5b9]">
      <ListItem>
        <ListItemText className="dark:text-[#ffff]">
          Suggested Friends
        </ListItemText>
        <i
          className="bx bx-dots-vertical-rounded bx-sm font-medium] cursor-pointer hover:bg-slate-200 hover:rounded-full "
          onClick={() => handleClickOpen()}
        ></i>
      </ListItem>
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
        onClose={handleClickClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClickClose} className="dark:bg-gray-800">
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
            {completeSuggestions.map((user) => (
              <SuggestedSingleUser
                key={user._id}
                userId={user._id}
                avatar={user.avatar}
                username={user.username}
                name={user.name}
              />
            ))}
          </DialogContent>
        }
      </Dialog>
      <Divider/>
      {suggestedUsers.map((user) => {
        return (
          <SuggestedSingleUser
            key={user._id}
            userId={user._id}
            avatar={user.avatar}
            username={user.username}
            name={user.name}
          />
        );
      })}
    </List>
  );
}
