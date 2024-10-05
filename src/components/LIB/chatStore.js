import { doc, getDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { db } from './firebase'
import { useUserStore } from './userStore'

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,

    changeChat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser



        // CHECK IF THE CURRENT USERT IS BLOCKED


        if (user.blocked.include(currentUser.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,
            })
        }



        // CHECK IF THE RECEIVER USER IS BLOCKED 



        if (currentUser.blocked.include(user.id)) {
            return set({
                chatId,
                user: user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: true,
            })
        }
else{

 return   set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,  
    })
}
    },



    changeBlock: () => {
        set(state => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }))
        
    },
}))