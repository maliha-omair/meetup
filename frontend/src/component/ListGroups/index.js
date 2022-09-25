import { useDispatch,useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import image from "../../assets/ImageNotFound.jpg"

import styles from "../ListGroups/ListGroups.module.css"

export default function ListGroups({groups}){
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const allGroups = groups;
    const history = useHistory();
    
    let groupsArr = [];
    
   
    if(!allGroups){
        return null; 
    }else{
        groupsArr = Object.values(allGroups);
    }

    function handleClick(groupId){      
        history.push(`/groups/${groupId}`)        
    }

    return(allGroups && (
           <div>
            {groupsArr.map((group,idx)=>{
                return(
            <div key={idx} value={group.id} onClick={()=>{handleClick(group.id)}} >  
                
                <div className={styles.middleList}>
                    <div className={styles.imageDivList}> 
                            { (group.Images && group.Images.length > 0) && ( 
                            <div  >
                                
                                <img src={group.Images[0].url} className={styles.img}  alt="The image alt"/>
                            </div>
                            )}
                            { (!group.Images || group.Images.length===0)&&  ( 
                                <div className={styles.img}>
                                        <img src={image} className={styles.img}/>
                                </div>
                            )}
                    </div>
                    <div>
                        <div className={styles.titleList}> {group.name}</div>
                        <div className={styles.cityStateList}> {group.city}, {group.state}</div>
                        <div> 
                            <p className={styles.paragraphList}> {group.about.substring(0,200)}... </p>
                        </div>
                        <div className={styles.membersList}> {group.numMembers} members - {group.private ? `Private`: `Public`} </div>
                    </div>
                    

                </div>
                <div>
                    <hr className={styles.divider}></hr>
                </div>
            </div>        
                )
            })}
       
        
       </div>

      
    ));

}