import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import mainLogo from "../../assets/meetup-main-logo.png"
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div >
        {/* <NavLink to="/createGroup" className="create-group-link">Start a new group</NavLink> */}
        <ProfileButton user={sessionUser} />
   
      </div>

    );
  } else {
    sessionLinks = (
      <>
        <div className='link-div'>
          <NavLink to="/login" className="navigate-link">Log In</NavLink>
          <NavLink to="/signup"className="navigate-link">Sign Up</NavLink>
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