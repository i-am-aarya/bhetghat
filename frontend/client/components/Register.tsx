import useAuth from '@/hooks/useAuth'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { CircleCheckBig, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'

const Register = () => {

  const { register } = useAuth()

  const [error, setError] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const [passwordsMatch, setPasswordsMatch] = useState(false)

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    if (formData.password === formData.confirmPassword && formData.password.length > 0) {
      setPasswordsMatch(true)
    } else {
      setPasswordsMatch(false)
    }
  }, [formData.password, formData.confirmPassword])

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(
        formData.firstname,
        formData.lastname,
        formData.username,
        formData.email,
        formData.password,
        formData.confirmPassword,
      )
    } catch (error) {
      setError("Error!")
    }
  }


  return (
    <form onSubmit={handleSubmission}>
      <div className='border shadow-md rounded-md flex flex-col gap-3 p-8'>

        <div style={{ imageRendering: "pixelated" }} className='flex justify-center'>
          <Image src="/assets/icons/title-crisp.png" alt="BhetGhat Logo" width={400} height={400}></Image>
        </div>

        <p className='text-4xl font-bold flex justify-center'>Register</p>

        <div>
          <Label
            htmlFor={"firstnameInput"}
            className='text-gray-700'
          >First Name</Label>

          <div className='relative'>


            <div className='absolute top-0 left-0 flex h-full items-center pl-3 pointer-events-none'>
              <User className='w-5 h-5 text-gray-500' />
            </div>

            <Input
              id="firstnameInput"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              type='text'
              className='pl-10'
              placeholder='God'
            />
          </div>
        </div>


        <div className='mt-2'>
          <Label
            htmlFor={"lastnameInput"}
            className='text-gray-700'
          >Last Name</Label>

          <div className='relative'>


            <div className='absolute top-0 left-0 flex h-full items-center pl-3 pointer-events-none'>
              <User className='w-5 h-5 text-gray-500' />
            </div>

            <Input
              id="Input"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              type="text"
              placeholder='Father'
              className='pl-10'
            />
          </div>
        </div>

        <div className='mt-2'>
          <Label
            htmlFor={"usernameInput"}
            className='text-gray-700'
          >Username</Label>

          <div className='relative'>

            <div className='absolute top-0 left-0 flex h-full items-center pl-3 pointer-events-none'>
              <User className='w-5 h-5 text-gray-500' />
            </div>
            <Input
              id="usernameInput"
              name="username"
              value={formData.username}
              onChange={handleChange}
              type='text'
              required
              className='pl-10'
              placeholder='godfather1'
            />
          </div>

        </div>

        <div className='mt-2'>
          <Label
            htmlFor={"emailInput"}
            className='text-gray-700'
          >Email</Label>

          <div className='relative'>

            <div className='absolute top-0 left-0 flex h-full items-center pl-3 pointer-events-none'>
              <Mail className='w-5 h-5 text-gray-500' />
            </div>
            <Input
              id="emailInput"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              className='pl-10'
              placeholder='godfather@corleone.fam'
            />
          </div>
        </div>

        <div className='mt-2'>


          <Label
            htmlFor={"passwordInput"}
            className='text-gray-700 flex w-full justify-between text-center items-center mb-1'
          >
            Password

            {
              passwordsMatch &&
              <p className='text-green-400 font-bold'>Passwords Match!</p>
            }

          </Label>


          <div className='relative'>


            <div className='absolute top-0 left-0 flex h-full items-center pl-3 pointer-events-none'>
              <Lock className='w-5 h-5 text-gray-500' />
            </div>

            <Input
              id="Input"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              required
              className='pl-10'
              placeholder='supersecret#123'
            />


            <div className='absolute right-0 top-0'>
              <Button onClick={() => { setShowPassword(!showPassword) }} type='button' variant={'link'}>
                {
                  showPassword ?
                    <EyeOff className='w-5 h-5 text-gray-500' />
                    :
                    <Eye className='w-5 h-5 text-gray-500' />
                }
              </Button>
            </div>

          </div>


        </div>

        <div className='mt-2'>
          <Label
            htmlFor={"confirmPasswordInput"}
            className='text-gray-700 flex w-full justify-between text-center items-center mb-1'
          >
            Confirm Password

            {
              passwordsMatch &&
              <p className='text-green-400 font-bold'>Passwords Match!</p>
            }

          </Label>

          <div className='relative'>

            <div className='absolute top-0 left-0 flex h-full items-center pl-3 pointer-events-none'>
              <Lock className='w-5 h-5 text-gray-500' />
            </div>

            <Input
              id="confirmPasswordInput"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              required
              className='pl-10'
              placeholder='supersecret#123'
            />


            <div className='absolute right-0 top-0'>
              <Button onClick={() => { setShowPassword(!showPassword) }} type='button' variant={'link'}>
                {
                  showPassword ?
                    <EyeOff className='w-5 h-5 text-gray-500' />
                    :
                    <Eye className='w-5 h-5 text-gray-500' />
                }
              </Button>
            </div>
          </div>

        </div>

        {
          error &&
          <p className='text-red-500 font-bold text-md'>
            {error}
          </p>
        }

        <Button type='submit' className='font-bold text-md'>REGISTER</Button>


        <p className='flex justify-center items-center gap-2 text-center text-sm text-gray-600'>
          Already have an account?
          <Link href="/login" className='text-[#d91656] hover:underline'>
            Sign In Here
          </Link>
        </p>



      </div>

    </form>
  )
}

export default Register