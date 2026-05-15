import React from 'react'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export default function Button({ children, onClick, variant = 'primary', size = 'md', disabled, className }: Props) {
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-400',
    secondary: 'bg-white border border-gray-300 text-black hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  }
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`rounded-lg font-semibold transition ${variants[variant]} ${sizes[size]} ${className || ''}`}>
      {children}
    </button>
  )
}
