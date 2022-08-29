import { useDispatch,useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import image from "../../assets/groupDisplayImage.jpg"
import * as groupActions from "../../store/groups";
import styles from "../GetAllGroups/GetAllGroups.module.css"
import ListControl from '../ListControl';
import ListGroups from "../ListGroups"
import Divider from '../Divider/Divider';
import EmptyListMessage from '../EmptyListMessage';

export default function GetAllGroups(){
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const allGroups = useSelector(state => state.group.groups);
    const history = useHistory();
    
    let groupsArr = [];
    
    useEffect(()=>{
        dispatch(groupActions.getAllGroupsThunk())        
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });
    },[dispatch]);   

    return(allGroups && (
      
        <>
        <div className={styles.main}>
            <div>
            <ul>
                {errors.map((error, idx) => <li className="li-login" key={idx}>{error}</li>)}
            </ul>
            </div>
             <div className={styles.pageHeading}>
                <div className={styles.event}><NavLink className={styles.links} to="/allEvents">Events</NavLink></div><div className={styles.group}>Groups</div>
             </div>
           
            
            <ListControl altChildren={<EmptyListMessage listType="groups"/>} elements={allGroups}>            
                  <ListGroups groups={allGroups}/>
            </ListControl>    
            </div>
            </>

      
    ));

}