import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import image from "../../assets/groupDisplayImage.jpg"
import * as groupActions from "../../store/groups";
import styles from "../GetAllGroups/GetAllGroups.module.css"
import ListControl from '../ListControl';
import ListGroups from "../ListGroups"
import Divider from '../Divider/Divider';
import EmptyListMessage from '../EmptyListMessage';
import axios from "axios";
import { useQuery } from "react-query";



export default function GetAllGroups() {
    // const dispatch = useDispatch();
    // const [errors, setErrors] = useState([]);
    // const allGroups = useSelector(state => state.group.groups);
    

    const { isLoading, isError, data } = useQuery("allGroups", () => {
        return axios("/api/groups")
    
    });
    if (isLoading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
     }
   
    
    if (isError) {
        return (
            <div>
                <h1>Unable to fetch Groups please try again</h1>
            </div>
        )
    }

    return  (

      
            <div className={styles.main}>

                <div className={styles.pageHeading}>
                    <div className={styles.event}><NavLink className={styles.links} to="/allEvents">Events&nbsp;&nbsp;</NavLink></div><div className={styles.group}>Groups</div>
                </div>

                <ListControl altChildren={<EmptyListMessage listType="groups" />} elements={data.data.Groups}>
                    <ListGroups groups={data.data.Groups} />
                </ListControl>
            
            </div>
      


    );

}