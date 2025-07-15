import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store/ReduxStore'
import { SocketProvider } from './context/SocketProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
		<Provider store={store}>
			<SocketProvider>
				<App />
			</SocketProvider>
		</Provider>
)