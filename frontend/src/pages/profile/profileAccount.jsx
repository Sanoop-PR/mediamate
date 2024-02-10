import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { url } from "../../baseUrl";
import { api } from "../../Interceptor/apiCall";
import { AuthContext } from "../../context/Auth";
import { useNavigate, useParams } from "react-router-dom";


function profileAccount() {

  const [resetPasword, setResetPassword] = useState("");
  const [resetNewPasword, setResetNewPassword] = useState("");
  const [resetConfirmPasword, setResetConfirmPassword] = useState("");
  const context = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`${url}/user/${params.username}`)
      .then((resp) => {
        if (resp.data._id === context?.auth?._id) {
          context.handleActive("myprofile");
        } else {
          navigate('/home')
        }
      })
      .catch((err) => console.log(err));
  }, [context, params.username]);

  async function handlePasswordChange() {
    api
      .put(`${url}/user/changepassword`, {
        password: resetPasword,
        newPassword: resetNewPasword,
        confirmPassword: resetConfirmPasword,
      })
      .then((res) => {
        if (res.data?.success) {
          context.throwSuccess("Updated password");
          setResetConfirmPassword("");
          setResetNewPassword("");
          setResetPassword("");
        }
      })
      .catch((err) => context.throwErr(err.response.data.message));
  }


  return (
    <div className="bg-white p-5 dark:bg-[#202836]">

      <form>
        <div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Old Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
              value={resetPasword}
              onChange={(e) => setResetPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              value={resetNewPasword}
              required
              onChange={(e) => setResetNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirm_password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirm_password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
              value={resetConfirmPasword}
              onChange={(e) => setResetConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between pt-5">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center"
          >
            close
          </button>
          {!(resetPasword && resetNewPasword && resetConfirmPasword) ? (
            <button
              disabled
              className="text-white bg-blue-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center cursor-not-allowed"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center"
              onClick={() => handlePasswordChange()}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default profileAccount;
