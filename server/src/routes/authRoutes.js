import express from 'express'
import { checkAuth, login, register, logout } from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
const router = express.Router()

router.get('/check-auth', authMiddleware, checkAuth)
router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

export default router