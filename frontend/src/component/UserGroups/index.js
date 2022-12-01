import React, { useState, useEffect, useInsertionEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {useHistory, Redirect, NavLink} from "react-router-dom"
import * as groupActions from "../../store/groups";
import styles from "../UserGroups/UserGroups.module.css"
import ListControl from "../ListControl";
import ListGroups from "../ListGroups";
import EmptyListMessage from "../EmptyListMessage";

export default function UserGroups({sessionUser}){
    const userGroups = useSelector(state => state.group.groups);
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const history= useHistory();
  
    useEffect(()=>{
       
        if(!sessionUser){
            history.push("/")
        }   
    },[]);
    
    useEffect(()=>{
        dispatch(groupActions.getUserGroupsThunk())
        .then((res)=>{
            console.log("response from geting current users groups",res)
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });       
    },[dispatch])

  

    return (
        <>
        <ListControl altChildren = {<EmptyListMessage listType="groups"/>} elements={userGroups? Object.values(userGroups): null}>
            {
                userGroups && (
                <div className={styles.main}>          
                    <div className={styles.pageHeading}>
                        <div className={styles.group}>Your Groups</div>
                    </div>
                <ListGroups groups={userGroups}/>
                
                </div>
            )}
            </ListControl>
        </>
    );
}