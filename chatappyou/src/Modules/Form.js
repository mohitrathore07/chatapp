import React from 'react';
import Input from '../Componants/Input/input';
import Button from '../Componants/button/button';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';



const Form = (
  {
    isSignInPage = true,
  }
) => {
  const [data , setData ] = useState({
    ...(!isSignInPage && {
      fullName: ''
    }),
    email: '',
    password: ''
  })
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/user/${isSignInPage ? 'login' : 'register' }`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if(res.status === 400) {
      alert('Invalid Credentials');
    }
    else {
      const resData = await res.json();
      if(resData.token) {
        localStorage.setItem('user:token', resData.token);
        localStorage.setItem('user:detail',JSON.stringify( resData.user));
        navigate('/');
      }
    }
  }
  return (
    <div className='bg-light h-screen flex items-center justify-center'>
    <div className='bg-white w-[440px] h-[580px] shadow-lg rounded-lg flex flex-col justify-center items-center'> 

      <div className='font-extrabold text-4xl font-mono'>Welcome {isSignInPage && 'Back'}</div>
      <div className='font-bold text-lg font-mono mb-10'>{isSignInPage ?'Sign in to get Explored':  'Sign up to get Started'}</div>

      <form onSubmit = {(e) => handleSubmit(e)} className='w-full flex flex-col justify-center items-center'>

      { !isSignInPage &&  
      <Input label='Full Name' name='name' placeholder='Enter ur Full Name' className='mb-2  w-1/2' value={data.fullName} onChange={(e) => setData({...data, fullName: e.target.value})} isRequired={true}/>
      }

      <Input label='Your Email' type='email' name='email'  placeholder='Enter ur Email'  className='mb-2  w-1/2' value={data.email} onChange={(e) => setData({...data, email: e.target.value})} isRequired={true}/>

      <Input label='Password' type='password' name='name' placeholder='Enter ur Password'  className='mb-8 w-1/2' value={data.password} onChange={(e) => setData({...data, password: e.target.value})} isRequired={true}/>

      <Button label={isSignInPage ? 'Sign In' : 'Sign Up'} type='submit' className='w-1/2 mb-2' />

      </form>

      <div className='text-sm  font-semibold'>{isSignInPage ? "Didn't have an account?": 'Already Have An Account?'} 
        <span className='underline text-primary cursor-pointer' onClick={() => navigate(`/users/${isSignInPage? 'sign_up': 'sign_in'}`)} >{isSignInPage? ' Sign Up' : ' Sign In'}</span>
      </div>

    </div>
    </div>
  )
}

export default Form
