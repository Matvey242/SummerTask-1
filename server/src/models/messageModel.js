import mongoose from 'mongoose'

const messageSchema = mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		text: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 400
		},
		date: {
			type: Date,
			default: Date.now
		},
		content: {
			type: String
		}
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
)

const Message = new mongoose.model('Message', messageSchema)

export default Message
