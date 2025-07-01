import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './slices/usersSlice'
import chatReducer from './slices/chatSlice'
import authReducer from './slices/authSlice'

const store = configureStore({
    reducer: {
        users: usersReducer,
        chat: chatReducer,
        auth: authReducer
    },
})

export default store