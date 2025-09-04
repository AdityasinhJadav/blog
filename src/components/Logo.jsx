import React from 'react'

function Logo({width='100px'}) {
  return (
    <div className="select-none" style={{ width }}>
      <span className="text-xl font-extrabold tracking-tight text-sky-600">Blog</span>
    </div>
  )
}

export default Logo