'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/(auth)/AuthContext' 
import Logout from '@/components/buttons/Buttons'
import DashboardButton from '@/components/buttons/DashboardButton'
import { useEffect } from 'react';
import AuthGuard from '@/(auth)/authGuard';


export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth() as {
    user: { username?: string; email?: string } | null
    logout: () => Promise<void>
  }

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  const handleLogout = async (): Promise<void> => {
    try {
      await logout()
      router.push('/')
    } catch (err) {
      alert('Failed to logout.')
      console.error(err)
    }
  }

  if (!user) return null // or loading spinner

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Welcome, {user.username || user.email || 'User'}!
        </h1>
      
        <div className="grid grid-cols-2 gap-4 mb-6">

          <DashboardButton label="Inventory" to="/inventory" />
          <DashboardButton label="Expenses" to="/expenses" />
          <DashboardButton label="Income" to="/income" />
          <DashboardButton label="Menu" to="/menu" />
          <DashboardButton label="Transactions" to="/transaction" />
          <DashboardButton label="Report" to="/report" />
         
        </div>
        
          
        <div className="mt-6 flex justify-center">
          <Logout
            onClick={handleLogout}
            label="Logout"
            disabled={false}
            loading={false}
            fullWidth={true}
            type="button"
          />
        </div>
      </div>
    </div></AuthGuard>
  )
}
