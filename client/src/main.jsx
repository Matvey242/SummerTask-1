import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import store from './store/ReduxStore.js'
import Login from './auth/Login.jsx'
import Register from './auth/Register.jsx'
import Main from './pages/mainPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Register />,
  },
  {
    path: '/users',
    element: <Main />,
  },
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/register',
    element: <Register />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)