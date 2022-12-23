import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import * as eventActions from "../../store/events";
import styles from "../GetAllEvents/GetAllEvents.module.css"
import ListControl from '../ListControl';
import ListEvents from '../ListEvents';
// import { csrfFetch } from '../../store/csrf';
import EmptyListMessage from '../EmptyListMessage';

import axios from "axios";
import { useQuery } from "react-query";

export default function GetAllEvents() {
    // const dispatch = useDispatch();
    // const [errors, setErrors] = useState([]);
    // const allEvents = useSelector(state => state.event.events);
    const history = useHistory();

    const { isLoading, isError, data } = useQuery("allEvents", () => {
        return axios("/api/events");
    
    });
    if (isLoading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
     }
   
    
    if (isError) {
        return (
            <div>
                <h1>Unable to fetch Groups please try again</h1>
            </div>
        )
    }

    let eventsArr = [];

    // useEffect(() => {
        // dispatch(eventActions.getAllPublicEventsThunk())
    //         .catch(async (res) => {
    //             const data = await res.json();
    //             if (data && data.errors) setErrors(Object.values(data.errors));
    //         });
    // }, [dispatch])

    // if (!allEvents) {
    //     return null;
    // } else {
    //     eventsArr = Object.values(allEvents);
    // }
    console.log(data.data.Events)
    function handleClick(eventId) {
        history.push(`/events/${eventId}`)
    }

    return  (

       
            <div className={styles.main}>


                <div className={styles.pageHeading}>
                    <div className={styles.event}>Events</div><div className={styles.group}><NavLink className={styles.links} to="/allGroups">&nbsp;&nbsp;Groups</NavLink></div>
                </div>
                <ListControl altChildren={<EmptyListMessage listType="groups" />} elements={data.data.Events}>
                    <ListEvents events={data.data.Events} />
                </ListControl>
            </div>
       


    );

}