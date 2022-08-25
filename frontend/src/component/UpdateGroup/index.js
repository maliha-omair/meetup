import {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import { Redirect, useHistory,useParams } from 'react-router-dom';
import * as groupActions from "../../store/groups";
import smallLogo from "../../assets/meetup-logo.png"
import styles from "../UpdateGroup/UpdateGroup.module.css"

export default function UpdateGroup(){
    const dispatch = useDispatch();
    const [groupName,setGroupName] = useState("")
    const [about,setAbout] = useState("")
    const [isPrivate,setIsPrivate] = useState(false)
    const [city,setCity] = useState("")
    const [state,setState] = useState("")
    const [type,setType] = useState("")
    const [errors, setErrors] = useState([]);
    const sessionUser = useSelector(state => state.session.user)
    const history = useHistory()
    const params = useParams();
    const group  = useSelector(state => state.group.currentGroup);
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
            state:state
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
        <form onSubmit={handleSubmit} className={styles.main}>
            <div className={styles.subMain}>
                <div className={styles.signup}>
                    <img src={smallLogo} alt="logo" className={styles.logo} />
                    <h1 className="login-title-signup">Update Group</h1>    
                </div>
                <div className={styles.innerDiv}>
                    <ul>
                        {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
                    </ul>
                </div>
                <div className={styles.innerDiv}>
                    <label className={styles.createGroupLabel}>Name</label>
                    <input type="text" className={styles.input} value={groupName} onChange={((e)=>setGroupName(e.target.value))}></input>   
                </div>
                <div className={styles.innerDiv}>
                    <label className={styles.createGroupLabel}>about</label>
                    <textarea className={styles.textArea} rows="4" cols="33" value={about} onChange={((e)=>setAbout(e.target.value))}></textarea>   
                </div>
                <div className={styles.innerDiv}>
                    <label className={styles.createGroupLabel}>type</label>
                    <select  className={styles.inputOption} value={type} onChange={(e)=>setType(e.target.value)}>
                        {
                            groupTypeOptions.map((opt, index) =>(
                                <option key={index} value={opt}   className={styles.inputOption} >{opt}</option>
                            ))
                        }
                    </select>                    
                </div>
                <div className={styles.innerDivPrivate}>
                    <label className={styles.createGroupLabel}>private</label>
                    <input type="checkbox" className={styles.inputPrivate} checked={isPrivate} onChange={(e)=>setIsPrivate(!isPrivate)}></input>   
                </div>
                <div className={styles.innerDiv}>
                    <label className={styles.createGroupLabel}>City</label>
                    <input type="text" className={styles.input} value={city}  onChange={((e)=>setCity(e.target.value))}></input>   
                </div>
                <div className={styles.innerDiv}>
                    <label className={styles.createGroupLabel}>state</label>
                    <input type="text" className={styles.input} value={state} onChange={((e)=>setState(e.target.value))}></input>   
                </div>
                <div className={styles.buttonDiv}>
                    <button type="submit" className={styles.formButton}>Update</button>
                </div>
            </div>           
        </form>
    ));
}