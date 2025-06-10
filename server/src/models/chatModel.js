import mongoose from 'mongoose'

const chatSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 50,
			default: 'New Chat'
		},
		privacy: {
			type: String,
			enum: ['public', 'private'],
			default: 'public'
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true
			}
		],
		password: {
			type: String,
			select: false
		},
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message'
			}
		]
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
)

const Chat = new mongoose.model('Chat', chatSchema)

export default Chat
