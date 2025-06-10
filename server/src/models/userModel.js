import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
			maxlength: 20
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			match: [
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				'Please enter a valid email address'
			]
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			select: false
		},
		chats: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Chat'
			}
		]
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform: (doc, ret) => {
				delete ret.password
				return ret
			}
		},
		toObject: {
			virtuals: true
		}
	}
)

// Хеширование пароля перед сохранением
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})


// Проверка пароля
userSchema.methods.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = new mongoose.model('User', userSchema)

export default User
