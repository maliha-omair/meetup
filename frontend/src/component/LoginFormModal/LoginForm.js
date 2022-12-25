import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import smallLogo from "../../assets/meetup-logo.png";
import "./LoginForm.css";
import SignUpFormModal from "../SignupFormModal";
import { closeLoginModal, showSignupModal } from "../../store/ui";
import { useFormik } from "formik";
import * as Yup from "yup";



function LoginForm() {
    const dispatch = useDispatch();
    const [demoUser, setDemoUser] = useState(false);
    const [errors, setErrors] = useState([]);
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",

        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(5, "Must be greater than 4 characters").required("Password is required"),
            email: Yup.string()
                .email("Invalid email address").required("Email is required")
        }),
        onSubmit: (values) => {
            let user = {}
            if (demoUser) {
                user = {
                    credential: "demo123@aa.com",
                    password: "demouser123"
                }
            } else {
                user = {
                    credential: values.email,
                    password: values.password
                }
            }

            return dispatch(sessionActions.login(user))
                .then((res) => {

                })
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(Object.values(data.errors));
                });
        }
    });
    if (sessionUser) return (
        history.push("/")
    );
  
    function handleDemoUser(){
        formik.values.email = "demo123@aa.com";
        formik.values.password = "demouser123";
    }    
    function openSignupModal() {
        dispatch(closeLoginModal());
        dispatch(showSignupModal());
    }

    return (
        // <form onSubmit={handleSubmit} className="main-login">        
        <form onSubmit={formik.handleSubmit} className="main-login">

            <div className="sub-main-login">
                <div className="login-top">
                    <img src={smallLogo} alt="logo" className="logo-login" />
                    <h1 className="login-title">Log in</h1>
                    <div className="not-a-member-login"><span className="notMember">Not a member yet?</span>
                        <SignUpFormModal />
                        <NavLink to="#" onClick={openSignupModal} className="signup-link">  Sign Up</NavLink>
                    </div>
                    {/* <NavLink to="/signup" className="signup-link" >Sign up</NavLink> </div> */}
                </div>
                <div className="errorDiv">
                    <ul className="errorMessageLi">
                        {errors.map((error, idx) => <li className="errorMessageLi" key={idx}>{error}</li>)}
                    </ul>
                </div>

                <div className="login-sub-div">
                    <label className="login-label" >Email</label>
                    <input className="input-login"
                        id="email"
                        name="email"
                        type="text"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email ? <p className="errorMessageLi"> {formik.errors.email}</p> : null}
                </div>


                <div className="login-sub-div">
                    <label className="login-label">Password</label>
                    <input className="input-login"
                        id="password"
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password ? <p className="errorMessageLi">{formik.errors.password}</p> : null}
                </div>

                <div className="login-button-div">
                    <button className="login-button" key="login" type="submit" >Log in</button>
                </div>
                <div className="login-button-div">
                    <button className="login-button" key="demouser" type="submit" onClick={handleDemoUser} >Demo User</button>
                </div>
            </div>

        </form>

    )
}

export default LoginForm;