import UserRequests from '../functions/userRequests.js'

export const handleLogin = async (logName, logPassword) => {
  const userData = {
    username: logName,
    password: logPassword,
  }

  try {
    const res = await UserRequests.addUser('http://localhost:3000/auth/login', userData)
    if (res.userId) {
      console.log(`Пользователь вошел в систему: ${res.userId}`)
    }
  } catch (error) {
    console.error(`Произошла ошибка в handleLogin, ${error.message}`)
  }
}

export const handleRegister = async (username, email, password) => {
  const userData = {
    username,
    email,
    password,
  }

  try {
    await UserRequests.addUser('http://localhost:3000/auth/register', userData)
  } catch (error) {
    console.log(`Произошла ошибка в handleRegister, ${error.message}`)
  }
}
