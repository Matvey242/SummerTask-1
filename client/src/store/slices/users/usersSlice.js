import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
const config = { withCredentials: true }

export const getAllUsers = createAsyncThunk('users/getAllUsers', async () => {
    const res = await axios.get('http://localhost:3000/users', config)
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
        builder
			.addCase(getAllUsers.fulfilled, (state, action) => {
				state.users = action.payload
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(getAllUsers.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.users = []
			})
			.addCase(getAllUsers.pending, state => {
				state.status = 'loading'
			})
    },
})

export default usersSlice.reducer