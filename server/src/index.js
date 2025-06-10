import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import authRouter from './routes/authRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(
	cors({
		origin: '*',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
	})
)
app.use(express.json())

app.use('/auth', authRouter)

app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
	mongoose
		.connect(process.env.MONGO_URI)
		.then(() => {
			console.log('Connected to MongoDB')
		})
		.catch(err => {
			console.log(err)
		})
})
