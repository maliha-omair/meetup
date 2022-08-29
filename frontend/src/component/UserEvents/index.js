import styles from "./UserEvents.module.css"
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useInsertionEffect, useState } from "react";
import * as eventActions from "../../store/events";                                               
import { useDispatch,useSelector } from 'react-redux';
import ListEvents from "../ListEvents";
import ListControl from "../ListControl";
import EmptyListMessage from "../EmptyListMessage";


export default function UserEvents({}){
    const dispatch = useDispatch()
    const [errors, setErrors] = useState([]);
    const allEvents = useSelector(state => state.event.events);
    const sessionUser = useSelector(state => state.session.user);


    const history = useHistory();
    if(!sessionUser){
        history.push("/")
    }
    
    let events = [];
    
    useEffect(()=>{
        dispatch(eventActions.getUserEventsThunk(sessionUser.id))        
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });
    },[dispatch])

   
    return(
        <div className={styles.main}>
            <ul>
                {errors.map((error, idx) => <li className="li-login" key={idx}>{error}</li>)}
            </ul>

            <ListControl altChildren={<EmptyListMessage listType="events" />}  elements={allEvents}>
                {allEvents && (
                    <ListEvents events={Object.values(allEvents)} currentUser={sessionUser} />
                )}
            </ListControl>
        </div>
    )
}