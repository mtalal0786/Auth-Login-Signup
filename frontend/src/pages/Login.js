import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../utils'
function Login() {
  
  const navigate = useNavigate()
  const [loginInfo, setLoginInfo] = useState({
    email:'',
    password:''
  })  
  const handleChange =
   (e) => {
    const {name,value} = e.target
    console.log(name,value);
    const copyLoginInfo = {...loginInfo}
    copyLoginInfo[name] = value
    setLoginInfo(copyLoginInfo)
  }
    
  const handleLogin = async (e) => {
  e.preventDefault();
  const { email, password } = loginInfo;
  if (!email) {
    return handleError('Enter your email');
  }
  if (!password) {
    return handleError('Enter your password');
  }

  try {
    const url = ' http://localhost:8080/auth/login' || 'https://auth-login-signup-api.vercel.app/auth/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginInfo)
    });

    // If the response is not ok, handle errors accordingly
    if (!response.ok) {
      if (response.status === 403) {
        // 403 Forbidden = Email or Password incorrect
        return handleError('Email or Password is incorrect');
      } else {
        // For other errors, try to extract backend message and show it
        const errorData = await response.json();
        if (errorData && errorData.message) {
          return handleError(errorData.message);
        } else {
          return handleError('An error occurred. Please try again.');
        }
      }
    }

    // If response is OK, parse the JSON
    const result = await response.json();
    const { success, token, name, message } = result;

    if (success) {
      handleSuccess(message);
      localStorage.setItem('token', token);
      localStorage.setItem('loggedInUser', name);
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } else {
      // This block may not be reached if server returns non-200 on failure, 
      // but keep for safety.
      handleError('Email or Password is incorrect');
    }
    console.log(result);
    
  }
  catch (err) {
    // For unexpected errors like network failure, etc.
    handleError(err.message || 'Something went wrong');
  }
};



  return (
    <div className='container'>
      <h1>Login</h1>
      <form 
      onSubmit={handleLogin}
      >
        <div>
          <label htmlFor='email'>Email</label>
          <input 
          onChange={handleChange}
          type='email'
          name='email'
          autoFocus
          placeholder='Enter your email'
          value={loginInfo.email}

          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input 
          onChange={handleChange}
          type='password' 
          name='password'
          placeholder='Enter your password'
          value={loginInfo.password}
          />
        </div>
        <button>Login</button>
        <span>Don't have an account? 
          <Link to='/signup'>Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>

  )
}

export default Login
