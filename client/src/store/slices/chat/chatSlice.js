import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
	createChatAPI,
	createGroupChatAPI,
	fetchChatsAPI,
	fetchMyChatsAPI,
	fetchMessagesAPI,
	joinPrivateChatAPI,
	joinPublicChatAPI
} from './chatAPI'

export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
	const response = await fetchChatsAPI()
	return response
})
export const fetchMyChats = createAsyncThunk('chat/fetchMyChats', async () => {
	const response = await fetchMyChatsAPI()
	return response
})
export const fetchMessages = createAsyncThunk('chat/fetchMessages', async chatId => {
	const response = await fetchMessagesAPI(chatId)
	return response
})
export const createChat = createAsyncThunk('chat/createChat', async payload => {
	const response = await createChatAPI(payload)
	return response
})
export const createGroupChat = createAsyncThunk(
	'chat/createGroupChat',
	async payload => {
		const response = await createGroupChatAPI(payload)
		return response
	}
)
export const joinPublicChat = createAsyncThunk(
	'chat/joinPublicChat',
	async chatId => {
		const response = await joinPublicChatAPI(chatId)
		return response
	}
)
export const joinPrivateChat = createAsyncThunk(
	'chat/joinPrivateChat',
	async ({ chatId, password }) => {
		const response = await joinPrivateChatAPI(chatId, password)
		return response
	}
)

const chatSlice = createSlice({
	name: 'chat',
	initialState: {
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
			.addCase(fetchMessages.fulfilled, (state, action) => {
				state.messages = action.payload
				state.status = 'succeeded'
			})
			.addCase(fetchMyChats.pending, state => {
				state.status = 'loading'
			})
			.addCase(fetchMyChats.fulfilled, (state, action) => {
				state.chats = action.payload
				state.status = 'succeeded'
			})
			.addCase(fetchMessages.pending, state => {
				state.status = 'loading'
			})
			.addCase(createChat.fulfilled, (state, action) => {
				state.chats.push(action.payload)
				state.status = 'succeeded'
			})
			.addCase(createChat.pending, state => {
				state.status = 'loading'
			})
			.addCase(createChat.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(createGroupChat.fulfilled, (state, action) => {
				state.chats.push(action.payload)
				state.status = 'succeeded'
			})
			.addCase(createGroupChat.pending, state => {
				state.status = 'loading'
			})
			.addCase(createGroupChat.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(joinPublicChat.fulfilled, (state, action) => {
				console.log(action)
				state.currentChat = action.payload
				state.status = 'succeeded'
			})
			.addCase(joinPublicChat.pending, state => {
				state.status = 'loading'
			})
			.addCase(joinPublicChat.rejected, state => {
				state.status = 'failed'
				state.currentChat = null
			})
	}
})

export const { addMessage, setCurrentChat } = chatSlice.actions
export default chatSlice.reducer