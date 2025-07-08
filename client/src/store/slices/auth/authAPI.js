import axios from 'axios'
import { SERVER_URL } from '../../config'

export const loginUserAPI = async (username, password) =>
	axios
		.post(`${SERVER_URL}/auth/login`, { username, password }, { withCredentials: true })
		.then(res => res.data)

export const registerUserAPI = async (username, email, password) =>
	axios
		.post(
			`${SERVER_URL}/auth/register`,
			{ username, email, password },
			{ withCredentials: true }
		)
		.then(res => res.data)

export const checkAuthAPI = async () => {
	return axios
		.get(`${SERVER_URL}/auth/check-auth`, { withCredentials: true })
		.then(res => res.data)
}