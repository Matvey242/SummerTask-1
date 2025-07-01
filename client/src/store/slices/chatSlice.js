import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'
import {
	createChatAPI,
	fetchChatsAPI,
	fetchMessagesAPI,
	joinPrivateChatAPI,
	joinPublicChatAPI
} from './chatAPI'

export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
	const response = await fetchChatsAPI()
	return response.data
})
export const fetchMessages = createAsyncThunk('chat/fetchMessages', async chatId => {
	const response = await fetchMessagesAPI(chatId)
	return response.data
})
export const createChat = createAsyncThunk('chat/createChat', async payload => {
	const response = await createChatAPI(payload)
	return response.data
})
export const joinPublicChat = createAsyncThunk(
	'chat/joinPublicChat',
	async chatId => {
		const response = await joinPublicChatAPI(chatId)
		return response.data
	}
)
export const joinPrivateChat = createAsyncThunk(
	'chat/joinPrivateChat',
	async (chatId, password) => {
		const response = await joinPrivateChatAPI(chatId, password)
		return response.data
	}
)

// ???
export const initSocket = createAsyncThunk(
	'chat/initSocket',
	async (_, thunkAPI) => {
		const socket = io('http//localhost:3000', {
			withCredentials: true
		})

		socket.on('newMessage', msg => thunkAPI.dispatch(addMessage(msg)))
		socket.on('userJoined', info => console.log('User joined', info))
		socket.on('userLeft', info => console.log('User left', info))

		return socket
	}
)

const chatSlice = createSlice({
	name: 'chat',
	initialState: {
		socket: null,
		chats: [],
		currentChat: null,
		messages: [],
		status: 'idle'
	},
	reducers: {
		addMessage: (state, action) => {
			state.messages.push(action.payload)
		},
		setCurrentChat: (state, action) => {
			state.currentChat = action.payload
		}
	},
	extraReducers: builder => {
		builder
			.addCase(fetchChats.pending, state => {
				state.status = 'loading'
			})
			.addCase(fetchChats.fulfilled, (state, action) => {
				state.chats = action.payload
				state.status = 'succeeded'
			})
			.addCase(initSocket.fulfilled, (state, action) => {
				state.socket = action.payload
			})
			.addCase(fetchMessages.fulfilled, (state, action) => {
				state.messages = action.payload
			})
			.addCase(createChat.fulfilled, (state, action) => {
				state.chats.push(action.payload)
			})
	}
})

export const { addMessage, setCurrentChat } = chatSlice.actions
export default chatSlice.reducer