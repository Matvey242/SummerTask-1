import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginUserAPI, registerUserAPI } from './authAPI'
const ValidEmail = (email) => /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i.test(email)

export const loginUser = createAsyncThunk(
	'auth/login',
	async ({ username, password }) => {
    if (password.length < 6) {
      alert('Пароль должен содержать не менее 6 символов')
      return
    }
    if (username.length < 3) {
      alert('Имя должно содержать не менее 3 символов')
      return
    } 
		try {
      alert('Вы вошли в аккаунт')
      return await loginUserAPI(username, password)
    } catch (error) {
      return res.json({ message: `Ошибка при логине на клиенте: ${err.message} `})
    }
	}
)


export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }) => {
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

    try {
      alert('Вы зарегистрировались')
      return await registerUserAPI(username, email, password)
    } catch (error) {
      return res.json({ message: `Ошибка при регистрации на клиенте: ${err.message} `})
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    status: 'idle',
    error: null
  },
  reducers: {
    logout: state => {
			state.user = null
      state.accessToken = null
      state.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
		},
    setUser: (state, action) => {
			state.user = action.payload
		}
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.accessToken = localStorage.setItem('accessToken', action.payload.accessToken)
        state.refreshToken = localStorage.setItem('refreshToken', action.payload.refreshToken)
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message
        state.status = 'failed'
        state.user = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.accessToken = localStorage.setItem('accessToken', action.payload.accessToken)
        state.refreshToken = localStorage.setItem('refreshToken', action.payload.refreshToken)
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message
        state.status = 'failed'
        state.user = null
      })
  }
})


export const { logout, setUser } = authSlice.actions
export default authSlice.reducer