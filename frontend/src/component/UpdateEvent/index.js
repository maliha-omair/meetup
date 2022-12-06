import { useState } from "react"
import { NavLink, useParams, useHistory, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { updateEventThunk } from "../../store/events"
import * as eventActions from "../../store/events";
import * as groupActions from "../../store/groups";


import styles from "../UpdateEvent/UpdateEvent.module.css"

import { useEffect } from "react";

export default function UpdateEvent({ sessionUser }) {


    const [name, setName] = useState("")
    const [type, setType] = useState("In person")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [venueId, setVenueId] = useState("");
    const [errors, setErrors] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [price, setPrice] = useState(0.01);
    const [file, setFile] = useState(null);

    const event = useSelector(state => state.event.event);
    const currentGroup = useSelector(state => state.group.group);

    const history = useHistory()
    const dispatch = useDispatch();
    const params = useParams();

    if (sessionUser === undefined || sessionUser === null) { history.push("/") }


    useEffect(() => {
        dispatch(eventActions.getEventByIdThunk(eventId));
    }, [dispatch])

    useEffect(() => {
        if (event) {
            dispatch(groupActions.getGroupByIdThunk(event.Group.id));
        }
    }, [event])


    if (event && event.Group) {
        if (sessionUser.id !== event.Group.organizerId) { history.push(`/events/${eventId}`) }
    }
    const eventId = params.eventId;


    useEffect(() => {
        if (event) {
            setName(event.name);
            setType(event.type);
            setStartDate(new Date(event.startDate).toISOString().slice(0, -1));
            setEndDate(new Date(event.endDate).toISOString().slice(0, -1));
            setCapacity(event.capacity)
            setPrice(event.price)
            setDescription(event.description);
            setVenueId(event.venueId)
            if (event.Images && event.Images.length > 0) setImageUrl(event.Images[0].url);
        }
    }, [event]);

    function handleSubmit(e) {
        e.preventDefault();


        const groupId = currentGroup.id;
        const eventToUpdate = {
            id: eventId,
            venueId: parseInt(venueId),
            name,
            type,
            description,
            capacity,
            price,
            startDate,
            endDate,
            file
        }
        setErrors([]);
        if (!venueId) {
            return setErrors(["Please create venue for the group"])
        }
        return dispatch(updateEventThunk(eventToUpdate))
            .then((res) => {
                history.push(`/groups/${groupId}`)
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(Object.values(data.errors))
                }
            });

    }

    function handleEndDate(e) {

        setEndDate(e.target.value)
    }

    function handleStartDate(e) {

        setStartDate(e.target.value)
    }
    function fileSelected(e) {
        const file = e.target.files[0];
        setFile(file)
    }

    return (currentGroup && event && (
        <form onSubmit={handleSubmit}>
            <div className={styles.body}>
                <div className={styles.centerBody}>
                    <div className={styles.heading}>
                        Update event
                        <div className={styles.subHeading}>{currentGroup.name}</div>
                        <hr></hr>
                    </div>
                    <div className={styles.errorDiv}>
                        <ul className={styles.errorMessageUl}>
                            {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
                        </ul>
                    </div>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Title <span className={styles.requiredText}>(required)</span></label>
                        <input type="text" className={styles.titleTextArea} value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Start Date and time</label>
                        <div className={styles.dateTime}>
                            <div >
                                <input type="datetime-local" className={styles.date} value={startDate} onChange={(e) => handleStartDate(e)} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>End Date and time</label>
                        <div className={styles.dateTime}>
                            <div >
                                <input type="datetime-local" className={styles.date} defaultValue={endDate} onChange={(e) => handleEndDate(e)} />
                            </div>

                        </div>
                    </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Description</label>
                        <textarea type="text" className={styles.description} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Type</label>
                        <select className={styles.type} value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="In person" className={styles.inputOption}>In person</option>
                            <option value="Online" className={styles.inputOption}>Online</option>
                        </select>
                    </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Capacity</label>
                        <div className={styles.attendeeTextAndInput}>
                            <input type="number" min="0.0" className={styles.attendeeInput} value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                            <span className={styles.attendeeText}>Set the total number of attendees for this event. Members will see how many spots are available</span>
                        </div>
                    </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Event Fee</label>
                        <input type="number" min={0} step={0.1} className={styles.amountDiv} value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Venue </label>
                        <select className={styles.titleTextArea} value={venueId} onChange={(e) => setVenueId(e.target.value)}>
                            {(
                                Object.values(currentGroup.Venues).map((ele, index) => {
                                    return (
                                        <option key={index} value={ele.id} className={styles.inputOption}>{ele.address} latitude {ele.lat} longitude {ele.long}</option>
                                    )
                                })
                            )}
                        </select>
                    </div>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Upload Image</label>
                        {/* <input type="text" className={styles.titleTextArea} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /> */}
                        <input type="file" onChange={fileSelected} className={styles.imageFile} aria-label="File browser example" accept="image/*"></input>


                    </div>

                   
                
                {/* <div className={styles.inputDiv}>
                    <label className={styles.label}>Image url </label>
                    <input type="text" className={styles.titleTextArea} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div> */}

                <div className={styles.inputDiv}>
                    <button type="submit" className={styles.publishEvent}>Update</button>
                </div>
                <br></br>
            </div>



        </div>
        </form >
    ));
}