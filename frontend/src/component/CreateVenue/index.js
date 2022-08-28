import {useState} from "react"
import { NavLink, useParams, useHistory, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import styles from "../CreateVenue/CreateVenue.module.css"
import createVenue from "../../store/venue";
import { useEffect } from "react";

export default function CreateVenue({ sessionUser}){

    const [address,setAddress] = useState("")
    const [city,setCity] = useState("")
    const [state,setState] = useState("")
    const [lat,setLat] = useState("")
    const [lng,setLng] = useState("")
    const [errors, setErrors] = useState([]);
    
    const dispatch = useDispatch();   
    const params = useParams()
    const currentGroup = useSelector(state => state.group.currentGroup);
    const history = useHistory()

    const groupId = params.groupId;
    if(!sessionUser || !currentGroup){
        console.log(sessionUser,currentGroup)
        history.push("/")
    }

    function handleSubmit(e){ 
        e.preventDefault();
        const venue = {
            groupId,
            address,
            city,
            state,
            lat:parseInt(lat),
            lng:parseInt(lng)            
        }
        console.log(venue)
        setErrors([]);
        return dispatch(createVenue(venue))
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
                        Create a venue
                        <div className={styles.subHeading}>{currentGroup.name}</div>
                        <hr></hr>
                    </div>
                    <div>
                    <ul>
                        {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
                    </ul>
                    </div>
                    
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Address</label>
                        <input type="text" className={styles.titleTextArea}  value={address} onChange={(e)=>setAddress(e.target.value)} />
                    </div>
                    
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>City</label>
                        <input type="text" className={styles.titleTextArea}  value={city} onChange={(e)=>setCity(e.target.value)} />
                    </div>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>State</label>
                        <input type="text" className={styles.titleTextArea}  value={state} onChange={(e)=>setState(e.target.value)} />
                    </div>               

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Latitude</label>
                        <input type="text" className={styles.attendeeInput} value={lat} onChange={(e)=>setLat(e.target.value)}/>                        
                    </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Logitude</label>
                        <input type="text" className={styles.amountDiv} value={lng} onChange={(e)=>setLng(e.target.value)} />
                    </div>
                  
                  
                    <div className={styles.inputDiv}>
                        <button type="submit"  className={styles.publishEvent}>Submit</button>
                    </div>
                    <br></br>
                
                </div>
                        
                
               
            </div>
        </form>
    ));
}