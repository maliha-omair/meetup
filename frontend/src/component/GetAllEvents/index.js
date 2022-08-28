import { useDispatch,useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import * as eventActions from "../../store/events";
import styles from "../GetAllEvents/GetAllEvents.module.css"
import ListControl from '../ListControl';
import ListEvents from '../ListEvents';
import ListPublicEvents from '../ListPublicEvents/ListPublicEvents';

export default function GetAllEvents(){
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const allEvents = useSelector(state => state.event.events);
    const history = useHistory();
    
    let eventsArr = [];
    
    useEffect(()=>{
        dispatch(eventActions.getAllPublicEventsThunk())        
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });
    },[dispatch])   

    if(!allEvents){
        return null; 
    }else{
        eventsArr = Object.values(allEvents);
    }
    function handleClick(eventId){      
        history.push(`/events/${eventId}`)        
    }

    return(allEvents && (
      
        <>
        <div className={styles.main}>
            <div>
            <ul>
                {errors.map((error, idx) => <li className="li-login" key={idx}>{error}</li>)}
            </ul>
            </div>
            <div className={styles.pageHeading}>
                    <div className={styles.event}>Events</div><div className={styles.group}><NavLink className={styles.links} to="/allGroups">Groups</NavLink></div>
            </div>
            <ListControl altMessage="Create group" elements={allEvents}>    
                  <ListPublicEvents events={allEvents}></ListPublicEvents>                          
            </ListControl>    
            </div>
            </>

      
    ));

}