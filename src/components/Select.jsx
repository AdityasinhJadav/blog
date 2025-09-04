import React ,{useId} from 'react'

function Select({
    options = [],
    label,
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
        <select
          {...props}
          id={id}
          ref={ref}
          className={`px-3 py-2 rounded-lg bg-white text-gray-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 border border-gray-300 w-full ${className}`}
        >
            {options.map((option) => (
                <option key={String(option)} value={option}>
                    {String(option)}
                </option>
            ))}

        </select>
    </div>
  )
}

export default React.forwardRef(Select)