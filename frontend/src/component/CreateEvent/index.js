import {useState} from "react"
import { NavLink, useParams, useHistory, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import {createNewEventThunk} from "../../store/events"
import styles from "../CreateEvent/CreateEvent.module.css"

import { useEffect } from "react";

export default function CreateEvent({ sessionUser}){
    const [name,setName] = useState("")
    const [type,setType] = useState("In person")
    const [startDate,setStartDate] = useState("")
   
    const [endDate,setEndDate] = useState("")
   
    const [description,setDescription] = useState("")
    const [venue,setVenue] = useState(null)
    const [errors, setErrors] = useState([]);
    
    const [capacity,setCapacity] = useState(0)
    const [price,setPrice] = useState(0)
    const currentGroup = useSelector(state => state.group.currentGroup);
    
    
    const history = useHistory()
    const dispatch = useDispatch();   
    const venues = Object.values(currentGroup.Venues);


    if(!sessionUser || !currentGroup){
        console.log(sessionUser,currentGroup)
        history.push("/")
    }

    function handleSubmit(e){ 
        e.preventDefault();

        
        const groupId = currentGroup.id;
        const event ={
            groupId,
            venueId:parseInt(venue),
            name,
            type,
            description,
            capacity,
            price,
            startDate,
            endDate
        }
        setErrors([]);
        return dispatch(createNewEventThunk(event))
        .then((res)=>{
            history.push(`/groups/${groupId}`)
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
            setErrors(Object.values(data.errors))            
            }
        });    

    }  
    
    return (currentGroup && (
        <form onSubmit={handleSubmit}>
            <div className={styles.body}>
                <div className={styles.centerBody}>
                    <div className={styles.heading}>
                        Create an event
                        <div className={styles.subHeading}>{currentGroup.name}</div>
                        <hr></hr>
                    </div>
                    <ul>
                        {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
                    </ul>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Title <span className={styles.requiredText}>(required)</span></label>
                        <input type="text" className={styles.titleTextArea}  value={name} onChange={(e)=>setName(e.target.value)} />
                    </div>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Start Date and time</label>
                        <div className={styles.dateTime}>
                            <div >
                                <input type="datetime-local" className={styles.date}  value={startDate} onChange={(e)=>setStartDate(e.target.value)}/>
                            </div>
                            
                        </div>                        
                    </div>
                    
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>End Date and time</label>
                        <div className={styles.dateTime}>
                            <div >
                                <input type="datetime-local" className={styles.date} value={endDate} onChange={(e)=>setEndDate(e.target.value)}/>
                            </div>
                            
                            
                        </div>                        
                    </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Description</label>
                        <textarea type="text" className={styles.description} value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>                                                    
                    </div>

                    <div className={styles.inputDiv}>
                    <label className={styles.label}>Type</label>
                    <select  className={styles.type} value={type} onChange={(e)=>setType(e.target.value)}>
                        <option value="In person" className={styles.inputOption}>In person</option>
                        <option value="Online"  className={styles.inputOption}>Online</option>
                    </select>                    
                  </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Capacity</label>
                        <div className={styles.attendeeTextAndInput}>
                            <input type="text" key={capacity} className={styles.attendeeInput} value={capacity} onChange={(e)=>setCapacity(e.target.value)}/>                                                    
                            <span className={styles.attendeeText}>Set the total number of attendees for this event. Members will see how many spots are available</span>
                        </div>
                    </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Event Fee</label>
                        <input type="text" className={styles.amountDiv} value={price} onChange={(e)=>setPrice(e.target.value)} />
                    </div>
                    {(currentGroup.Venues &&
                    <select className={styles.inputDiv} value={venue} onChange={(e)=>setVenue(e.target.value)}>
                        {(
                            venues.map((ele,index)=>{
                                return(
                                    <option key={index} value={ele.id} className={styles.inputOption}>{ele.address} latitude {ele.lat} longitude {ele.long}</option>                                
                                )
                            })
                        )}
                    </select>                        
                    )}
                    <div className={styles.inputDiv}>
                        <button type="submit"  className={styles.publishEvent}>Publish</button>
                    </div>
                    <br></br>
                </div>
                        
                
               
            </div>
        </form>
    ));
}