import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './slices/users/usersSlice'
import chatReducer from './slices/chat/chatSlice'
import authReducer from './slices/auth/authSlice'

const store = configureStore({
    reducer: {
        users: usersReducer,
        chat: chatReducer,
        auth: authReducer
    },
})

export default store