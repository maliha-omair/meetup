import styles from "../GroupEvents/GroupEvents.module.css"
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useInsertionEffect, useState } from "react";
import * as eventActions from "../../store/events";
import { useDispatch, useSelector } from 'react-redux';
import ListEvents from "../ListEvents";
import ListControl from "../ListControl";
import EmptyListMessage from "../EmptyListMessage";

export default function GroupEvents() {
    const dispatch = useDispatch()
    const [errors, setErrors] = useState([]);
    const allEvents = useSelector(state => state.event.events);
    const sessionUser = useSelector(state => state.session.user);


    const history = useHistory();
    const params = useParams();
    let groupId = params.groupId;
    let events = [];

    useEffect(() => {
        dispatch(eventActions.getGroupEventsThunk(groupId))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(Object.values(data.errors));
            });
    }, [dispatch, groupId])


    return (
        <>

            <div className={styles.errorDiv}>
                <ul className={styles.errorMessageUl}>
                    {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
                </ul>
            </div>
            <ListControl altChildren={<EmptyListMessage listType="events" />} elements={allEvents}>
                {
                    allEvents && (
                        <div className={styles.main}>
                            <div className={styles.pageHeading}>
                                <div className={styles.eventHeading}>
                                    Events
                                </div>
                            </div>
                            <ListEvents events={Object.values(allEvents)} currentUser={sessionUser} />
                        </div>
                    )}
            </ListControl>
        </>
    )
}