import styles from "./UserEvents.module.css"
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useInsertionEffect, useState } from "react";
import * as eventActions from "../../store/events";
import { useDispatch, useSelector } from 'react-redux';
import ListEvents from "../ListEvents";
import ListControl from "../ListControl";
import EmptyListMessage from "../EmptyListMessage";


export default function UserEvents({ }) {
    const dispatch = useDispatch()
    const [errors, setErrors] = useState([]);
    const allEvents = useSelector(state => state.event.events);
    const sessionUser = useSelector(state => state.session.user);


    const history = useHistory();
    if (!sessionUser) {
        history.push("/")
    }

    let events = [];

    useEffect(() => {
        dispatch(eventActions.getUserEventsThunk(sessionUser.id))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(Object.values(data.errors));
            });
    }, [dispatch])


    return (

        <>
            <ul>
                {errors.map((error, idx) => <li className="li-login" key={idx}>{error}</li>)}
            </ul>

            <ListControl altChildren={<EmptyListMessage listType="events" />} elements={allEvents}>
                {allEvents && (
                    <div className={styles.main}>
                        <div className={styles.pageHeading}>
                            <div className={styles.eventHeading}>Your Events</div>
                        </div>
                        <div>
                            <ListEvents events={Object.values(allEvents)} currentUser={sessionUser} />
                        </div>
                    </div>
                )}
            </ListControl>
        </>
    )
}