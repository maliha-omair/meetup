import React from "react"
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Footer.module.css';
export default function Footer({isLoaded}){
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <div className={styles.col}>
             <h3>Your Account</h3>
             <NavLink to="/logout" className={styles.footerLink}>Log out</NavLink>
          </div>        
        );
    } else {
        sessionLinks = (
        
            <div className={styles.col}>
                <h3>Your Account</h3>
                <div className={styles.subNavLink}>
                    <NavLink to="/login" className={styles.footerLink}>Log In</NavLink>
                    <NavLink to="/signup" className={styles.footerLink}>Sign Up</NavLink>                    
                </div>
            </div>
        
        );
    }

    return(
        <div className={styles.mainFooter}>
            <div className={styles.container}>
            <div className={styles.col}>
                        <hr className={styles.divider}></hr>
                    </div>
                <div className={styles.row}>
                    
                      {isLoaded && sessionLinks}
                    
                    <div className={styles.col}>
                         <h3>Discover</h3>
                        <NavLink to="/allGroups" className={styles.footerLink}>Groups</NavLink>                                     
                    </div>
                    
                    <div className={styles.col}> 
                        <h3>Meetup</h3>
                        <NavLink to="/aboutMeetup" className={styles.footerLink}>About</NavLink>                                     
                    </div>                   
                </div>
                <div className={styles.copyright}>
                    <div>
                        @ 2022 Meetup 
                    </div>
                </div>
            </div>
        </div>
    )
}