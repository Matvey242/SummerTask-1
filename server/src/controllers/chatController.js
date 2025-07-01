import dotenv from 'dotenv'
import User from '../models/userModel.js'
import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'
import { response } from 'express'

dotenv.config()

export const createChat = async (req, res) => {
    try {
        const { title, privacy, password } = req.body
        const curUser = req.user._id
        if (privacy === 'private' && !password) {
			throw new Error('Для создания приватного чата необходимо указать пароль')
		}
        const chat = await Chat.create({ title, privacy, password })
         await User.findByIdAndUpdate(
            req.user._id,
            { $push: { chats: chat._id } }
        )
        await Chat.findByIdAndUpdate(
            chat._id,
            { $push: { members: curUser } }
        )
        return res.status(201).json({
            _id: chat._id,
            title: chat.title,
            privacy: chat.privacy
        })
    } catch (err) {
        return res.status(500).json({ message: `Ошибка при создании чата: ${err.message}` })
    }
}


export const getMyChats = async (req, res) => {
    try {
        const curUserId = req.user._id
        const user = await User.findById(curUserId).populate('chats')
 		res.status(200).json(user.chats)
    } catch (err) {
        return res.status(500).json({ message: `Ошибка при получении чатов: ${err.message}` })
    }
}


export const getChatById = async (req, res) => {
    try {
        const { id } = req.body
        const chat = await Chat.findOne({ _id: id })
        res.status(200).json(chat)
    } catch (err) {
        return res.status(500).json({ message: `Ошибка при получении чатов по id: ${err.message}` })
    }
}

export const joinPublicChat = async (req, res, next) => {
	try {
		const chatId = req.params.id
		const userId = req.user._id

		const chat = await Chat.findById(chatId)

		if (!chat) {
			res.status(404)
			throw new Error('Чат не найден')
		}

		if (chat.members.includes(userId)) {
			res.status(200).json('Вы успешно зашли в чат')
		} else {
			chat.members.push(userId)
			await chat.save()
			res.status(200).json('Вы успешно присоединилсь к чату')
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
			throw new Error('Неверный пароль')
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

export const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params
        const curUser = req.user._id
        const user = await User.findById(curUser)
        const chat = await Chat.findById(chatId).populate('messages')
        const messages = chat.messages.map(message => ({
            _id: message._id,
            text: message.text,
            created: message.createdAt,
            email: user.email
        }))
        return res.status(200).json(messages)
    } catch (err) {
        return res.status(500).json({ message: `Ошибка при получении сообщений: ${err.message}` })
    }
}