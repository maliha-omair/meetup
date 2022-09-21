import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import smallLogo from "../../assets/meetup-logo.png"
import './SignupForm.css';

function SignupForm() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ firstName, lastName, email, password, username  }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            
            setErrors(Object.values(data.errors))            
          }
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <form onSubmit={handleSubmit} className="main-signup" >
      <div className="sub-main-signup">

        <div className="signup-top">
          <img src={smallLogo} alt="logo" className="logo-signup" />
          <h1 className="login-title-signup">Finish signing up</h1>    
        </div>
        <div className="signup-errorDiv">
                <ul className="signup-errorMessageUl">
                    {errors.map((error, idx) => <li className="signup-errorMessageLi" key={idx}>{error}</li>)}
                </ul>
            </div>

        <div className="sub-div-signup">
          <label className="signup-label">First Name</label>
          <input 
              className="input-signup"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="sub-div-signup">
          <label className="signup-label">Last Name</label>
            <input 
              className="input-signup"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
          />
        </div>
       
        <div className="sub-div-signup">
          <label className="signup-label">Email</label>
            <input 
              className="input-signup"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
        </div>

        <div className="sub-div-signup">
          <label className="signup-label">Username</label>
            <input 
              className="input-signup"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
          />
        </div>

        <div className="sub-div-signup">
          <label className="signup-label">Password</label>
            <input 
              className="input-signup"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />          
        </div>

        <div className="sub-div-signup">
          <label className="signup-label">Confirm Password</label >
            <input 
              className="input-signup"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
          />          
        </div>
        
        <div className="login-button-div-signup">
          <button type="submit" className="login-button">Sign Up</button>
        </div>
      </div>
    </form>
  );
}

export default SignupForm;