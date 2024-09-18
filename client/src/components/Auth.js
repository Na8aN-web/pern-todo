import React, { useState } from 'react'
import {useCookies} from 'react-cookie'

const Auth = () => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [isLogin, setIsLogin] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(null)

  const viewLogin = (status) => {
    setError(null)
    setIsLogin(status)
  }

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault()
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords must match')
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    console.log(data)
    if(data.detail){
      setError(data.detail)
    } else{
      setCookie('Email', data.email)
      setCookie('AuthToken', data.token)
      window.location.reload()
    }
   
  }

  return (
    <div className='auth-container'>
      <div className='auth-container-box'>
        <form>
          <h2>{isLogin ? 'Log in to your account' : 'Create an account'}</h2>
          <input type='email' placeholder='Enter your Email Address' onChange={(e) => setEmail(e.target.value)} />
          <input type='password' placeholder='Enter your Password' onChange={(e) => setPassword(e.target.value)} />
          {!isLogin && <input type='password' placeholder='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} />}
          <input type='submit' className='create' onClick={(e) => { handleSubmit(e, isLogin ? 'login' : 'signup') }} />
          {error && <p>{error}</p>}
        </form>
        <div className='auth-options'>
          <button onClick={() => viewLogin(false)} style={{ backgroundColor: !isLogin ? 'rgb(108, 155, 148)' : 'rgb(188, 188, 188)' }}>Sign Up</button>
          <button onClick={() => viewLogin(true)} style={{ backgroundColor: isLogin ? 'rgb(108, 155, 148)' : 'rgb(188, 188, 188)' }}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Auth