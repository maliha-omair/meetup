import React, { useState, useEffect, useInsertionEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {useHistory, Redirect} from "react-router-dom"
import * as groupActions from "../../store/groups";
import styles from "../UserGroups/UserGroups.module.css"
import image from "../../assets/groupDisplayImage.jpg"

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

    // useEffect(()=>{
    //         groupsArr = Object.values(userGroups);
    //         console.log("array of groups are ",groupsArr)
        
    // },[userGroups])
    
    function handleClick(groupId){
        console.log("value from div",groupId);
        history.push(`/groups/${groupId}`)        
    }

    if(!userGroups){
        return null; 
    } else{
        groupsArr = Object.values(userGroups);
    }

    return (groupsArr && (
        <>            
            <div className={styles.heading}>
                <h1>Groups</h1>            
            </div>
            {groupsArr.map((group,idx)=>{
                return(
                    
                        <div className={styles.mainDiv} key={idx} value={group.id} onClick={()=>{handleClick(group.id)}}>  
                            <ul>
                                {errors.map((error, idx) => <li className="li-login" key={idx}>{error}</li>)}
                            </ul>
                            <div className={styles.subDiv}>                           
                                <div>
                                    <img src={image} className={styles.image}/>
                                </div>
                                <div className={styles.groubDetailDiv}>
                                
                                        <div className={styles.groupName}>
                                            {group.name}
                                        </div>
                                        <div className={styles.city}>
                                            {group.city}, {group.state}
                                        </div>
                                        <div className={styles.about}>
                                            {group.about.substring(1,200)}...
                                        </div>
                                        <div className={styles.members}>
                                            {group.numMembers} members - {group.private ? `Private`: `Public`}
                                        </div>       
                                </div>                                   
                            </div>                           
                    
                        </div>
                )
            })}
        </>
    ));
}