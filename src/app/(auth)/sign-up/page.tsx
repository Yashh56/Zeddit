"use client"

import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

const SignUpPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/')
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await axios.post('/api/signup', { username: name, email, password })
      console.log(res.data)
      const loginResult = await signIn('credentials', {
        redirect: false,
        email,
        password
      })
      if (loginResult?.ok) {
        router.push('/')
      } else {
        console.log("Failed to login after sign-up")
      }
    } catch (error) {
      console.log(error)
    }
  }
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-black">
        <div className="w-full max-w-md p-8 space-y-6 dark:bg-black rounded shadow-md">
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium dark:text-white">Name:</label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
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
              Sign Up
            </button>
          </form>
          <h1>Have an Account ? <Link href={'/sign-in'} className=' underline'>Login Here</Link></h1>
        </div>
      </div>
    )
  }
}

export default SignUpPage