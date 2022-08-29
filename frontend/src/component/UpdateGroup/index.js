import {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import { Redirect, useHistory,useParams } from 'react-router-dom';
import * as groupActions from "../../store/groups";
import smallLogo from "../../assets/meetup-logo.png"
import styles from "../UpdateGroup/UpdateGroup.module.css"

export default function UpdateGroup(){
    const dispatch = useDispatch();
    const [groupName,setGroupName] = useState("");
    const [about,setAbout] = useState("");
    const [isPrivate,setIsPrivate] = useState(false);
    const [city,setCity] = useState("");
    const [state,setState] = useState("");
    const [type,setType] = useState("");
    const [errors, setErrors] = useState([]);
    const [imageUrl,setImageUrl] = useState("");
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();
    const params = useParams();
    const group  = useSelector(state => state.group.group);
    const groupTypeOptions = ["In person","Online"];
    
    
    useEffect(()=>{
        dispatch(groupActions.getGroupByIdThunk(groupId))
    },[dispatch])

    useEffect(()=>{
        if(group){
            setAbout(group.about);
            setGroupName(group.name);
            setIsPrivate(group.private);
            setCity(group.city);
            setState(group.state);
            setType(group.type);
            if(group.Images) setImageUrl(group.Images[0].url)
        }
    },[group]);

    let groupId = params.groupId;
    if(sessionUser===null) return(
        history.push("/login")
    )
    
    function handleSubmit(e){ 
        e.preventDefault();
        const group = {
            name:groupName, 
            about:about,
            isPrivate:isPrivate,
            city:city,
            type:type,
            state:state,
            imageUrl: imageUrl
        }
        
        setErrors([]);
        return dispatch(groupActions.updateGroupThunk(group,groupId)).then((res)=>{
            history.push(`/groups/${groupId}`);
        }).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(Object.values(data.errors))            
            }
        });     
    }

    return (group && (
        <form onSubmit={handleSubmit} >
            <div className={styles.body}>
                <div className={styles.centerBody}>
                    <div className={styles.heading}>
                        Update Group
                        <div className={styles.subHeading}>{group.name}</div>
                        <hr></hr>
                    </div>
                    <ul>
                        {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
                    </ul>
                    
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Name</label>
                        <input type="text" className={styles.titleTextArea}  value={groupName} onChange={(e)=>setGroupName(e.target.value)} />
                    </div>
                    <div className={styles.inputDiv}>
                         <label className={styles.label}>About</label>
                         <textarea className={styles.titleTextArea} rows="4" cols="33" value={about} onChange={((e)=>setAbout(e.target.value))}></textarea>   
                     </div>
                     <div className={styles.inputDiv}>
                        <label className={styles.label}>Type</label>
                        <select  className={styles.titleTextArea} value={type} onChange={(e)=>setType(e.target.value)}>
                             {
                                 groupTypeOptions.map((opt, index) =>(
                                     <option key={index} value={opt}   className={styles.inputOption} >{opt}</option>
                                ))
                             }
                        </select>                    
                    </div>
                    <div className={styles.inputPrivateDiv}>
                        <input type="checkbox" className={styles.inputPrivate} checked={isPrivate} onChange={(e)=>setIsPrivate(!isPrivate)}></input>   
                        &nbsp;<label className={styles.label}>Private</label>
                        
                     </div>
                     <div className={styles.inputDiv}>
                        <label className={styles.label}>City</label>
                        <input type="text" className={styles.titleTextArea} value={city}  onChange={((e)=>setCity(e.target.value))}></input>   
                    </div>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>State</label>
                        <input type="text" className={styles.titleTextArea} value={state} onChange={((e)=>setState(e.target.value))}></input>   
                    </div>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Image Url</label>
                        <input type="text" className={styles.titleTextArea} value={imageUrl} onChange={((e)=>setImageUrl(e.target.value))}></input>   
                    </div>

                    <div className={styles.inputDiv}>
                        <button type="submit"  className={styles.updateGroup}>Update</button>
                    </div>
                    <br></br>
                </div>
            </div>
        </form>
        
    ));
}