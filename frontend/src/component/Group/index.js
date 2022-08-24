import { NavLink, useParams, useHistory, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import image from "../../assets/groupDisplayHd.jpeg"
import styles from "./Group.module.css"
import Divider from "../Divider/Divider";
import { useState } from "react";
import { useEffect } from "react";
import { getGroupByIdThunk,deleteGroupThunk } from "../../store/groups";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faAngleDown} from '@fortawesome/free-solid-svg-icons'
import AboutGroup from "../AboutGroup";
import GroupEvents from "../GroupEvents";

export default function Group({sessionUser}){

    const [showJoinGroup,setShowJoinGroup] = useState(false);
    const [showManageGroup,setShowManageGroup] = useState(false);
    const [errors, setErrors] = useState([]);

    const history = useHistory();
    const params = useParams();
    let groupId = params.groupId;
    
    const group  = useSelector(state => state.group.currentGroup);
        
    const dispatch = useDispatch();
    
    
    useEffect(()=>{
           
        dispatch(getGroupByIdThunk(groupId));

        if(!sessionUser){
            setShowJoinGroup(true);
            setShowManageGroup(false);        
        }else{
            setShowJoinGroup(false);
            setShowManageGroup(true);
        }
    },[dispatch, groupId, sessionUser]);

   
    function handleDelete(){
        dispatch(deleteGroupThunk(groupId))
        .then((res)=>{history.push("/userGroup")})
        .catch(async (res)=>{
            const data = await res.json();
            if (data && data.errors) {
                setErrors(Object.values(data.errors))            
            }
        })
    }
    return( group &&(
        <div className={styles.main}>
            <div className={styles.innerDiv}>
                    <ul>
                        {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
                    </ul>
                </div>
            <div className={styles.mainDiv}> 
                <div className={styles.groupDetail}>
                    <div className={styles.imageDiv}>
                        <img src={image} className={styles.groupImage} alt="display"></img>
                    </div>
                    <div>
                        <div className={styles.groupName}>
                            {group.name}
                        </div>
                        <div className={styles.cityState}>
                            {group.city}, {group.state}
                        </div>
                        <div className={styles.members}>
                            {group.numMembers} members - {group.private ? `Private`: `Public`}
                        </div>
                        <div className={styles.organizedBy}>
                            Organized by {group.organizerId}
                        </div>
                    </div>
                </div>                
                <Divider></Divider>
                <div className={styles.innerMenu}>
                        
                            
                    <div>
                        <nav>
                        <NavLink to={`/groups/${groupId}/about`} className={styles.about}>About</NavLink> 
                        <NavLink to={`/groups/${groupId}/events`} className={styles.event} >Events</NavLink> 
                        </nav>
                    </div>
                    {showJoinGroup && 
                                <div className={styles.tabs}>
                                    <button className={styles.joinGroup}>Join group <FontAwesomeIcon className="arrowIcon" icon={faAngleDown} /></button>
                                </div>
                    }
                    {showManageGroup && 
                        <div className={styles.tabs}>
                            <div >
                                    <NavLink to={`/groups/${groupId}/update`} className={styles.update}>Update</NavLink> 
                                    <NavLink to="#" onClick={()=>handleDelete()} className={styles.update}>Delete</NavLink>                                
                                
                            </div>
                            <div>
                                <button className={styles.createEvent}>Create Event <FontAwesomeIcon className="arrowIcon" icon={faAngleDown} /></button>
                            </div>
            
                        </div>                 
                    } 
                </div>
                <div>
                    <Switch>
                        <Route path="/groups/:groupId/about">
                            <AboutGroup group={group}/>
                        </Route>
                        <Route path="/groups/:groupId/events">
                            <GroupEvents group={group}/>
                        </Route>
                    </Switch>
                </div>                   
            </div>
        </div>
    ))
}