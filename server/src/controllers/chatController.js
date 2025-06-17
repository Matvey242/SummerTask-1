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

export const joinChat = async (req, res) => {
    try {
        const { id } = req.body
        const chat = await Chat.findOne({ _id: id })
        const curUser = req.user._id
        const UpdChat = await Chat.findByIdAndUpdate(
            chat,
            { $push: { members: curUser } }
        )
         await User.findByIdAndUpdate(
            req.user._id,
            { $push: { chats: chat._id } }
        )
         return res.status(200).json({ message: 'Вы присоединились к чату', UpdChat })
    } catch (err) {
        return res.status(500).json({ message: `Ошибка при входе в чат: ${err.message}` })
    }
}

export const createMessage = async (req, res) => {
    try {
        const { text } = req.body
        const { chatId } = req.params
        const authorId = req.user._id
        const message = await Message.create({ text, author: authorId, chat: chatId })
        await Chat.findByIdAndUpdate(
            chatId,
            { $push: { messages: message._id } }
        )
        return res.status(200).json({ message: 'Сообщение создано', message })
    } catch (err) {
        return res.status(500).json({ message: `Ошибка при создании сообщения: ${err.message}` })
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