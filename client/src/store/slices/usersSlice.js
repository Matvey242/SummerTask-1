import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getUsers = createAsyncThunk('users/getUsers', async () => {
    const res = await axios.get('http://localhost:3000/users')
    return res.data
})

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        status: 'idle'
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUsers.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.users = action.payload
            })
    },
})

export default usersSlice.reducer