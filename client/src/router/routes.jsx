import { createBrowserRouter } from 'react-router'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import Login from '../pages/auth/Login.jsx'
import Register from '../pages/auth/Register.jsx'
import ChatPage from '../pages/main/chatPage.jsx'
import HomePage from '../pages/main/mainPage.jsx'
export const router = createBrowserRouter([
	{
		path: '/',
		element: <ProtectedRoute />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/chat/:chatId', element: <ChatPage /> }
		]
	},
	{ path: '/login', element: <Login /> },
	{ path: '/register', element: <Register /> }
])