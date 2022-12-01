import {useState} from "react"
import { NavLink, useParams, useHistory, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import styles from "../EditVenue/EditVenue.module.css"
import createVenue, { editVenue } from "../../store/venue";
import { useEffect } from "react";
import { getGroupByIdThunk } from "../../store/groups";

export default function EditVenue({ sessionUser}){

    const [address,setAddress] = useState("")
    const [city,setCity] = useState("")
    const [state,setState] = useState("")
    const [lat,setLat] = useState("")
    const [lng,setLng] = useState("")
    const [errors, setErrors] = useState([]);
    
    const dispatch = useDispatch();   
    const params = useParams();
    const currentGroup = useSelector(state => state.group.group);
    const history = useHistory();
    const groupId = params.groupId;
    const venueId = parseInt(params.venueId);

    let currentVenue = undefined

    if(!sessionUser ){
        history.push("/")
    }

   
    useEffect(() => {
        if (!currentGroup) {
            dispatch(getGroupByIdThunk(groupId)).catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(Object.values(data.errors));
            });
        }else{
            console.log(JSON.stringify(currentGroup));
            currentVenue = Object.values(currentGroup.Venues).find(venue => venue.id === venueId);
            console.log(JSON.stringify(currentVenue));
            if(currentVenue){
                setCity(currentVenue.city)
                setState(currentVenue.state)
                setAddress(currentVenue.address)
                setLat(currentVenue.lat)
                setLng(currentVenue.lng)
            }
            }
    }, [dispatch, groupId, currentGroup]);

    function handleSubmit(e){ 
        e.preventDefault();
        const venue = {
            venueId,
            address,
            city,
            state,
            lat:parseInt(lat),
            lng:parseInt(lng)            
        }
        console.log(venue)
        setErrors([]);
        return dispatch(editVenue(venue))
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
                        Edit venue
                        <div className={styles.subHeading}>{currentGroup.name}</div>
                        <hr></hr>
                    </div>
                    <div>                        
                    <div className={styles.errorDiv}>
                        <ul className={styles.errorMessageUl}>
                            {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
                        </ul>
                    </div>
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