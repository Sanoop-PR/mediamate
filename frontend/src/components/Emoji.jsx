import React from 'react'
import EmojiPicker from "emoji-picker-react";

function Emoji({getEmoji}) {
  return (
    <EmojiPicker onEmojiClick={(e) => getEmoji(e.emoji)}/>
  )
} 

export default Emoji