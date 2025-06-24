import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './slices/userSlices'

const store = configureStore({
    reducer: {
        users: usersReducer, 
    },
})

export default store