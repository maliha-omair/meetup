import image from "../../assets/eventDisplay.jpeg";
import { useHistory } from "react-router-dom";
import styles from "../ListEvents/ListEvents.module.css";
export default function ListEvents({events, currentUser}){

    const history = useHistory();
    function formatMemberSinceDate(dateStr){
        const months={
            0: 'January',
            1: 'February',
            2: 'March',
            3: 'April',
            4: 'May',
            5: 'June',
            6: 'July',
            7: 'August',
            8: 'September',
            9: 'October',
            10: 'November',
            11: 'December',
        };
        const d = new Date(dateStr);
        return `${months[d.getMonth()]}, ${d.getFullYear()}`;
    }
    
    function handleClick(eventId){      
        history.push(`/events/${eventId}`)        
    }

    return (events &&(
        <>
            {events.map((event,index)=>{
                return(
                    <div className={styles.mainDiv} key={index} value={event.id} onClick={()=>{handleClick(event.id)}}>
                        <div >
                            <img src={image} className={styles.displayImage}></img>
                        </div>
                        <div className={styles.listEvents}>     
                            <div className={styles.date}>{formatMemberSinceDate(event.createdAt)}</div>                      
                            <div className={styles.name}>{event.name}</div>
                            <div className={styles.discription}>{event.description.substring(0,100)} ...</div>
                            <div className={styles.numAttending}>{event.numAttending} attendee</div>
                        </div>
                        <div>
                            {(currentUser !== null && currentUser.id === event.Group.organizerId) &&
                                <div className={styles.loginUserFeatures}>
                                    <div>Edit</div>
                                    <div>Delete</div>
                                </div>
                            } 
                        </div>
                    </div>
                )
            })}
        </>
    ))
}