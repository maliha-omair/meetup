import {useState, useEffect} from "react"
import { useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { resetState } from "../../store";
import { logout } from "../../store/session";

export default function Logout(){
    const [errors, setErrors] = useState([]);
    const history = useHistory();
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(logout())
        .then(()=> dispatch(resetState()))
        .then(() => history.push('/'))
        .catch(async (res) => {
            const data = await res.json();
            if (data.errors) 
            {
                setErrors(data.errors);
            }
        });
    })    
    return(
        <div>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
        </div>
    ) 
}