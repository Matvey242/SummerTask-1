import express from 'express'
import { getAllUsers } from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { createChat, getMyChats, getChatById, joinChat, createMessage, getChatMessages } from '../controllers/chatController.js'

const router = express.Router()

// get -> получение всех пользователей
router.get('/', authMiddleware, getAllUsers)
router.post('/createChat', authMiddleware, createChat)
router.get('/getChats', authMiddleware, getMyChats)
router.get('/getChatById', authMiddleware, getChatById)
router.post('/joinChat', authMiddleware, joinChat)
router.post('/Chat/:chatId', authMiddleware, createMessage)
router.get('/Chat/:chatId', authMiddleware, getChatMessages)

export default router