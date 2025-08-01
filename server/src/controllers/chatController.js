import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'

export const createChat = async (req, res, next) => {
	try {
		const { title, privacy, password, members } = req.body

		if (!members || members.length < 2) {
			throw new Error('Для создания чата необходимо указать минимум 2 участника')
		}

		if (privacy === 'private' && !password) {
			throw new Error('Для создания приватного чата необходимо указать пароль')
		}

		const chat = await Chat.create({ title, privacy, password, members })
		await User.updateMany({ _id: { $in: members } }, { $push: { chats: chat._id } })

		res.status(201).json(chat)
	} catch (err) {
		next(err)
	}
}

export const createGroupChat = async (req, res, next) => {
	try {
		const { title, privacy, password, members } = req.body

		if (privacy === 'private' && !password) {
			throw new Error('Для создания приватного чата необходимо указать пароль')
		}

		const existingChat = await Chat.findOne({
			title,
			members: { $all: members }
		})

		if (existingChat) {
			res.status(401)
			throw new Error('Чат с таким названием уже существует')
		}

		const chat = await Chat.create({ title, privacy, password, members })
		await User.updateMany({ _id: { $in: members } }, { $push: { chats: chat._id } })

		res.status(201).json(chat)
	} catch (err) {
		next(err)
	}
}

export const getAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({})

    if (!chats || chats.length === 0) {
      throw new Error('Чаты не найдены')
    }

    res.status(200).json(chats)
  } catch (err) {
    next(err)
  }
}

export const getMyChats = async (req, res, next) => {
	try {
		const userId = req.user._id
		const chats = await Chat.find({ members: userId })

		if (!chats) {
			throw new Error('Чаты не найдены')
		}
		
		res.status(200).json(chats)
	} catch (err) {
		next(err)
	}
}


export const joinPublicChat = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const userId = req.user._id

		console.log(chatId, userId)

		const chat = await Chat.findById(chatId)

		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}

		if (chat.members.includes(userId)) {
			res.status(200).json(chat._id)
		} else {
			chat.members.push(userId)
			await chat.save()
			res.status(200).json(chat._id)
		}
	} catch (err) {
		next(err)
	}
}

export const joinPrivateChat = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const { password } = req.body
		const userId = req.user._id

		const chat = await Chat.findById(chatId).select('+password')
		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}

		if (chat.privacy !== 'private') {
			res.status(400)
			throw new Error('Это не приватный чат')
		}

		const isMatch = await chat.correctPassword(password, chat.password)
		if (!isMatch) {
			res.status(401)
			throw new Error('Неверный блин пароль')
		}

		if (!chat.members.includes(userId)) {
			chat.members.push(userId)
			await chat.save()
			await User.findByIdAndUpdate(userId, { $push: { chats: chat._id } })
		}

		res.status(200).json({ message: 'Вы успешно присоединились к чату' })
	} catch (err) {
		next(err)
	}
}

export const getChatMessages = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const userId = req.user._id

		const chat = await Chat.findById(chatId)
		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}
		if (!chat.members.includes(userId)) {
			res.status(403)
			throw new Error('У вас нет доступа к этому чату')
		}

		const messages = await Message.find({ chat: chatId })

		res.status(200).json(messages)
	} catch (err) {
		next(err)
	}
}

export const getChatById = async (req, res, next) => {
	try {
		const chat = await Chat.findById(req.params.id)
		if (!chat) throw new Error('Чат не найден')
		res.status(200).json(chat)
	} catch (err) {
		next(err)
	}
}

export const getAllMembers = async (req, res, next) => {
	try {
        const chat = await Chat.findById(req.params.id)
		const members = await User.find({ _id: { $in: chat.members } }).select('_id username email')

		res.json(members)
	} catch (err) {
		next(err)
	}
}


export const exitChat = async (req, res, next) => {
    try {
        const userId = req.user._id
        const chatId = req.params.id

        await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { members: userId } }
        )

        await User.findByIdAndUpdate(
            userId,
            { $pull: { chats: chatId } }
        )

        res.status(200).json({ message: 'Вы успешно вышли из чата' })
    } catch (err) {
        next(err)
    }
}