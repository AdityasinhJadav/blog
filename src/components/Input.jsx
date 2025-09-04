// import { useId } from "react"
import React, {useId} from 'react'

const Input = React.forwardRef( function Input ({
    label,
    type="text",
    classNamme='',
    ...props
},ref){

    const id=useId()
    return (
        <div className='w-full'>
            {label && <label className='inline-block pl-1 mb-1'
            htmlFor={id} >
                {label}
            </label>  
        }
        <input 
        type={type}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${classNamme}`}
        ref={ref}
        id={id}
        {...props}
        />
        </div>
    )
})

export default Input