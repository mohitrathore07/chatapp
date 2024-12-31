import React from 'react'

const Input = ({
    label = '',
    name = '',
    type = 'text',
    className ='',
    inputclassName ='',
    isRequired = false,
    placeholder = '',
    value = '',
    onChange = () => {}
}) => {
  return (
    <div className={` ${className}`}>
      <label for= {name} className={`block mb-1 text-sm font-medium text-black`}>{label}</label>
      <input id={name} type={type} className={`p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500   ${inputclassName}`} required={isRequired} placeholder={placeholder} value={value} onChange={onChange}></input> 
    </div>    
  )
}

export default Input
