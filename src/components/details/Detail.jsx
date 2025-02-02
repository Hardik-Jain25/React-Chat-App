import React from 'react'
import "./detail.css"
import { auth, db } from '../LIB/firebase'
import { useChatStore } from '../LIB/chatStore'
import { useUserStore } from '../LIB/userStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'


const Detail = () => {

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore()

  const { currentUser } = useUserStore()

  const handleBlock = async () => {

if(!user) return

const userDocRef = doc(db, "users", currentUser.id)

try {
  
await updateDoc(userDocRef, {
  blocked : isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id), 
} )

changeBlock()


} catch (err) {
  console.log(err)
}

  }

  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet consectetur.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF9W7zKQKJ25KD6r9VYVhJq96fZhM22Y278g&s" alt="" />
                <span>photo_2024_3.png</span>
              </div>
              <img src="./download.png" alt="" className='icon' />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF9W7zKQKJ25KD6r9VYVhJq96fZhM22Y278g&s" alt="" />
                <span>photo_2024_3.png</span>
              </div>
              <img src="./download.png" alt="" className='icon' />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF9W7zKQKJ25KD6r9VYVhJq96fZhM22Y278g&s" alt="" />
                <span>photo_2024_3.png</span>
              </div>
              <img src="./download.png" alt="" className='icon' />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF9W7zKQKJ25KD6r9VYVhJq96fZhM22Y278g&s" alt="" />
                <span>photo_2024_3.png</span>
              </div>
              <img src="./download.png" alt="" className='icon' />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>

       { isCurrentUserBlocked ?  " You are blocked " :  isReceiverBlocked ? "User Blocked": "Block User"}
        </button>
        <button className='logout' onClick={() => auth.signOut()}>LogOut</button>
      </div>
    </div>
  )
}

export default Detail
