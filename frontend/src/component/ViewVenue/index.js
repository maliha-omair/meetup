import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import styles from "../ViewVenue/viewVenue.module.css"
import { getGroupByIdThunk } from "../../store/groups";
import { deleteVenue } from "../../store/venue";
import { useState } from "react";

export default function ViewVenue() {
    const groupId = useParams().groupId;
    const [errors, setErrors] = useState([]);
    const venues = useSelector(state => state.group.group && state.group.group.Venues);
    const group = useSelector(state => state.group && state.group.group);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroupByIdThunk(groupId)).catch(async (res) => {
            
        });
    }, [dispatch, groupId]);
    function handleDelete(id){
        dispatch(deleteVenue(id)).then(() => dispatch(getGroupByIdThunk(groupId)))
        .catch(async (res) => {
            const data = await res.json();

            if (data && data.errors) setErrors(Object.values(data.errors));
        });
    }

    return (venues && venues.length >1 &&(
        <div>
            <div className={styles.groupName}>
                    Venues for &nbsp; <span className={styles.name}>{group.name}</span>
            </div>
            {Object.values(venues).map((venue, idx) => {
                return (venue.address !== "Online") && (

                    <div key={idx} value={venue.id} className={styles.mainDiv} >
                        <div className={styles.subDiv}>
                            <div className={styles.innerDiv}>
                                <div>
                                    Address: &nbsp;&nbsp;&nbsp; {venue.address}
                                </div>
                                <div>
                                    City:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {venue.city}
                                </div>
                                <div>
                                    State: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{venue.state}
                                </div>
                                <div>
                                    lattitude: &nbsp;&nbsp;&nbsp;&nbsp;{venue.lat}
                                </div>
                                <div>
                                    longitude: &nbsp;&nbsp;{venue.lng}
                                </div>
                            </div>
                            <div className={styles.edit}> <NavLink className={styles.edit} to={`/groups/${groupId}/venues/${venue.id}/edit`} ><i class="fa-solid fa-pen-to-square"></i> </NavLink></div>

                            <div onClick={()=>handleDelete(venue.id)} className={styles.edit}>  <i class="fa-solid fa-trash"></i></div>
                            
                        </div>
                        <hr className={styles.divider}></hr>
                        {/* <br></br> */}
                    </div>               
                ) 
            })}

        </div>
    )) || (venues && venues.length <=1 &&  (
        <div className={styles.main}>
            <NavLink to="/" className={styles.back}>&lt;- Back to home page</NavLink>
            <div className={styles.noVenues}>You have not created any venue for events</div>
        </div>
    )   
        
        )
}
