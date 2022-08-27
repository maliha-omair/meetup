import React, { useState, useEffect, useInsertionEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {useHistory, Redirect, NavLink} from "react-router-dom"
import * as groupActions from "../../store/groups";
import styles from "../UserGroups/UserGroups.module.css"
import image from "../../assets/groupDisplayImage.jpg"
import ListControl from "../ListControl";

export default function UserGroups({sessionUser}){
    // const sessionUser = useSelector(state => state.session.user);
    const userGroups = useSelector(state => state.group.userGroups);
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const history= useHistory();
    console.log("user is",sessionUser)
    useEffect(()=>{
        console.log(sessionUser)
        if(!sessionUser){
            history.push("/")
        }   
    },[]);

    let groupsArr = [];
    
    useEffect(()=>{
        dispatch(groupActions.getUserGroups())
        .then((res)=>{
            console.log("response from geting current users groups",res)
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });       
    },[dispatch])

    function handleClick(groupId){
        console.log("value from div",groupId);
        history.push(`/groups/${groupId}`)        
    }


    return (
        <>
            <ul>
                {errors.map((error, idx) => <li className="li-login" key={idx}>{error}</li>)}
            </ul>

        <ListControl altMessage="No group found" elements={userGroups? Object.values(userGroups): null}>
            {
                userGroups && (
                <div>          
                    <div className={styles.heading}>
                        <div className={styles.divHeading}>
                            Your Groups         
                        </div>
                    </div>
                    {Object.values(userGroups).map((group,idx)=>{
                        return(
                                <div className={styles.mainDiv} key={idx} value={group.id} onClick={()=>{handleClick(group.id)}}>  
                                    <div className={styles.subDiv}>                           
                                    
                                        {(group.Images && group.Images.length > 0)&&(
                                            <div>
                                            <img src={group.Images[0].url} className={styles.image}/>
                                            </div>
                                        )}
                                        {(!group.Images || !group.Images.length > 0)&&(
                                            <div>
                                            <img src={image} className={styles.image}/>
                                            </div>
                                        )}
                                        
                                        <div className={styles.groubDetailDiv}>
                                        
                                                <div className={styles.groupName}>
                                                    {group.name}
                                                </div>
                                                <div className={styles.city}>
                                                    {group.city}, {group.state}
                                                </div>
                                                <div className={styles.about}>
                                                    {group.about.substring(0,200)}...
                                                </div>
                                                <div className={styles.members}>
                                                    {group.numMembers} members - {group.private ? `Private`: `Public`}
                                                </div>       
                                        </div>                                   
                                    </div>                           
                            
                                </div>
                        )
                    })}
                </div>
            )}
            </ListControl>
        </>
    );
}