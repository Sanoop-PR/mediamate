import React from 'react'
import Type from '../../assets/Typing.gif'

function Typing({user:userID}) {
  return (
    <div>
        <img src={Type} alt="typing" className=' w-6 ' />
    </div>
  )
}

export default Typing