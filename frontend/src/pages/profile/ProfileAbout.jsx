import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

import { useState } from "react";
import { url } from "../../baseUrl";
import { api } from "../../Interceptor/apiCall";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth";
import { useParams } from "react-router-dom";

function ProfileAbout() {
  const context = useContext(AuthContext);
  const params = useParams();
  const [username, setUsername] = useState(context?.auth?.username);
  const [email, setEmail] = useState(context?.auth?.email);
  const [bio, setBio] = useState(context?.auth?.bio);
  const [website, setWebsite] = useState(context?.auth?.website);
  const [name, setName] = useState(context?.auth?.name);
  const [phoneNo, setPhoneNo] = useState(context?.auth?.phoneNo);
  const [birthDay, setBirthDay] = useState(context?.auth?.birthDay);
  const [user, setUser] = useState();

  useEffect(() => {
    const today = new Date(context?.auth?.birthDay);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setBirthDay(formattedDate);
  }, [context]);

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

  function edit() {
    let data;
    if (!email) {
      data = {
        username,
        name,
        bio,
        website,
        phoneNo,
        birthDay,
      };
    } else {
      data = {
        email,
        username,
        name,
        bio,
        website,
        phoneNo,
        birthDay,
      };
    }
    api
      .put(`${url}/user`, data)
      .then((res) => {
        if (res.data) {
          context.throwSuccess("updated");
          context.auth = {
            ...context.auth,
            ...data,
          };
          localStorage.setItem("user", JSON.stringify(context.auth));
        }
      })
      .catch((err) => {
        context.throwErr(err.response.data.message);
      });
  }

  function closeBtn() {
    setName(context?.auth?.name);
    setUsername(context?.auth?.username);
    setEmail(context?.auth?.email);
    setPhoneNo(context?.auth?.phoneNo);
    setWebsite(context?.auth?.website);
    setBio(context?.auth?.bio);
    setBirthDay(context?.auth?.birthDay);
  }

  // for futute date disable
  const handleDateChange = (event) => {
    const selected = new Date(event.target.value);
    const today = new Date();

    if (selected.getTime() > today.getTime()) {
      setBirthDay(today.toISOString().split("T")[0]);
    } else {
      setBirthDay(event.target.value);
    }
  };

  return (
    <div className="bg-white p-5 dark:bg-[#202836]">
      {user?._id === context?.auth?._id && (
        <form>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <i
                className="bx bx-user-circle bx-sm dark:text-gray-400 pr-2"
                sx={{ color: "action.active", mr: 1, my: 0.5 }}
              />
              <TextField
                id="input-with-sx"
                label="username"
                variant="standard"
                className="w-full"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                inputprops={{
                  className: "dark:text-white",
                }}
                InputLabelProps={{
                  className: "dark:text-gray-200",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <i
                className="bx bx-user bx-sm dark:text-gray-400 pr-2"
                sx={{ color: "action.active", mr: 1, my: 0.5 }}
              />
              <TextField
                inputprops={{
                  className: "dark:text-gray-200",
                }}
                InputLabelProps={{
                  className: "dark:text-gray-200",
                }}
                id="input-with-sx"
                label="name"
                variant="standard"
                className="w-full"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <i
                className="bx bx-envelope bx-sm dark:text-gray-400 pr-2"
                sx={{ color: "action.active", mr: 1, my: 0.5 }}
              />
              <TextField
                inputprops={{
                  className: "dark:text-gray-200",
                }}
                InputLabelProps={{
                  className: "dark:text-gray-200",
                }}
                id="input-with-sx"
                label="email"
                variant="standard"
                className="w-full"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <i
                className="bx bx-mobile bx-sm dark:text-gray-400 pr-2"
                sx={{ color: "action.active", mr: 1, my: 0.5 }}
              />
              <TextField
                inputprops={{
                  className: "dark:text-gray-200",
                }}
                InputLabelProps={{
                  className: "dark:text-gray-200",
                }}
                id="input-with-sx"
                label="phone no"
                variant="standard"
                className="w-full"
                onChange={(e) => setPhoneNo(e.target.value)}
                value={phoneNo}
              />
            </Box>
            <Box
              className="sm:col-span-2"
              sx={{ display: "flex", alignItems: "flex-end" }}
            >
              <i
                className="bx bx-globe bx-sm dark:text-gray-400 pr-2"
                sx={{ color: "action.active", mr: 1, my: 0.5 }}
              />
              <TextField
                inputprops={{
                  className: "dark:text-gray-200",
                }}
                InputLabelProps={{
                  className: "dark:text-gray-200",
                }}
                id="input-with-sx"
                variant="standard"
                className="w-full"
                type="Date"
                value={birthDay}
                onChange={handleDateChange}
              />
            </Box>
            <Box
              className="sm:col-span-2"
              sx={{ display: "flex", alignItems: "flex-end" }}
            >
              <i
                className="bx bx-globe bx-sm dark:text-gray-400 pr-2"
                sx={{ color: "action.active", mr: 1, my: 0.5 }}
              />
              <TextField
                inputprops={{
                  className: "dark:text-gray-200",
                }}
                InputLabelProps={{
                  className: "dark:text-gray-200",
                }}
                id="input-with-sx"
                label="website"
                variant="standard"
                className="w-full"
                onChange={(e) => setWebsite(e.target.value)}
                type="text"
                value={website}
              />
            </Box>
            <Box
              className="sm:col-span-2"
              sx={{ display: "flex", alignItems: "flex-end" }}
            >
              <i
                className="bx bxs-user-detail bx-sm dark:text-gray-400 pr-2"
                sx={{ color: "action.active", mr: 1, my: 0.5 }}
              />
              <TextareaAutosize
                id="input-with-sx"
                label="bio"
                variant="standard"
                className="w-full border-[1px] dark:bg-[#2a3240]"
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                inputprops={{
                  className: "dark:text-gray-200",
                }}
              />
            </Box>
          </div>
          <div className="flex justify-between pt-5">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center"
              onClick={() => closeBtn()}
            >
              close
            </button>
            {!(username && name) ? (
              <button
                disabled
                type="submit"
                className="text-white bg-blue-400  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center cursor-not-allowed"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={() => edit()}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      )}
      {user?._id !== context?.auth?._id && (
        <section>
          <div className="text-center mt-6 dark:text-gray-200">
            <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
              {user?.username.toUpperCase()}
            </h3>
            <h2 className="text-2xl font-semibold leading-normal mb-2 text-blueGray-700">
              {user?.name}
            </h2>
            <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
              <p>
                <i className="bx bx-envelope mr-2 text-md text-blueGray-400"></i>
                {user?.email}
              </p>
              {user?.phoneNo && (
                <p>
                  <i className="bx bx-mobile mr-2 text-lg text-blueGray-400"></i>
                  {user?.phoneNo}
                </p>
              )}
              {user?.birthDay && (
                <p>
                  <i className="bx bx-mobile mr-2 text-lg text-blueGray-400"></i>
                  {birthDay}
                </p>
              )}
              <p>{user?.website}</p>
            </div>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-university mr-2 text-lg text-blueGray-400 text-justify
              "></i>
              {user?.bio}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ProfileAbout;
