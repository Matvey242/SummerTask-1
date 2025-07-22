import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const chatSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Название чата обязательно'],
			trim: true,
			minlength: 2,
			maxlength: 50,
			default: 'New Chat',
			unique: true
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
			type: String
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

chatSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	if (this.password) {
		const salt = await bcrypt.genSalt(10)
		this.password = await bcrypt.hash(this.password, salt)
	}
	next()
})

// Проверка пароля
chatSchema.methods.correctPassword = async (candidatePassword, chatPassword) => {
	return await bcrypt.compare(candidatePassword, chatPassword)
}

const Chat = new mongoose.model('Chat', chatSchema)
export default Chat