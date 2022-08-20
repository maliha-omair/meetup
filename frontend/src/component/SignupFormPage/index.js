import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import smallLogo from "../../assets/small-logo.png"
import './SignupFormPage.css';

function SignupFormPage() {
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
      return dispatch(sessionActions.signup({ firstName, lastName,email, username, password }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
              console.log(data.errors)
             setErrors(data.errors);
          }
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <form onSubmit={handleSubmit} className="main" >
      <div className="sub-main">
        <div>
          <div className="imgs">
            <div className="container-image">
              <img src={smallLogo} alt="logo" className="login" />
            </div>
          </div>
        </div>
        <div>
          <h1 className="title">Finish signing up</h1>

        </div>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <div className="email-div">
          <label>  First Name </label>
            <input className="name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          
        </div>

        <label>
          Last Name
          <input className="name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label>
          Email
          <input className="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Username
          <input className="pass"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input className="pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input className="pass"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <div className="login-button-div">
          <button type="submit" className="login-button">Sign Up</button>
        </div>
      </div>
    </form>
  );
}

export default SignupFormPage;