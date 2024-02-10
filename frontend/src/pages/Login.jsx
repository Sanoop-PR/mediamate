import React, { useContext, useState } from "react";
import logo from "../../public/mediamate-favicon-black.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../baseUrl";
import { AuthContext } from "../context/Auth";
import {  useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";

function Login() {

  const context = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await axios.post(`${url}/auth/login`,{
        text:username,
        password
      })
      localStorage.setItem('user',JSON.stringify(response.data.user))
      localStorage.setItem('access_token',response.data.access_token)
      localStorage.setItem('refresh_token',response.data.refresh_token)
      context.setAuth(response.data.user)
      // window.location.reload()
      navigate('/home')
      context.throwSuccess(`welcome ${response.data.user.name}`)
    } catch (error) {
      context.throwErr(error.response.data.message)
      console.log(error.response.data.message)
    }
  }

  function handleGoogleAuth(){
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri:process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL,
      client_id:process.env.REACT_APP_GOOGLE_CLIENT_ID,
      
      access_type:"offline",
      response_type:"code",
      prompt:'consent',
      scope:[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
    const qs = new URLSearchParams(options);
    window.location.assign(`${rootUrl}?${qs.toString()}`)
  }

  return (
    <div className="w-full flex flex-wrap dark:bg-gray-800 dark:text-white">
      <div className="absolute top-1/3 right-[44.1%] bg-white rotate-[-46deg] rounded-[50%] border-l-[#84cc16] border-t-[#84cc16] border-[5px] border-solid hidden md:block dark:bg-gray-400 dark:border-r-gray-800 dark:border-b-gray-800 dark:border-l-[#14440a] dark:border-t-[#14440a]">
        <img src={logo} className="rounded-full rotate-[46deg]" />
      </div>
      {/* <!-- Login Section --> */}
      <div className="w-full md:w-1/2 flex flex-col max-md:h-screen">
        <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
          <form className="flex flex-col pt-3 md:pt-8">
            <div className="flex flex-col pt-4">
              <label htmlFor="email" className="text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col pt-4">
              <label htmlFor="password" className="text-lg">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="bg-lime-600 text-white font-bold text-lg hover:bg-lime-700 p-2 mt-6"
              onClick={() => login()}
            >Login</button>
          </form>
          <Divider>or</Divider>
          <button className="flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black relative" onClick={() => handleGoogleAuth()} type="button">
              <span className="absolute left-4">
                <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <path fill="#EA4335 " d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                  <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                  <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
              </svg>
              </span>
              <span>Sign in with Google</span>
            </button>
          <div className="text-center pt-12 pb-12">
            <p>
              Don't have an account?
              <Link to="register" className="underline font-semibold">
                Register here.
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* <!-- Image Section --> */}
      <div className="w-1/2 hidden md:block">
        <div className="w-full  h-screen bg-lime-500	 grid place-items-center dark:bg-[#14440a]">
          <p className="text-center text-5xl text-white	font-bold">Welcome</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
