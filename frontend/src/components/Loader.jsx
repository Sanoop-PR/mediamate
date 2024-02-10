import React from "react";
import "./Loader.css";

function Loader() {
  return (
    // <div>
    //   <div className="loader">
    //     <p className="heading">Loading</p>
    //     <div className="loading">
    //       <div className="load"></div>
    //       <div className="load"></div>
    //       <div className="load"></div>
    //       <div className="load"></div>
    //     </div>
    //   </div>
    // </div>
    <div className="loader">
  <div className="loader__balls">
    <div className="loader__balls__group">
      <div className="ball item1"></div>
      <div className="ball item1"></div>
      <div className="ball item1"></div>
    </div>
    <div className="loader__balls__group">
      <div className="ball item2"></div>
      <div className="ball item2"></div>
      <div className="ball item2"></div>
    </div>
    <div className="loader__balls__group">
      <div className="ball item3"></div>
      <div className="ball item3"></div>
      <div className="ball item3"></div>
    </div>
  </div>
</div>

  );
}

export default Loader;
