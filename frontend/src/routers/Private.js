import { useContext, useEffect } from "react";
import { AuthContext } from "../context/Auth";
import { Navigate, useNavigate } from "react-router-dom";


export function Private({ children }) {
  const context = useContext(AuthContext);

  const navigate = useNavigate();

  // return !context?.auth
  //   ? useEffect(() => {
  //       navigate("/");
  //     }, [])
  //   : children;

  useEffect(() => {
    if (!context.auth) {
      navigate("/");
    }
  }, [context, navigate]);
  return children;
}
