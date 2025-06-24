import dotenv from 'dotenv'
import User from '../models/userModel.js'
import { generateTokens } from '../utils/generateTokens.js'

dotenv.config()


export const register = async (req, res) => {
	try {
		const { username, email, password } = req.body
		const userExists =
			(await User.findOne({ email })) || (await User.findOne({ username }))

		if (userExists) {
			return res.status(400).json({
				message: 'Пользователь с таким email и(-или) username уже зарегистрирован'
			})
		}

		const user = await User.create({ username, email, password })
		const tokens = generateTokens(user._id)

		res.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
			httpOnly: true
		})

		res.cookie('accessToken', tokens.accessToken, {
			maxAge: 10 * 60 * 1000, // 10 минут
			httpOnly: true
		})

		return res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email
		})
	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: `Ошибка регистрации: ${err.message}` })
	}
}

export const login = async (req, res) => {
  try {
  const { username, password } = req.body
  const user = await User.findOne({ username }).select("+password")
  if (!user) {
	return res
	  .status(401)
	  .json({ message: 'Пользователь с таким именем не найден' })
  }
  if (!(await user.correctPassword(password))) {
	return res.status(401).json({ message: 'Введён неверный пароль' })
  }

  const tokens = generateTokens(user._id)
  user.refreshToken = tokens.refreshToken
	res.cookie('refreshToken', tokens.refreshToken, {
		maxAge: 30 * 24 * 60 * 60 * 1000,
		httpOnly: true
	})

	res.cookie('accessToken', tokens.accessToken, {
		maxAge: 10 * 60 * 2000, 
		httpOnly: true
	})

	res.json({
	  message: 'Пользователь успешно зашел на аккаунт',
	  _id: user._id,
	  username: user.username,
	  email: user.email,
	})
} catch (err) {
	console.log(err)
	return res.status(500).json({ message: `Ошибка при логине: ${err.message}` })
}
}

export const logout = (req, res) => {
  try {
    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')
    return res.status(200).json({ message: 'Вы вышли из аккаунта' })
  } catch (err) {
    return res.status(500).json({ message: `Ошибка при выходе из аккаунта: ${err}` })
  }
}
