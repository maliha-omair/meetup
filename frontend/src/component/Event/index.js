import { NavLink, useParams, useHistory, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { useState,useEffect } from "react";
import * as eventActions from "../../store/events";  
import image from "../../assets/eventById.png"
import styles from "../Event/Event.module.css"
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";
import {deleteEventThunk} from "../../store/events"

export default function Event(){
    const event = useSelector(state=> state.event.currentEvent);
    const sessionUser = useSelector(state=> state.session.user);
    const [errors, setErrors] = useState([]);
    const params = useParams();
    const eventId = params.eventId;
    const dispatch = useDispatch();
    const history = useHistory();
   
    console.log(event)

    useEffect(()=>{
        dispatch(eventActions.getEventByIdThunk(eventId))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });
    },[dispatch])
    
    function handleDelete(){
        dispatch(deleteEventThunk(eventId))
        .then((res)=>{history.push("/")})
        .catch(async (res)=>{
            const data = await res.json();
            if (data && data.errors) {
                setErrors(Object.values(data.errors))            
            }
        })
    }
    return (event &&(
          <div className={styles.container}>
            <ul>
                {errors.map((error, idx) => <li className="li-login" key={idx}>{error}</li>)}
            </ul>
            <div className={styles.mainDiv}>
                <div className={styles.mainHeader}>
                    <div className={styles.date}>
                        {event.createdAt}
                    </div>
                    <div className={styles.eventHeading}>
                        <h1>
                            {event.name}
                        </h1>
                    </div>
                    <div>
                        <span className={styles.hostedBy}>Hosted By</span> <br></br><span className={styles.orga}> {event.Group.Organizer.firstName}  {event.Group.Organizer.lastName}</span>
                        <hr className={styles.solid}></hr>
                    </div>                     
                </div>
                
                
                <div className={styles.detailHeader}>
                    <div className={styles.detail}>
                        <img src={image}></img>
                        <div className={styles.manageEvent}>
                            
                            {sessionUser.id === event.Group.organizerId &&
                                <div className={styles.deleteEvent}>
                                     <NavLink to="#" className={styles.delete}>Update</NavLink>
                                     <NavLink to="#" onClick={()=>handleDelete()} className={styles.delete}>Delete</NavLink>
                                     
                                </div>
                            }
                            
                        </div>    
                        <div className={styles.detailText}>
                            Details                            
                        </div>
                        <div>
                            {event.description}
                        </div>
                        <div>
                            $ {event.price} for a week
                        </div>
                        

                    </div>
                    <div>
                        <div>
                            {event.startDate} to {event.endDate}
                        </div>
                        <div>
                            {event.Group.name}
                        </div>                 
                        <div>
                            {event.Group.private ? "Private" : "Public"}
                        </div>
                    </div>   
                </div>
                <div>

                </div>
            </div>
            </div>
        
    ));
}