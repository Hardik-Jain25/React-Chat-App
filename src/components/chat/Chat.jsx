import React, { useEffect, useRef, useState } from 'react'
import "./chat.css"
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../LIB/firebase'
import { useChatStore } from '../LIB/chatStore'
import { useUserStore } from '../LIB/userStore'
import upload from '../LIB/upload'

const Chat = () => {

    const [chat, setChat] = useState()
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    const [img, setImg] = useState({
        file: null,
        url: "",
    })


    const { currentUser } = useUserStore()
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore()

    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })

            , []
    })


    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data())
        })


        return () => {
            unSub()
        }

    }, [chatId])
    console.log(chat)

    const handleEmoji = e => {
        setText(prev => prev + e.emoji)
        setOpen(false)
    }

    const handleImg = e => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }


    const handleSend = async () => {
        if (text === "") return


        let imgUrl = null
        try {

            if (img.flie) {
                imgUrl = await upload(img.flie)
            }



            await updateDoc(doc(db, "chats", chatId), {
                message: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl })
                }),
            })

            const userIDs = [currentUser.id, user.id]

            userIDs.forEach(async (id) => {


                const userChatsRef = doc(db, "userchats", id)
                const userChatsSnapshot = await getDoc(userChatsRef)

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data()

                    const chatIndex = userChatsData.chats.findIndex(c => c.chatIndex === chatId)

                    userChatsData.chats[chatIndex].lastMessage = text
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false
                    userChatsData.chats[chatIndex].updatedAt = Date.now()

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    })
                }
            })

        } catch (err) {
            console.log(err)

        }


        setImg({
            file: null,
            url: ""
        })

        setText("")
    }





    return (
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing. LOREM78</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {chat?.message?.map((message) => {



                    <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>

                        <div className="text">
                            {message.img && <img src={message.img} alt="" />}
                            <p>{message.text}
                            </p>
                            <span>1 min ago</span>
                        </div>
                    </div>
                })
                }
                {img.url &&
                    <div className="message own">
                        <div className="texts">
                            <img src={img.url} alt="" />
                        </div>
                    </div>}



                <div ref={endRef}></div>


                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="text">
                        <p>Lorem ipsum dolor sit amet.
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">

                    <div className="text">
                        <p>Lorem ipsum dolor sit amet.
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="text">
                        <p>Lorem ipsum dolor sit amet.
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">

                    <div className="text">

                        <p>Lorem ipsum dolor sit amet.  Lorem ipsum dolor sit Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, quis est quisquam iste ipsum voluptate assumenda minima magni dolores animi accusamus laborum obcaecati doloremque fugit, rerum sequi iusto aliquam beatae voluptates incidunt culpa id! Obcaecati animi nobis quos suscipit, eaque corporis fugit voluptas officiis ut!
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>






            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">

                        <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id='file' style={{ display: "none" }} onChange={handleImg} />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
            <input type="text" placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send any message to this person":'Type a message...'} value={text}
                    onChange={e => setText(e.target.value)}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={() => setOpen((prev) => !prev)} />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className='sendButton' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div>
    )
}

export default Chat
