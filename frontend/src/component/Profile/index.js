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
    },[sessionUser])
    return(sessionUser && (
        <div>
            <div>
                 <div className="dot">{`${sessionUser.firstName.charAt(0).toUpperCase()}`}</div>   
            </div>
            <div>
                <h1>
                    {`${sessionUser.firstName} ${sessionUser.lastName}`}
                </h1>
            </div>
            
        </div>
    ))
}