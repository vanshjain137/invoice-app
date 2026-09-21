import React, { useState } from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isDemoLoading, setDemoLoading] = useState(false)

  const navigate = useNavigate()

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user)
        localStorage.setItem('cName', user.displayName)
        localStorage.setItem('photoURL', user.photoURL)
        localStorage.setItem('email', user.email)
        localStorage.setItem('uid', user.uid)
        navigate('/dashboard')
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      });
  }

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setDemoLoading(true);

    signInWithEmailAndPassword(auth, "demo@example.com", "password123")
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('cName', user.displayName || 'Demo User')
        localStorage.setItem('photoURL', user.photoURL || '')
        localStorage.setItem('email', user.email)
        localStorage.setItem('uid', user.uid)
        navigate('/dashboard')
        setDemoLoading(false)
      })
      .catch((error) => {
        console.log("Demo Login Error:", error)
        alert("Demo login is currently unavailable.")
        setDemoLoading(false)
      });
  }

  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login-box login-left'>

        </div>
        <div className='login-box login-right'>
          <h2 className='login-heading'>Login</h2>
          <form onSubmit={submitHandler}>
            <input required onChange={(e) => { setEmail(e.target.value) }} className='login-input' type='text' placeholder='Email' />
            <input required onChange={(e) => { setPassword(e.target.value) }} className='login-input' type='password' placeholder='Password' />
            <button className='login-input login-btn' type="submit"> {isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>} Submit</button>
          </form>

          <div style={{ width: '100%', margin: '15px 0', textAlign: 'center', borderBottom: '1px solid #ccc', lineHeight: '0.1em' }}>
            <span style={{ background: '#eee', padding: '0 10px', color: '#888', fontSize: '14px' }}>OR</span>
          </div>

          <button
            onClick={handleDemoLogin}
            type="button"
            className='login-input'
            style={{ backgroundColor: '#282c34', color: 'white', border: 'none', cursor: 'pointer', fontSize: '15px' }}
          >
            {isDemoLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>} Try Demo (Guest Login)
          </button>

          <Link to='/register' className='register-link'>Create an Account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
