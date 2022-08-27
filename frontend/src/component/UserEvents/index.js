import styles from "../GroupEvents/GroupEvents.module.css"
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useInsertionEffect, useState } from "react";
import * as eventActions from "../../store/events";                                               
import { useDispatch,useSelector } from 'react-redux';
import ListEvents from "../ListEvents";
import ListControl from "../ListControl";


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

    console.log(allEvents)
   
    return(
        <>
            <ul>
                {errors.map((error, idx) => <li className="li-login" key={idx}>{error}</li>)}
            </ul>

            <ListControl altMessage="No Events found" elements={allEvents}>
                {allEvents && (
                    <div className={styles.main}>
                        <ListEvents events={Object.values(allEvents)} currentUser={sessionUser} />
                    </div>
                    )
                }
            </ListControl>
        </>
    )
}