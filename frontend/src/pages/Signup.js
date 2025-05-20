import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../utils'
function Signup() {
  
  const navigate = useNavigate()
  const [signupInfo, setSignupInfo] = useState({
    name:'',
    email:'',
    password:''
  })  
  const handleChange = (e) => {
    const {name,value} = e.target
    console.log(name,value);
    const copSignupInfo = {...signupInfo}
    copSignupInfo[name] = value
    setSignupInfo(copSignupInfo)
  }
    
  const handleSignup = async(e) => {
    e.preventDefault();
    const {name,email,password} = signupInfo
    if(!name ){
      return handleError('Enter your name')
    }
    if(!email ){
      return handleError('Enter your email')
    }
    if(!password ){
      return handleError('Enter your password')
    }
    try {
        const url = ' http://localhost:8080/auth/signup' || 'https://auth-login-signup-api.vercel.app/auth/signup';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupInfo)
        });
        const result = await response.json();
        const {success,message} = result;
        if(success){
            handleSuccess(message)
            setTimeout(()=>{
              navigate('/login')
            },1000)
        }
        console.log(result);
    } catch (err) {
        handleError(err)
    }
  }


  return (
    <div className='container'>
      <h1>Signup</h1>
      <form 
      onSubmit={handleSignup}
      >
        <div>
          <label htmlFor='name'>Name</label>
          <input 
          onChange={handleChange}
          type='text' 
          name='name'
          autoFocus
          placeholder='Enter your name...'
          value={signupInfo.name}
          />
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input 
          onChange={handleChange}
          type='email'
          name='email'
          placeholder='Enter your email'
          value={signupInfo.email}

          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input 
          onChange={handleChange}
          type='password' 
          name='password'
          placeholder='Enter your password'
          value={signupInfo.password}
          />
        </div>
        <button>Sign Up</button>
        <span>Already have an account? 
          <Link to='/login'>Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>

  )
}

export default Signup
