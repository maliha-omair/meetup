import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import mainLogo from "../../assets/meetup-main-logo.png"
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import SignUpFormModal from '../SignupFormModal';
import { useState } from 'react';
import { showLoginModal, showSignupModal } from '../../store/ui';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div >

        <ProfileButton user={sessionUser} />

      </div>

    );
  } else {
    sessionLinks = (
      <>
        <div className='link-div'>
          <div>
            <LoginFormModal />
            <NavLink to="#" onClick={() => dispatch(showLoginModal())} className="navigate-link">Log In</NavLink>
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;          
          <div>
            <SignUpFormModal   />
            <NavLink to="#" onClick={() => dispatch(showSignupModal())} className="navigate-link">Sign Up</NavLink>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className='main-meetup-nav'>
      <NavLink exact to="/" className="navigate-link">
        <div className='container-image'>
          <img src={mainLogo} alt="logo" className="imgs" />
        </div>
      </NavLink>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;