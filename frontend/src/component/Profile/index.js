import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import {useHistory, Redirect} from "react-router-dom"
import "../Profile/profile.css"
export default function Profile(){
    const sessionUser = useSelector(state => state.session.user);
    const history= useHistory();

    useEffect(()=>{
        if(!sessionUser){
            history.push("/")
        }   
    },[sessionUser]);
    function formatMemberSinceDate(dateStr){
        const months={
            0: 'January',
            1: 'February',
            2: 'March',
            3: 'April',
            4: 'May',
            5: 'June',
            6: 'July',
            7: 'August',
            8: 'September',
            9: 'October',
            10: 'November',
            11: 'December',
        };
        const d = new Date(dateStr);
        return `${months[d.getMonth()]} ${d.getFullYear()}`;
    }
    return(sessionUser && (
        <div className="profile-main-div">
            <div className="profile-sub-div">
                <div className="profile-pic-large">
                    <div className="dot"><span className="dSpan">{`${sessionUser.firstName.charAt(0).toUpperCase()}`}</span></div>   
                </div>
                <div>
                    <h1>
                        {`${sessionUser.firstName} ${sessionUser.lastName}`}
                    </h1>
                    <h3>Member since {formatMemberSinceDate(sessionUser.memberSince) }</h3>
                </div>
            </div>
            
        </div>
    ))
}