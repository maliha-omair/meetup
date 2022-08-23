import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import { Redirect, useHistory } from 'react-router-dom';
import * as groupActions from "../../store/groups";
import smallLogo from "../../assets/meetup-logo.png"
import styles from "../Groups/GroupsForm.module.css"

export function GroupsForm(){
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
      return dispatch(groupActions.createGroup(group)).then((res)=>{
        history.push("/profile");
      }).catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            console.log("errors from response are",data.errors)
            setErrors(Object.values(data.errors))            
          }
        });     
    }

    return (
        <form onSubmit={handleSubmit} className={styles.main}>
            <div className={styles.subMain}>
                <div className={styles.signup}>
                    <img src={smallLogo} alt="logo" className={styles.logo} />
                    <h1 className="login-title-signup">Create New Group</h1>    
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
                    <input type="text" className={styles.input} value={about} onChange={((e)=>setAbout(e.target.value))}></input>   
                </div>
                <div className={styles.innerDiv}>
                    <label className={styles.createGroupLabel}>type</label>
                    <input type="textarea" 
                    className={styles.input} value={type} onChange={(e)=>setType(e.target.value)}></input>   
                </div>
                <div className={styles.innerDiv}>
                    <label className={styles.createGroupLabel}>private</label>
                    <input type="checkbox" className={styles.input} value={isPrivate} onChange={(e)=>setIsPrivate(!isPrivate)}></input>   
                </div>
                <div className={styles.innerDiv}>
                    <label className={styles.createGroupLabel}>City</label>
                    <input type="text" className={styles.input} value={city} onChange={((e)=>setCity(e.target.value))}></input>   
                </div>
                <div className={styles.innerDiv}>
                    <label className={styles.createGroupLabel}>state</label>
                    <input type="text" className={styles.input} value={state} onChange={((e)=>setState(e.target.value))}></input>   
                </div>
                <div className={styles.buttonDiv}>
                    <button type="submit" className={styles.formButton}>Continue</button>
                </div>
            </div>
           
        </form>
    )
}