import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { createChat, createGroupChat, getMyChats, getAllChats, joinPublicChat, joinPrivateChat, getChatMessages, getChatById, getAllMembers, exitChat } from '../controllers/chatController.js'

const router = express.Router()

router.post('/', authMiddleware, createChat)
router.get('/:id/members', authMiddleware, getAllMembers)
router.post('/group', authMiddleware, createGroupChat)
router.get('/', authMiddleware, getAllChats)
router.get('/my-chats', authMiddleware, getMyChats)
router.get('/:id', getChatById)
router.post('/:id/join-public', authMiddleware, joinPublicChat)
router.post('/:id/join-private', authMiddleware, joinPrivateChat)
router.get('/:id/messages', authMiddleware, getChatMessages)
router.get('/:id/exit', authMiddleware, exitChat)

export default router