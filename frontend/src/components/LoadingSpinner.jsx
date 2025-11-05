import React from 'react'

const LoadingSpinner = ({ className = 'h-8 w-8' }) => {
  return (
    <div className={`inline-block ${className} rounded-full border-t-2 border-b-2 border-primary animate-spin`} />
  )
}

export default LoadingSpinner
