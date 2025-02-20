"use client"

import Login from '@/components/Login'
import useAuth from '@/hooks/useAuth'
import React, { useState } from 'react'

const LoginPage = () => {
  return (
    <div className='w-screen h-screen'>

      <div className='flex justify-center items-center h-full'>

        <Login />

      </div>
    </div>
  )
}

export default LoginPage