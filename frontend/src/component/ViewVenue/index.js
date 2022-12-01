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
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroupByIdThunk(groupId)).catch(async (res) => {
            const data = await res.json();

        });
    }, [dispatch, groupId]);
    function handleDelete(id){
        dispatch(deleteVenue(id)).then(() => dispatch(getGroupByIdThunk(groupId)))
        .catch(async (res) => {
            const data = await res.json();

            if (data && data.errors) setErrors(Object.values(data.errors));
        });
    }

    return (venues && (
        <div>
            {Object.values(venues).map((venue, idx) => {
                return (venue.address !== "Online") && (
                    <div key={idx} value={venue.id} className={styles.mainDiv} >
                        <div className={styles.subDiv}>
                            <div className={styles.innerDiv}>
                                <div>
                                    Address: {venue.address}
                                </div>
                                <div>
                                    City: {venue.city}
                                </div>
                                <div>
                                    State: {venue.state}
                                </div>
                                <div>
                                    lattitude: {venue.lat}
                                </div>
                                <div>
                                    longitude: {venue.lng}
                                </div>
                            </div>
                            <div className={styles.edit}> <NavLink to={`/groups/${groupId}/venues/${venue.id}/edit`} ><i class="fa-solid fa-pen-to-square"></i> </NavLink></div>

                            <div onClick={()=>handleDelete(venue.id)}>  <i class="fa-solid fa-trash"></i></div>
                            
                        </div>
                        <hr className={styles.divider}></hr>
                        {/* <br></br> */}
                    </div>               
                ) 
            })}

        </div>
    ))
}
