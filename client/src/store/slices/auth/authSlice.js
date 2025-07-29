import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginUserAPI, registerUserAPI, checkAuthAPI } from './authAPI'
const ValidEmail = (email) => /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i.test(email)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }) => {
    try {
      if (password.length < 6) {
        alert('Пароль должен содержать не менее 6 символов')
        return
      }
      if (username.length < 3) {
        alert('Имя должно содержать не менее 3 символов')
        return
      } 
      const res = await loginUserAPI(username, password)
      alert('Вы вошли в аккаунт')
      return res
    } catch (err) {
      alert('Ошибка при логине')
      return res.json({ message: `Ошибка при логине на клиенте: ${err.message} `})
    }
  }
)



export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }) => {
	try {
    if (password.length < 6) {
      alert('Пароль должен содержать не менее 6 символов')
      return
    }
    if (username.length < 3) {
      alert('Имя должно содержать не менее 3 символов')
      return
    } 
    if (!ValidEmail(email)) {
      alert('Введите корректную почту')
      return
    }
      const res = await registerUserAPI(username, email, password)
	  alert('Вы зарегистрировались')
	  return res
    } catch (err) {
	  alert('Ошибка при регистрации')
      return res.json({ message: `Ошибка при регистрации на клиенте: ${err.message} `})
    }
  }
)

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
	return await checkAuthAPI()
})

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		status: 'idle',
		error: null
	},
	reducers: {
		logout: state => {
			state.user = null
		},
		setUser: (state, action) => {
			state.user = action.payload
		}
	},
	extraReducers: builder => {
		builder
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(loginUser.pending, state => {
				state.status = 'loading'
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(registerUser.pending, state => {
				state.status = 'loading'
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
			.addCase(checkAuth.pending, state => {
				state.status = 'loading'
			})
			.addCase(checkAuth.fulfilled, (state, action) => {
				state.user = action.payload
				state.status = 'succeeded'
				state.error = null
			})
			.addCase(checkAuth.rejected, (state, action) => {
				state.error = action.error.message
				state.status = 'failed'
				state.user = null
			})
	}
})


export const { logout, setUser } = authSlice.actions
export default authSlice.reducer