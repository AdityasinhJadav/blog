import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import authservice from '../appwrite/auth'
import { login as authLogin } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import { Input, Button, Logo } from './index'
import { useForm } from 'react-hook-form'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState('')
    const { register, handleSubmit } = useForm()

    const login = async (data) => {
        try {
            setError('')
            const session = await authservice.login(data)
            if (session) {
                const userData = await authservice.getCurrentUser()
                if (userData) dispatch(authLogin(userData))
                navigate('/')
            }

        } catch (error) {
            setError(error.message)
        }
    }


    return (
        <div className='flex items-center justify-center w-full'>
            <div className={`mx-auto w-full max-w-full bg-gray-100 rounded-xl p-10 border-balck/10`}>
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px] '>
                        <Logo width='100%' />
                    </span>
                </div>
                <h2 className='text-center font-bold text-2xl leading-tight'>Sign in to your account</h2>
                <p className='mt-2 text-center text-black/60 text-base'>
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to='/signup'
                        className='font-medium text-primary transition-all duration-200 hover:underline'
                    >
                        Sign up
                    </Link>
                </p>
                {error && <p className='text-red-400 text-center mb-8'>{error}</p>}
                <form onSubmit={handleSubmit(login)}
                    className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            type="email"
                            placeholder="Enater your mail"
                            label="Email: "
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be valid",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            placeholder="Enter your password"
                            type="password"
                            {...register(("password"), { required: true })}
                        />
                        <Button
                            type='submit'
                            className='w-full'
                        >
                            Sign in
                        </Button>

                    </div>




                </form>




            </div>

        </div>
    )
}

export default Login