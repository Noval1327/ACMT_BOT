import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat',{
    state: () => ({
        chatId : null,
    }),
    actions:{
        setChatId(id) { 
            this.chatId = id
        },
        clearChatId() {
            this.chatId = null
        }
    },
    persist : true
})