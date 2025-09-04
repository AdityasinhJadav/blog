import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import authservice from '../appwrite/auth'
import { Button, Input, Logo } from './index'
import { useForm } from 'react-hook-form'
import { login as authLogin } from '../store/authSlice'

function Signup() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const { register, handleSubmit } = useForm()

    const [isLoading, setIsLoading] = useState(false);

    const create = async (data) => {
        if (isLoading) return;
        
        try {
            setIsLoading(true);
            setError("");
            
            console.log("Creating account with:", { 
                email: data.email, 
                name: data.name 
            });
            
            const session = await authservice.createAccount({
                email: data.email,
                password: data.password,
                name: data.name
            });
            
            if (session) {
                console.log("Account created, getting user data...");
                const userData = await authservice.getCurrentUser();
                if (userData) {
                    console.log("User data received, logging in...");
                    dispatch(authLogin(userData));
                    navigate('/');
                } else {
                    setError("Failed to get user data");
                }
            }
        } catch (error) {
            console.error("Signup error:", error);
            setError(error.message || "Error creating account");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='flex items-center justify-center w-full'>
            <div className={`mx-auto w-full max-w-md sm:max-w-lg bg-gray-100 rounded-xl p-8 sm:p-10 border border-gray-200 shadow-sm`}>
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[80px] sm:max-w-[100px]'>
                        <Logo width='100%' />
                    </span>
                </div>
                <h2 className='text-center font-bold text-2xl leading-tight'>Create an account</h2>
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
                            placeholder="Enter your full name"
                            label="Full Name: "
                            {...register("name", {
                                required: "Name is required",
                                minLength: {
                                    value: 2,
                                    message: "Name must be at least 2 characters long"
                                }
                            })}
                        />
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            label="Email: "
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Please enter a valid email address"
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            placeholder="Enter your password"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long"
                                }
                            })}
                        />
                        <Button
                            type='submit'
                            className='w-full'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing up...' : 'Sign up'}
                        </Button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup