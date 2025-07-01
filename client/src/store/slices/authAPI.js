import axios from 'axios'
const API_URL = 'http://localhost:3000/auth'
axios.defaults.withCredentials = true

export const loginUserAPI = async (username, password) =>
	axios
		.post(`${API_URL}/login`, { username, password })
		.then(res => res.data)

export const registerUserAPI = async (username, email, password) =>
	axios
		.post(`${API_URL}/register`,{ username, email, password })
		.then(res => res.data)