import React, { useState } from 'react'
import './Login.css'
import { signup,loginUser,resetPass } from '../../config/firebase';
import logo from '../../assets/logo_big.png';
const Login = () => {
  const [currState, setCurrState] = useState('Sign Up');
  const [userName,setUserName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const onSubmitHandler = async (event) => {
  event.preventDefault();

  try {
    if (currState === 'Sign Up') {
      await signup(userName, email, password);
    } else {
      await loginUser(email, password);
    }
  } catch (error) {
    console.error(error);
  }
};
  
  return (
    <div className='login'>
      <img src={logo} alt="" className='logo'/>
      <form onSubmit={onSubmitHandler} className='login-form'>
        <h2>{currState}</h2>
        {currState==='Sign Up'?<input onChange={(e)=>setUserName(e.target.value)} type="text" placeholder='username' className="form-input" required />:null}
        <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email address' className="form-input" required/>
        <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='password' className="form-input" required/>
        <button type='submit'>{currState==='Sign Up'? 'Create account':'Login Now'}</button>
        <div className="login-term">
          <input type="checkbox" required/>
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
          {
            currState==="Sign Up"?<p className="login-toggle">
            Already have an account <span onClick={()=>setCurrState('Login')}>Login</span>
          </p>:<p className="login-toggle">
            Create an account <span onClick={()=>setCurrState('Sign Up')}>click here</span>
          </p>
          }
          {currState == "Login" ? <p className="login-toggle">
            Forgot Password<span onClick={()=>resetPass(email)}>reset here</span>
          </p>: null}
          
        </div>
      </form>
    </div>
   
  )
}

export default Login