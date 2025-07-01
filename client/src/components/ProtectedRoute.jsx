import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children }) {
  const nav = useNavigate()
  const { accessToken } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) {
      nav('/auth/register')
      setLoading(false)
    } else {
      nav('/users')
    }
    setLoading(false)
  }, [accessToken, nav])
  if (loading) return <div>Loading...</div>
  return accessToken ? children : null
}
