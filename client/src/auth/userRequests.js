import axios from 'axios'
axios.defaults.withCredentials = true

export const handleRegister = async ({ email, username, password }) => {
    try {
        const res = await axios.post('http://localhost:3000/auth/register', { email, password, username })
        console.log('Регистрация прошла успешно', res.data)
    } catch (err) {
        console.log('Ошибка при регистрации:', err.message)
    }
}


export const handleLogin = async ({ username, password }) => {
    try {
        const res = await axios.post('http://localhost:3000/auth/login', { username, password })
        console.log('Логин прошел успешно', res.data)
    } catch (err) {
        console.log('Ошибка при логине:', err.message)
    }
}