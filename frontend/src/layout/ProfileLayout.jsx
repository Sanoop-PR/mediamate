import React from "react";
import { Outlet } from "react-router-dom";
import ProfileNav from "../pages/profile/ProfileNav";
import ProfileHeader from "../pages/profile/ProfileHeader";

function ProfileLayout() {

  return (
    <div className="">
      <header><ProfileHeader /></header>
      <section className='flex flex-col p-5 gap-5 bg-slate-300 dark:bg-[#344258] md:flex-row'>
        <div className='md:w-1/4'>
          <ProfileNav />
        </div>
        <div className='md:w-3/4'>
          <Outlet/>
        </div>
      </section>
    </div>
  );
}

export default ProfileLayout;
