import { NavLink, useParams, useHistory, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from "react";
import * as eventActions from "../../store/events";
import image from "../../assets/ImageNotFound.jpg"
import styles from "../Event/Event.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons'
import { deleteEventThunk } from "../../store/events"
import AboutEvent from "../AboutEvent";

export default function Event() {
    const event = useSelector(state => state.event.event);
    const sessionUser = useSelector(state => state.session.user);
    const params = useParams();
    const eventId = params.eventId;
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(() => {
        dispatch(eventActions.getEventByIdThunk(eventId));
    }, [dispatch])


    function handleDelete() {
        dispatch(deleteEventThunk(eventId))
            .then((res) => { history.push("/") });
    }

    return (event && (

        <div className={styles.container}>

            <div className={styles.mainDiv}>
                <div className={styles.main}>
                    <div className={styles.date}>{new Date(event.createdAt).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</div>
                    <div className={styles.title}> {event.name}</div>
                    <div className={styles.hostedBy}>
                        <div className={styles.hostedText}>Hosted By</div>
                        <div className={styles.hostedName}>{event.Group.Organizer.firstName}  {event.Group.Organizer.lastName.charAt(0)}.</div>
                    </div>
                </div>
            </div>
            <div>
                <hr className={styles.divider}></hr>
            </div>
            <div className={styles.body}>
                <div className={styles.middle}>
                    <div>
                        {(!event.Images || !event.Images.length > 0) && (
                            <div >
                                <img src={image} className={styles.displayImage}></img>
                            </div>
                        )}
                        {(event.Images && event.Images.length > 0) && (
                            <div >
                                <img src={event.Images[0].url} className={styles.displayImage}></img>
                            </div>
                        )}
                    </div>

                    <div className={styles.rightBlock}>
                        <div>
                            <div className={styles.groupName}>{event.Group.name}</div>
                            <div className={styles.type}>{event.Group.private ? "Private" : "Public"} Group</div>
                        </div>
                        <div>
                            <div className={styles.eventDate}>
                                <FontAwesomeIcon icon={faClock} />  From {new Date(event.startDate).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
                                &nbsp;at {new Date(event.startDate).toLocaleTimeString()}&nbsp;
                                to {new Date(event.endDate).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
                                &nbsp;at {new Date(event.endDate).toLocaleTimeString()}
                            </div>
                            <div className={styles.eventVenue}>
                                <FontAwesomeIcon icon={faLocationDot} /> {event.Venue.city} , {event.Venue.state}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.navigationMenu}>
                    <div className={styles.bottom}>

                        <nav>
                            <NavLink className={styles.about} to={`/events/${eventId}/about`} >About</NavLink>
                        </nav>
                        {(sessionUser && sessionUser.id === event.Group.organizerId) &&
                            <nav >
                                <NavLink to={`/events/${eventId}/update`} className={styles.update}>Update</NavLink>
                                <NavLink to="#" onClick={() => handleDelete()} className={styles.delete}>Delete</NavLink>
                            
                            </nav>
                        }

                    </div>
                </div>
                <div className={styles.desc}>
                    <Switch>
                        <Route exact path="/events/:eventId/about">
                            <AboutEvent event={event} />
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>

    ));
}