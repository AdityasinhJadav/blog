import React, { use, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import authservice from '../appwrite/auth'
import { Button, Input, Logo } from './index'
import { useForm } from 'react-hook-form'

function Signup() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const { register, handleSubmit } = useForm()

    const create = async (data) => {
        try {
            const user = await authservice.createAccount(data)
            if (user) {
                const userData = await authservice.getCurrentUser(user)
                if (userData) dispatch(userData)
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
                        <Logo width='1--%' />
                    </span>
                </div>
                <h2 className='text-center font-bold text-2xl leading-tight'>Sign in to your account</h2>
                <p className='mt-2 text-center text-black/60 text-base'>
                    already have account?&nbsp;
                    <Link
                        to='/login'
                        className='font-medium text-primary transition-all duration-200 hover:underline'
                    >
                        Log in
                    </Link>
                </p>
                {error && <p className='text-red-400 text-center mb-8'>{error}</p>}
                <form onSubmit={handleSubmit(create)}
                    className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                        type="text"
                        placeholder="Enter you rfull name"
                        label="Full name"
                        {...register(("fullname"),{
                            required:true
                        })}
                        />
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
                            Sign up
                        </Button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup