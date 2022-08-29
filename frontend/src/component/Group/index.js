import { NavLink, useParams, useHistory, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import image from "../../assets/groupDisplayHd.jpeg"
import styles from "./Group.module.css"
import Divider from "../Divider/Divider";
import { useState,useEffect } from "react";

import { getGroupByIdThunk,deleteGroupThunk } from "../../store/groups";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faAngleDown} from '@fortawesome/free-solid-svg-icons'
import AboutGroup from "../AboutGroup";
import GroupEvents from "../GroupEvents";

export default function Group({sessionUser}){

    
    const [showManageGroup,setShowManageGroup] = useState(false);
    const [errors, setErrors] = useState([]);

    const history = useHistory();
    const params = useParams();
    let groupId = params.groupId;
    
    const group  = useSelector(state => state.group.group);
        
    const dispatch = useDispatch();
    
    
    useEffect(()=>{
           
        dispatch(getGroupByIdThunk(groupId)).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });

        if(!sessionUser){
            setShowManageGroup(false);        
        }else{
           
            setShowManageGroup(true);
        }
    },[dispatch, groupId, sessionUser]);

    function handleNewEventClick(){     
        history.push(`/event/new`, sessionUser={sessionUser}, groupId={groupId})
    }
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
            <div>
                <ul>
                {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
                </ul>
            </div>
            <div className={styles.groupDetail}>
                <div>
                {(group.Images && group.Images.length > 0)&&(
                        <img src={group.Images[0].url} className={styles.groupImage} alt="display"></img>
                        )}
                        {(!group.Images || !group.Images.length > 0)&&(
                          <img src={image} className={styles.groupImage} alt="display"></img>
                )}
                </div>
                <div className={styles.detailText}>
                    <div className={styles.title}> {group.name}</div>
                    <div className={styles.cityState}> <i className='fas fa-map-marker-alt'></i> {group.city}, {group.state}</div>
                    <div className={styles.members}> {group.numMembers} members - {group.private ? `Private`: `Public`}</div>
                    <div className={styles.organized}>Organized by <b> {group.Organizer.firstName}  {group.Organizer.lastName.charAt(0)}.</b></div>
                </div>
            </div>

            <div className={styles.divider}><hr></hr></div>
            
            <div className={styles.navigationMenu}>
                <div className={styles.navItems}>
                    <nav className={styles.aboutEvent}>
                        <NavLink className={styles.about} to={`/groups/${groupId}/about`} classgit >About</NavLink> 
                        <NavLink className={styles.event}  to={`/groups/${groupId}/events`} >Events</NavLink>     
                    </nav>
                
                
                {showManageGroup && 
                   <nav>
                        <NavLink className={styles.update} to={`/groups/${groupId}/update`} > Update</NavLink> 
                        <NavLink className={styles.delete} to="#" onClick={()=>handleDelete()} >Delete</NavLink>
                        <NavLink to="/event/new" >                                
                            <button className={styles.createEvent} >Create Event <FontAwesomeIcon className="arrowIcon" icon={faAngleDown} /></button>
                        </NavLink>
                        <NavLink to={`/${groupId}/venue`} >                                
                            <button className={styles.createVenue} >Create Venue <FontAwesomeIcon className="arrowIcon" icon={faAngleDown} /></button>
                        </NavLink>
                    
                    </nav>
                }    
                </div>                    
                
            </div>
            
            <div className={styles.groupDesc}>            
                   <Switch>
                        <Route path="/groups/:groupId/about">
                            <AboutGroup group={group} />
                        </Route>
                        <Route path="/groups/:groupId/events">
                            <GroupEvents group={group}/>
                        </Route>
                    </Switch>
                </div>             
            
        </div>
        // <div className={styles.main}>
        //     <div>
        //     <div>
        //         <ul>
        //             {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
        //         </ul>
        //     </div>
            
        //     <div className={styles.mainDiv}> 
            
                
        //         <div className={styles.groupDetail}>
        //             <div className={styles.imageDiv}>
        //                 {(group.Images && group.Images.length > 0)&&(
        //                       <img src={group.Images[0].url} className={styles.groupImage} alt="display"></img>
        //                 )}
        //                  {(!group.Images || !group.Images.length > 0)&&(
        //                       <img src={image} className={styles.groupImage} alt="display"></img>
        //                 )}
                      
        //             </div>
                    
        //             <div>
        //                 <div className={styles.groupName}>
        //                     {group.name}
        //                 </div>
        //                 <div className={styles.cityState}>
        //                     {group.city}, {group.state}
        //                 </div>
        //                 <div className={styles.members}>
        //                     {group.numMembers} members - {group.private ? `Private`: `Public`}
        //                 </div>
        //                 <div className={styles.organizedBy}>
        //                     Organized by <b> {group.Organizer.firstName}  {group.Organizer.lastName.charAt(0)}.</b>  
        //                 </div>
                        
        //             </div>                    
        //         </div>               
                
        //         <div>
        //         </div>  
               

        //         <div className={styles.innerMenu}>
               
        //              <div>
        //                 <nav className={styles.aboutEvent}>
        //                 <NavLink to={`/groups/${groupId}/about`} className={styles.about}>About</NavLink> 
        //                 <NavLink to={`/groups/${groupId}/events`} className={styles.event} >Events</NavLink>                         
        //                 </nav>
        //             </div>
        //             {showManageGroup && 
        //                     <div >
        //                             <NavLink to={`/groups/${groupId}/update`} className={styles.update}> Update</NavLink> 
        //                             <NavLink to="#" onClick={()=>handleDelete()} className={styles.delete}>Delete</NavLink>
        //                             <NavLink to="/event/new" >                                
        //                                 <button className={styles.createEvent} >Create Event <FontAwesomeIcon className="arrowIcon" icon={faAngleDown} /></button>
        //                             </NavLink>
        //                             <NavLink to={`/${groupId}/venue`} >                                
        //                                 <button className={styles.createVenue} >Create Venue <FontAwesomeIcon className="arrowIcon" icon={faAngleDown} /></button>
        //                             </NavLink>

        //                     </div>
        //             } 
                        
        //         </div>
        //         </div>               
        //         <div>
        //             <Switch>
        //                 <Route path="/groups/:groupId/about">
        //                     <AboutGroup group={group}/>
        //                 </Route>
        //                 <Route path="/groups/:groupId/events">
        //                     <GroupEvents group={group}/>
        //                 </Route>
        //             </Switch>
        //         </div>   
                                               
        //     </div>
 
        // </div>
        
    ))
}