"use client"

import React, { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/')
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    })

    if (result?.ok) {
      router.push('/')
      toast({
        title: "Auth Successful",
        description: "User has been logged in successfully.",
        action: (
          <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
        )
      })
    } else {
      console.error('Failed to login')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-black">
      <div className="w-full max-w-md p-8 space-y-6 dark:bg-black rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium dark:text-white">Email:</label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium dark:text-white">Password:</label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200">
            Login
          </button>
        </form>
        <h1>Dont have an Account, <Link href={'/sign-up'} className='underline'>Create One</Link></h1>
      </div>
    </div>
  )
}

export default LoginPage