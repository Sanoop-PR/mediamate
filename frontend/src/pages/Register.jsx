import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../baseUrl";
import { AuthContext } from "../context/Auth";

function Register() {
  const context = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPasword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const signup = async () => {
    try {
      const response = await axios.post(`${url}/auth/register`, {
        email,
        password,
        username,
        name,
      });
      context.setAuth(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    } catch (err) {
      context.throwErr(err.response.data.message);
    }
  };

  function handleGoogleAuth(){
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri:import.meta.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL,
      client_id:import.meta.env.REACT_APP_GOOGLE_CLIENT_ID,
      
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
    <div className="w-full grid h-[90vh] place-items-center dark:bg-gray-800 dark:text-white">
      <div class="p-6 shadow rounded-3xl border-2 md:w-2/4 w-3/4">
        <div class="grid gap-4">
          <input
            class="border rounded-lg px-3 py-2 text-sm w-full bg-transparent"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            class="border rounded-lg px-3 py-2 text-sm w-full bg-transparent"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            class="border rounded-lg px-3 py-2 text-sm w-full bg-transparent"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            class="border rounded-lg px-3 py-2 text-sm w-full bg-transparent"
            type="password"
            placeholder="password"
            value={password} onChange={e => setPasword(e.target.value)}
          />
        </div>
        <div class="mt-5">
          {username && password && name && email ? 
            <button
              class="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              type="button"
              onClick={() => signup()}
            >
              Register
            </button>
           : 
            <button
              class="py-2 px-4 bg-blue-400  text-white w-full text-center text-base cursor-not-allowed"
              type="submit"
              disabled
            >
              Register
            </button>
          }
        </div>
        <button className="flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black relative w-full mt-3" onClick={() => handleGoogleAuth()} type="button">
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
        <div class="flex items-center justify-between mt-4">
        <p>already registerd? <Link to="/">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
