// import { useId } from "react"
import React, {useId} from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = 'text',
    className = '',
    ...props
}, ref) {
    const id = useId()
    return (
        <div className='w-full'>
            {label && (
                <label className='inline-block mb-1 text-sm font-medium text-gray-700' htmlFor={id}>
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`px-3 py-2 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 border border-gray-300 w-full ${className}`}
                ref={ref}
                id={id}
                {...props}
            />
        </div>
    )
})

export default Input