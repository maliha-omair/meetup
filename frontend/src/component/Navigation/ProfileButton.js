import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };
  
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);
  
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <div className="profile-dropdown-main">
        <div className="login-elements">
          <div>
          <NavLink to="/createGroup" className='start-a-group'>Start a new group</NavLink>
          </div>
          <div className="nav-dropdown" onClick={openMenu}>
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <FontAwesomeIcon className="arrowIcon" icon={showMenu? faAngleDown: faAngleUp} onClick={openMenu} />
        </div>
        {showMenu && (
          <div className="div-dropdown">
            <NavLink to="/userGroup" className="dropdown-link">Your groups</NavLink>
            <NavLink to="/profile" className="dropdown-link">View profile</NavLink>
            <NavLink onClick={logout} to="#" className="dropdown-link">Log out</NavLink> 
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileButton;