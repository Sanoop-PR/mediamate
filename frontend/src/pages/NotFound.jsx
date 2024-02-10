import React from "react";
import "./notFound.css";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="w-full h-screen grid place-content-center place-items-center bg-[linear-gradient(90deg,_#0bd1ff_10%,_#28d5e6_10%_20%,_#45e3cc_20%_30%,_#62edb3_30%_40%,_#7ff699_40%_50%,_#9cff80_50%_60%,_#b0f676_60%_70%,_#c4ed6c_70%_80%,_#d7e562_80%_90%,_#f2d955_90%)]">
          <div className="">
            <svg className="svg404">
              <symbol id="s-text">
                <text className="text_404" text-anchor="middle" x="50%" y="80%">
                  404
                </text>
              </symbol>
  
              <g className="g-ants">
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
              </g>
            </svg>
          <div className="">
            <span>page not found</span>
            <Link to='home'>
              <button className="relative px-8 py-2 rounded-md isolation-auto z-10   before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-lime-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">
                back to home 
                <i className='bx bx-chevron-right bx-sm'></i>
              </button>
            </Link>
          </div>
          </div>
    </div>
  );
}

export default NotFound;

<style></style>;
