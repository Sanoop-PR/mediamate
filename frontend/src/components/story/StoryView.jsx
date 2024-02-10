import React, { useContext, useEffect, useMemo, useState } from 'react'
import { api } from "../../Interceptor/apiCall";
import { url } from "../../baseUrl";
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/Auth';
import ViewBox from './ViewBox';
import TopBar from './TopBar';


function StoryView() {
  const [query] = useSearchParams()
  const context = useContext(AuthContext)
  const { findStory } = useContext(AuthContext)

  const stories = useMemo(() => findStory(query.get('id')), [findStory, query])
  
  
  return (
    <div className='w-full h-full bg-[#1a1a1a] absolute top-0 left-0 z-50'>
      <TopBar/>
      <div className='w-full flex items-center justify-center'><ViewBox profile={query.get('profile')} stories={stories} /></div>
    </div>
  )
}

export default StoryView