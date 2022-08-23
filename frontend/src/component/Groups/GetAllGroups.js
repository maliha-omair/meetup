import styles from "../Groups/GetAllGroups.module.css"
import { useDispatch,useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import image from "../../assets/groupDisplayImage.jpg"
import * as groupActions from "../../store/groups";

export default function GetAllGroups(){
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const allGroups = useSelector(state => state.group.allGroups)
    
    let groupsArr = [];
    
    useEffect(()=>{
        dispatch(groupActions.getGroups())        
    },[dispatch])
    

    if(!allGroups){
        console.log("no groups in response")
        return null 
    }else{
        console.log("groups are ", allGroups)
        groupsArr = Object.values(allGroups);
        console.log("groups Arr is ",groupsArr)
    }
    function handleClick(groupId){
        console.log("value from div",groupId)
        
    }

    return(allGroups && (
        <>            
            <div className={styles.heading}>
                <h1>Groups</h1>            
            </div>
            {groupsArr.map((group,idx)=>{
                return(
                    <div className={styles.mainDiv} value={group.id} onClick={()=>{handleClick(group.id)}}>                         
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
                                        {group.about.substring(1,200)}...
                                    </div>
                                    <div className={styles.members}>
                                        {group.numMembers} members - {group.private ? `Private`: `Public`}
                                    </div>                            
                            </div>
                            <div>                                    
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    ));

}