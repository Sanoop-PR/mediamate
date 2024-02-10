import { Suspense, lazy, useState } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "boxicons";
import { useEffect } from "react";

// page
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Home = lazy(() => import("./pages/Home"));
const ChatBox = lazy(() => import("./pages/chat/ChatBox"));
const SeePost = lazy(() => import("./pages/SeePost.jsx"));

// components
const ProfileAbout = lazy(() => import("./pages/profile/ProfileAbout"));
const ProfileAccount = lazy(() => import("./pages/profile/profileAccount"));
const Stream = lazy(() => import("./pages/profile/Stream"));
const SavedPosts = lazy(() => import("./pages/profile/SavedPosts"));
const StoryView = lazy(() => import("./components/story/StoryView.jsx"));
const Loader = lazy(() => import("./components/Loader"));



// layout
import RootLayout from "./layout/RootLayout";
import ProfileLayout from "./layout/ProfileLayout";
import ThemeSwitcher from "./components/ThemeSwitcher";

import { AuthContext } from "./context/Auth";
import { Private } from "./routers/Private";

import Redirect from "./routers/Redirect";
import toast, { Toaster } from "react-hot-toast";
import { api } from "./Interceptor/apiCall";

import { url } from "./baseUrl";
import io from "socket.io-client";
import AuthRedirect from "./pages/AuthRedirect";

export const socket = io(url);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={
    <Suspense fallback={<Loader />}>
      <RootLayout />
      </Suspense>
    }>
      <Route
        index
        element={
          <Redirect>
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          </Redirect>
        }
      />
      <Route
        path="register"
        element={
          <Redirect>
            <Suspense fallback={<Loader />}>
              <Register />
            </Suspense>
          </Redirect>
        }
      />
      <Route
        path="home"
        element={
          <Private>
            <Suspense fallback={<Loader />}>
              <Home/>
            </Suspense>
          </Private>
        }
      />
      <Route
        path="chats/:id"
        element={
          <Private>
            <Suspense fallback={<Loader />}>
              <ChatBox />
            </Suspense>
          </Private>
        }
      />
      <Route path="/story/:userId" element={
        <Private>
          <Suspense fallback={<Loader/>}><StoryView/></Suspense>
        </Private>
      }/>
      <Route path="/seepost/:id" element={
        <Private>
          <Suspense fallback={<Loader/>}><SeePost/></Suspense>
        </Private>
      }/>
      <Route
        path="profile/:username"
        element={
          <Private>
            <Suspense fallback={<Loader />}><ProfileLayout /></Suspense>
          </Private>
        }
      >
        <Route
          index
          path="stream"
          element={
            <Private>
              <Suspense fallback={<Loader />}>
                <Stream />
              </Suspense>
            </Private>
          }
        />
        <Route
          path="profile_about"
          element={
            <Private>
              <Suspense fallback={<Loader />}>
                <ProfileAbout />
              </Suspense>
            </Private>
          }
        />
        <Route
          path="profile_account"
          element={
            <Private>
              <Suspense fallback={<Loader />}>
                <ProfileAccount />
              </Suspense>
            </Private>
          }
        />
        <Route
          path="saved-posts"
          element={
            <Private>
              <Suspense fallback={<Loader />}>
                <SavedPosts />
              </Suspense>
            </Private>
          }
        />
      </Route>
      {/* <Route path=""/> */}
      <Route path="/oauth/redirect" element={<AuthRedirect />} />
      <Route
        path="*"
        element={
          <Private>
            <Suspense fallback={<Loader />}>
              <NotFound />
            </Suspense>
          </Private>
        }
      />
    </Route>
  )
);

function App() {
  socket.on("connection", function (data) {
    console.log(data);
  });
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("user")));
  const [active, setActive] = useState("home");
  const [stories, setStories] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const [sharePost, setSharePost] = useState()

  const throwErr = (err) => {
    toast.error(err, {
      style: {
        fontFamily: "Poppins",
        fontSize: "12.5px",
      },
    });
  };
  const throwSuccess = (msg) => {
    toast.success(msg, {
      style: {
        fontFamily: "Poppins",
        fontSize: "12.5px",
      },
    });
  };
 
  useEffect(() => {
    if (!auth) return;
    api
      .get(`${url}/story/home`)
      .then((res) => {
        setStories(res.data);
      })
      .catch((err) => console.log(err));
  }, [auth]);

  useEffect(() => {
    socket.on("connect");
    if (auth) socket.emit("online", { uid: auth._id });
    return () => {
      socket.off("connect");
    };
  }, [auth]);

  function handleActive(page) {
    setActive(page);
  }
 
  const findStory = (id) => {
    const flatArr = [];
    stories.forEach((item) => {
      flatArr.push(...item);
    });
    const currentIndex = flatArr.findIndex((item) => item.id === id);
    if (currentIndex === -1) {
      return {
        prev: undefined,
        current: undefined,
        next: undefined,
      };
    }
    return {
      prev: currentIndex - 1 >= 0 ? flatArr[currentIndex - 1] : undefined,
      current: flatArr[currentIndex],
      next:
        currentIndex + 1 < flatArr.length
          ? flatArr[currentIndex + 1]
          : undefined,
    };
  };

  // theme - start

  const isBrowserDefaulDark = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const getDefaultTheme = () => {
    const localStorageTheme = localStorage.getItem("theme");
    const browserDefault = isBrowserDefaulDark() ? "dark" : "light";
    return localStorageTheme || browserDefault;
  };

  const [theme, setTheme] = useState(getDefaultTheme());

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // theme -end

  return (
    <>
      <ThemeSwitcher.Provider value={{ theme, setTheme }}>
        <AuthContext.Provider
          value={{
            auth,
            setAuth,
            throwErr,
            throwSuccess,
            handleActive,
            findStory,
            roomDetails,
            setRoomDetails,
            stories,
            setSharePost,
            sharePost
          }}
        >
          <Toaster />
          <RouterProvider router={router} />
        </AuthContext.Provider>
      </ThemeSwitcher.Provider>
    </>
  );
}

export default App;
