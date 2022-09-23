import { NavLink, useParams, useHistory, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import image from "../../assets/ImageNotFound.jpg"
import styles from "./Group.module.css"
import Divider from "../Divider/Divider";
import { useState, useEffect } from "react";

import { getGroupByIdThunk, deleteGroupThunk } from "../../store/groups";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faLocationDot, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import AboutGroup from "../AboutGroup";
import GroupEvents from "../GroupEvents";

export default function Group({ sessionUser }) {


    const [errors, setErrors] = useState([]);

    const history = useHistory();
    const params = useParams();
    let groupId = params.groupId;

    const group = useSelector(state => state.group.group);

    const dispatch = useDispatch();


    useEffect(() => {

        dispatch(getGroupByIdThunk(groupId)).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });
    }, [dispatch, groupId]);

    function handleDelete() {
        dispatch(deleteGroupThunk(groupId))
            .then((res) => { history.push("/userGroup") })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(Object.values(data.errors))
                }
            })
    }

    return (group && (
        <div className={styles.main}>
            <div className={styles.errorDiv}>
                <ul className={styles.errorMessageUl}>
                    {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
                </ul>
            </div>
            <div className={styles.groupDetail}>
                <div>
                    {(group.Images && group.Images.length > 0) && (
                        <img src={group.Images[0].url} className={styles.groupImage} alt="display"></img>
                    )}
                    {(!group.Images || !group.Images.length > 0) && (
                        <img src={image} className={styles.groupImage} alt="display"></img>
                    )}
                </div>
                <div className={styles.detailText}>
                    <div className={styles.title}> {group.name}</div>
                    <div className={styles.cityState}>  <FontAwesomeIcon icon={faLocationDot} />&nbsp;&nbsp;{group.city}, {group.state}</div>
                    <div className={styles.members}> <FontAwesomeIcon icon={faUserGroup} />&nbsp;{group.numMembers} members - {group.private ? `Private` : `Public`}</div>
                    <div className={styles.organized}><FontAwesomeIcon icon={faUser} />&nbsp;&nbsp;Organized by <b> {group.Organizer.firstName}  {group.Organizer.lastName.charAt(0)}.</b></div>
                </div>
            </div>

            <div className={styles.divider}><hr></hr></div>

            <div className={styles.navigationMenu}>
                <div className={styles.navItems}>
                    <nav className={styles.aboutEvent}>
                        <NavLink className={styles.about} to={`/groups/${groupId}/about`} >About</NavLink>
                        <NavLink className={styles.event} to={`/groups/${groupId}/events`} >Events</NavLink>
                    </nav>


                    {(sessionUser && sessionUser.id === group.organizerId) &&
                        <nav>
                            <NavLink className={styles.update} to={`/groups/${groupId}/update`} > Update</NavLink>
                            <NavLink className={styles.delete} to="#" onClick={() => handleDelete()} >Delete</NavLink>
                            <NavLink to="/event/new" >
                                <button className={styles.createEvent} >Create Event <FontAwesomeIcon className="arrowIcon" icon={faAngleDown} /></button>
                            </NavLink>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <NavLink to={`/${groupId}/venue`} >
                                <button className={styles.createVenue} >Create Venue <FontAwesomeIcon className="arrowIcon" icon={faAngleDown} /></button>
                            </NavLink>

                        </nav>
                    }
                </div>

            </div>

            <div className={styles.groupDesc}>
                <Switch>
                    <Route path="/groups/:groupId/about">
                        <AboutGroup group={group} />
                    </Route>
                    <Route path="/groups/:groupId/events">
                        <GroupEvents group={group} />
                    </Route>
                </Switch>
            </div>

        </div>
    ))
}