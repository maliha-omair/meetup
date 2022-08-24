import { useDispatch,useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import image from "../../assets/groupDisplayImage.jpg"
import * as groupActions from "../../store/groups";
import Divider from "../Divider/Divider";
import styles from "../GetAllGroups/GetAllGroups.module.css"

export default function GetAllGroups(){
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const allGroups = useSelector(state => state.group.allGroups);
    const history = useHistory();
    
    let groupsArr = [];
    
    useEffect(()=>{
        dispatch(groupActions.getGroups())        
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });
    },[dispatch])   

    if(!allGroups){
        return null; 
    }else{
        groupsArr = Object.values(allGroups);
    }
    function handleClick(groupId){      
        history.push(`/groups/${groupId}`)        
    }

    return(allGroups && (
        <>            
            <div className={styles.heading}>
                <h1>Groups</h1>            
            </div>
            {groupsArr.map((group,idx)=>{
                return(
                    
                        <div className={styles.mainDiv} key={idx} value={group.id} onClick={()=>{handleClick(group.id)}}>  
                            <ul>
                                {errors.map((error, idx) => <li className="li-login" key={idx}>{error}</li>)}
                            </ul>
                            <div className={styles.subDiv}>                           
                                <div>
                                    <img src={image} className={styles.image}/>
                                </div>
                                <div className={styles.groubDetailDiv}>
                                
                                        <div className={styles.groupName}>
                                            {group.name}
                                        </div>
                                        <div className={styles.city}>
                                            {group.city}, {group.state}
                                        </div>
                                        <div className={styles.about}>
                                            {group.about.substring(0,200)}...
                                        </div>
                                        <div className={styles.members}>
                                            {group.numMembers} members - {group.private ? `Private`: `Public`}
                                        </div>       
                                </div>                                   
                            </div>                           
                    
                        </div>
                )
            })}
        </>
    ));

}