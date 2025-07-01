import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { createChat, getMyChats, getChatById, joinPublicChat, joinPrivateChat, getChatMessages } from '../controllers/chatController.js'

const router = express.Router()

router.post('/createChat', authMiddleware, createChat)
router.get('/getChats', authMiddleware, getMyChats)
router.get('/getChatById', authMiddleware, getChatById)
router.post('/:id/join-public', authMiddleware, joinPublicChat)
router.post('/:id/join-private', authMiddleware, joinPrivateChat)
router.get('/:id/messages', authMiddleware, getChatMessages)

export default router