import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { createChat, createPublicChat, getMyChats, joinPublicChat, joinPrivateChat, getChatMessages } from '../controllers/chatController.js'

const router = express.Router()

router.post('/', authMiddleware, createChat)
router.post('/', authMiddleware, createPublicChat)
router.get('/', authMiddleware, getMyChats)
router.post('/:id/join-public', authMiddleware, joinPublicChat)
router.post('/:id/join-private', authMiddleware, joinPrivateChat)
router.get('/:id/messages', authMiddleware, getChatMessages)

export default router