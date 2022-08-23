import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import {useHistory, Redirect} from "react-router-dom"
export default function UserGroup(){
    const sessionUser = useSelector(state => state.session.user);
    const history= useHistory();

    useEffect(()=>{
        if(!sessionUser){
            history.push("/")
        }   
    },[sessionUser]);
    return(
        <div>
            {console.log(sessionUser.id)}
        </div>
    )
}