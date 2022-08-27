import styles from "../GroupEvents/GroupEvents.module.css"
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useInsertionEffect, useState } from "react";
import * as eventActions from "../../store/events";                                               
import { useDispatch,useSelector } from 'react-redux';
import ListEvents from "../ListEvents";
import ListControl from "../ListControl";

export default function GroupEvents(){
    const dispatch = useDispatch()
    const [errors, setErrors] = useState([]);
    const allEvents = useSelector(state => state.event.events);
    const sessionUser = useSelector(state => state.session.user);


    const history = useHistory();
    const params = useParams();
    let groupId = params.groupId;
    let events = [];
    
    useEffect(()=>{
        dispatch(eventActions.getGroupEventsThunk(groupId))        
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });
    },[dispatch, groupId])

    console.log(allEvents)
   
    return(
        <ListControl altMessage="No events found" elements={allEvents}>
            {
            allEvents && (
            <div className={styles.main}>
            <ul>
                    {errors.map((error, idx) => <li className="li-login" key={idx}>{error}</li>)}
                </ul>
                <ListEvents events={Object.values(allEvents)} currentUser={sessionUser} />
            </div>
            )}
        </ListControl>
    )
}