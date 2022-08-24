import { NavLink, useParams, useHistory, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { useState,useEffect } from "react";
import * as eventActions from "../../store/events";  
import image from "../../assets/eventById.png"
import styles from "../Event/Event.module.css"


export default function Event({sessionUser}){
    const event = useSelector(state=> state.event.currentEvent);
    const [errors, setErrors] = useState([]);
    const params = useParams();
    const eventId = params.eventId;
    const dispatch = useDispatch();
   
    console.log(event)

    useEffect(()=>{
        dispatch(eventActions.getEventByIdThunk(eventId))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });
    },[dispatch])
    
    return (event &&(
        <>
            <ul>
                {errors.map((error, idx) => <li className="li-login" key={idx}>{error}</li>)}
            </ul>
            <div className={styles.mainDiv}>
                <div className={styles.mainHeading}>
                        <div>
                            {event[0].createdAt}
                        </div>
                        <div>
                            {event[0].name}
                        </div>
                        <div>
                            
                        </div>
                       
                </div>
                <div>

                </div>
            </div>
        </>
    ));
}