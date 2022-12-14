import React from "react"
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Footer.module.css';
import LoginFormModal from "../LoginFormModal";
import SignUpFormModal from "../SignupFormModal";
import { showLoginModal, showSignupModal } from "../../store/ui";

export default function Footer({ sessionUser }) {
    const dispatch = useDispatch();




    return (
        <div className={styles.mainDiv}>
            <div className={styles.top}>
                <div className={styles.topText}>
                    Create your own Meetup group.
                </div>
                <div className={styles.topButton}>
                    <NavLink to="/createGroup" className={styles.button}> Get Started</NavLink>
                </div>
            </div>
            <hr className={styles.hr}></hr>

            <div className={styles.middle}>
                <div className={styles.yourAccount}>
                    <div className={styles.linkHeading}>
                        Your Account
                    </div>
                    {(
                        sessionUser && <div className={styles.subNavLink}>
                            <NavLink to="/logout" className={styles.footerLink}>Log out</NavLink>
                        </div>
                    )}
                    {(
                        !sessionUser && <div className={styles.subNavLink}>
                            <LoginFormModal />
                            <NavLink to="#" className={styles.footerLink} onClick={() => dispatch(showLoginModal())} >Log In</NavLink>

                            <SignUpFormModal />
                            <NavLink to="#" className={styles.footerLink} onClick={() => dispatch(showSignupModal())} >Sign up</NavLink>
                            {/* <NavLink to="/signup" className={styles.footerLink}>Sign Up</NavLink> */}
                        </div>
                    )}



                </div>

                <div className={styles.discover}>
                    <div className={styles.linkHeading}>Discover</div>
                    <div className={styles.footerLink}> <NavLink to="/allGroups" className={styles.footerLink}>Groups</NavLink>  </div>

                </div>
                <div className={styles.meetUp}>
                    <div className={styles.linkHeading}>Meetup</div>
                    <div className={styles.footerLink}><NavLink to="/aboutMeetup" className={styles.footerLink}>About</NavLink>  </div>
                </div>
            </div>


            <div className={styles.copyright}>
                <div className="">@  2022  Meetup </div>
            </div>

        </div>

        // <div className={styles.mainFooter}>

        //     <div className={styles.footerHeader}>
        //         Create your own Meetup group. <NavLink to="/createGroup"></NavLink>
        //     </div>

        //     <div >
        //         <div className={styles.container}>
        //         <div className={styles.col}>
        //                     <hr className={styles.divider}></hr>
        //                 </div>
        //             <div className={styles.row}>

        //                 {isLoaded && sessionLinks}

        //                 <div className={styles.col}>
        //                     <h3>Discover</h3>
        //                     <NavLink to="/allGroups" className={styles.footerLink}>Groups</NavLink>                                     
        //                 </div>

        //                 <div className={styles.col}> 
        //                     <h3>Meetup</h3>
        //                     <NavLink to="/aboutMeetup" className={styles.footerLink}>About</NavLink>                                     
        //                 </div>                   
        //             </div>
        //             <div className={styles.copyright}>
        //                 <div>
        //                     @ 2022 Meetup 
        //                 </div>
        //             </div>
        //         </div>

        //     </div>
        // </div>
    )
}