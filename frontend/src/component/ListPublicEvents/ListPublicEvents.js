import { useDispatch,useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import image from "../../assets/groupDisplayImage.jpg"
import * as groupActions from "../../store/groups";
import styles from "../ListGroups/ListGroups.module.css"


export default function ListPublicEvents({events}){
    const allEvents = events;
    const history = useHistory();
    
    let eventsArr = [];
    
   
    if(!allEvents){
        return null; 
    }else{
        eventsArr = Object.values(allEvents);
    }
    function handleClick(eventId){      
        history.push(`/events/${eventId}`)        
    }

    return(allEvents && (
      
       
           
           <div>
            {eventsArr.map((event,idx)=>{
                return(

            <div key={idx} value={event.id} onClick={()=>{handleClick(event.id)}} className={styles.body}>  
                
                <div className={styles.middleList}>
                    <div className={styles.imageDivList}> 
                            { (event.Images && event.Images.length > 0) && ( 
                            <div className={styles.imageDiv} >
                                <img src={event.Images[0].url} className={styles.image}  alt="The image alt"/>
                            </div>
                            )}
                            { (!event.Images || event.Images.length===0)&&  ( 
                                <div className={styles.imageDiv}>
                                        <img src={image} className={styles.image}/>
                                </div>
                            )}
                    </div>
                    <div>
                        <div className={styles.titleList}> {event.startDate}</div>
                        <div className={styles.titleList}> {event.name}</div>
                        <div> <p className={styles.paragraphList}> {event.description.substring(0,200)}... </p></div>
                      
                    </div>
                </div>
            </div>        
                )
            })}
       
        
       </div>

      
    ));

}