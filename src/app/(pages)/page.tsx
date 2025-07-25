import { useAuth } from '@/(auth)/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace('/dashboard')
    else router.replace('/login')
  }, [user])

  return null
}
