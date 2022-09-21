import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import mainLogo from "../../assets/meetup-main-logo.png"
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import SignUpFormModal from '../SignupFormModal';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

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
          <LoginFormModal  />
          {/* <NavLink to="/login" className="navigate-link">Log In</NavLink> */}
          <SignUpFormModal />
        
        </div>
      </>
    );
  }

  return (       
    <div className='main-meetup-nav'>
      <NavLink exact to="/" className="navigate-link">
        <div className='container-image'>
          <img src={mainLogo} alt="logo" className="imgs"/>
        </div>
      </NavLink>
    {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;