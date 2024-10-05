import { onAuthStateChanged } from "firebase/auth"
import Chat from "./components/chat/Chat"
import Detail from "./components/details/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Notifications from "./components/notifications/Notifications"
import { auth } from "./components/LIB/firebase"
import { useEffect } from "react"
import { useUserStore } from "./components/LIB/userStore"
import { useChatStore } from "./components/LIB/chatStore"


const App = () => {


  const { currentUser, isLoading, fetchUserInfo } = useUserStore()
  const {chatId}  = useChatStore()


  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      // console.log(user)
      fetchUserInfo(user?.uid)
    })

    return () => {
      unSub()
    }

  }, [fetchUserInfo])


  // console.log(currentUser)


  if (isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>

      {
        currentUser? (
          <>
            <List />
            {chatId &&<Chat />}
            {chatId &&<Detail />}
          </>

        ) : (<Login />)
      }

      <Notifications />
    </div>
  )
}

export default App