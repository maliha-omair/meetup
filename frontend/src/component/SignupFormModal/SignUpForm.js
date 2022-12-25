import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import smallLogo from "../../assets/meetup-logo.png"
import './SignupForm.css';
import { useFormik } from "formik";
import * as Yup from "yup";

function SignupForm() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      username: ""

    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(5, "Must be greater than 4 characters").required("Password is required"),
      confirmPassword: Yup.string()
        .required("confirm password is required"),
      email: Yup.string()
        .email("Invalid email address").required("Email is required"),
      firstName: Yup.string()
        .min(5,"FirstName must be greater than 4 characters")
        .max(20,"FirstName must be less than 20 characters")
        .required("FirstName is required"),
      lastName: Yup.string()
        .min(5,"LastName must be greater than 4 characters")
        .max(20,"LastName must be less than 20 characters")
        .required("LastName is required"),
      username: Yup.string()
        .min(5,"username must be greater than 4 characters")
        .max(20,"username must be less than 20 characters")
        .required("username is required")
    }),
    
    onSubmit: (values) => {
      if (values.password === values.confirmPassword) {
        let firstName = values.firstName;
        let lastName = values.lastName;
        let email = values.email;
        let password = values.password;
        let username = values.username
        setErrors([]);
        return dispatch(sessionActions.signup({ firstName, lastName, email, password, username }))
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {

              setErrors(Object.values(data.errors))
            }
          });
      }
      return setErrors(['Confirm Password field must be the same as the Password field']);
    }
  });
  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formik.values.password === formik.values.confirmPassword) {
      setErrors([]);
      // return dispatch(sessionActions.signup({ firstName, lastName, email, password, username }))
      //   .catch(async (res) => {
      //     const data = await res.json();
      //     if (data && data.errors) {

      //       setErrors(Object.values(data.errors))
      //     }
      //   });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="main-signup" >
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
            id="firstName"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
           {formik.touched.firstName && formik.errors.firstName ? <p className="errorMessageLi">{formik.errors.firstName}</p> : null}
        </div>

        <div className="sub-div-signup">
          <label className="signup-label">Last Name</label>
          <input
            className="input-signup"
            id="lastName"
            name="lastName"
            type="text"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lastName && formik.errors.lastName ? <p className="errorMessageLi">{formik.errors.lastName}</p> : null}
        </div>

        <div className="sub-div-signup">
          <label className="signup-label">Email</label>
          <input
            className="input-signup"
            type="text"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? <p className="errorMessageLi"> {formik.errors.email}</p> : null}
        </div>

        <div className="sub-div-signup">
          <label className="signup-label">Username</label>
          <input
            className="input-signup"
            type="text"
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? <p className="errorMessageLi">{formik.errors.username}</p> : null}
        </div>

        <div className="sub-div-signup">
          <label className="signup-label">Password</label>
          <input
            className="input-signup"
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? <p className="errorMessageLi">{formik.errors.password}</p> : null}
        </div>

        <div className="sub-div-signup">
          <label className="signup-label">Confirm Password</label >
          <input
            className="input-signup"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? <p className="errorMessageLi">{formik.errors.confirmPassword}</p> : null}
        </div>

        <div className="login-button-div-signup">
          <button type="submit" className="signup-button">Sign Up</button>
        </div>
      </div>
    </form>
  );
}

export default SignupForm;