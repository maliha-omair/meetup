

import "../HomeUser/HomeUser.css"
import GetAllGroups from "../GetAllGroups"
import * as groupActions from "../../store/groups";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ListGroups from "../ListGroups"

export default function HomeUser({user}){
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const allGroups = useSelector(state => state.group.groups);




    useEffect(() => {
        dispatch(groupActions.getAllGroupsThunk())
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(Object.values(data.errors));
            });
    }, [dispatch]);

    return(
        <div className="hone-user-main-div">
            <div className="sub-div">
                <h1>Welcome {user.firstName} 👋</h1>
               
            </div>
            <div className="groups">
            <ListGroups groups={allGroups} />
            </div>
        </div>
    )
}