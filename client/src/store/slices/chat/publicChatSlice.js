import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
	createPublicChatAPI,
	fetchChatsAPI,
	fetchMessagesAPI,
	joinPrivateChatAPI,
	joinPublicChatAPI
} from './chatAPI'

export const fetchPubChats = createAsyncThunk('chat/fetchPubChats', async () => {
	const response = await fetchChatsAPI()
	return response
})
export const fetchPubMessages = createAsyncThunk('chat/fetchPubMessages', async chatId => {
	const response = await fetchMessagesAPI(chatId)
	return response
})
export const createPublicChat = createAsyncThunk('chat/createPublicChat', async payload => {
	const response = await createPublicChatAPI(payload)
	return response
})
export const joinPubPublicChat = createAsyncThunk(
	'chat/joinPubPublicChat',
	async chatId => {
		const response = await joinPublicChatAPI(chatId)
		return response
	}
)
export const joinPubPrivateChat = createAsyncThunk(
	'chat/joinPubPrivateChat',
	async (chatId, password) => {
		const response = await joinPrivateChatAPI(chatId, password)
		return response
	}
)

const chatSlice = createSlice({
	name: 'pubChat',
	initialState: {
		pubChats: [],
		currentPubChat: null,
		pubMessages: [],
		status: 'idle'
	},
	reducers: {
		addPubMessage: (state, action) => {
			state.pubMessages.push(action.payload)
		},
		setCurrentPubChat: (state, action) => {
			state.currentPubChat = action.payload
		}
	},
	extraReducers: builder => {
		builder
			.addCase(fetchPubChats.pending, state => {
				state.status = 'loading'
			})
			.addCase(fetchPubChats.fulfilled, (state, action) => {
				state.pubChats = action.payload
				state.status = 'succeeded'
			})
			.addCase(fetchPubMessages.fulfilled, (state, action) => {
				state.pubMessages = action.payload
				state.status = 'succeeded'
			})
			.addCase(fetchPubMessages.pending, state => {
				state.status = 'loading'
			})
			.addCase(createPublicChat.fulfilled, (state, action) => {
				state.pubChats.push(action.payload)
				state.status = 'succeeded'
			})
			.addCase(createPublicChat.pending, state => {
				state.status = 'loading'
			})
			.addCase(createPublicChat.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(joinPubPublicChat.fulfilled, (state, action) => {
				console.log(action)
				state.currentPubChat = action.payload
				state.status = 'succeeded'
			})
			.addCase(joinPubPublicChat.pending, state => {
				state.status = 'loading'
			})
			.addCase(joinPubPublicChat.rejected, state => {
				state.status = 'failed'
				state.currentPubChat = null
			})
            .addCase(joinPubPrivateChat.fulfilled, (state, action) => {
                state.currentPubChat = action.payload
				state.status = 'succeeded'
            })
            .addCase(joinPubPrivateChat.pending, state => {
				state.status = 'loading'
			})
			.addCase(joinPubPrivateChat.rejected, state => {
				state.status = 'failed'
				state.currentPubChat = null
			})
	}
})

export const { addPubMessage, setCurrentPubChat } = chatSlice.actions
export default chatSlice.reducer