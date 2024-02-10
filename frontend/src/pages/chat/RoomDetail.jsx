import React from 'react'
import DefaultImg from "../../assets/default.png";
import ReactTimeAgo from "react-time-ago";

function RoomDetail({details}) {
  return (
    <>
      {
        details?.roomDetails ? (
          <div className='flex items-center'>
            <img className='w-10 h-10 relative rounded-full' src={details?.image ? details.image: DefaultImg} alt={details.room}/>
            {details.online &&(
              <span className="bg-green-500 w-2 h-2 rounded-full relative top-4 -left-2 z-30" ></span>
            )}
            <div className='dark:text-white ps-2'>
              <p className=' font-bold text-sm'>{details.room}</p>
              {
                details.online ?(
                  <p className='text-xs'>Active Now</p>
                ):
                (
                  <p >
                    {
                      details.lastSeen && (
                        <>
                        <span className='text-xs' >
                          Active
                        </span> &nbsp;
                        <ReactTimeAgo date={Date.parse(details.lastSeen)}
                                locale="en-US"
                                timeStyle="twitter" className='text-xs'/> &nbsp;
                                <span className='text-xs'>ago</span>
                        </>
                      )
                    }
                  </p>
                )
              }
            </div>
          </div>
        ):(
          <div>
            <div>
            <img className='w-8 h-8 rounded-full' src={details.image || DefaultImg} alt={details.room} />
            <p className='dark:text-white'>{details.room}</p>
            </div>
          </div>
        )
      }
    </>
  )
}
 
export default RoomDetail