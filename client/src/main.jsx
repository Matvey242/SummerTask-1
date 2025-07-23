import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store/ReduxStore'
import { SocketProvider } from './context/socket/SocketProvider'
import { ThemeProvider } from './context/theme/ThemeProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
		<Provider store={store}>
			<ThemeProvider>
			<SocketProvider>
				<App />
			</SocketProvider>
			</ThemeProvider>
		</Provider>
)