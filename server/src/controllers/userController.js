import User from '../models/userModel.js'

export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.user._id

		const users = await User.find({ _id: { $ne: currentUserId } }).select(
			'_id username email'
		)

		res.json(users)
	} catch (err) {
		next(err)
	}
}
