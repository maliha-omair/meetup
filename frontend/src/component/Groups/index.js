import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Redirect, useHistory } from 'react-router-dom';
import * as groupActions from "../../store/groups";
import smallLogo from "../../assets/meetup-logo.png"
import styles from "../Groups/GroupsForm.module.css"

export function GroupsForm() {
    const dispatch = useDispatch();
    const [groupName, setGroupName] = useState("")
    const [about, setAbout] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [type, setType] = useState("In person")
    const [imageUrl, setImageUrl] = useState("")

    const [errors, setErrors] = useState([]);
    const sessionUser = useSelector(state => state.session.user)
    const history = useHistory()

    if (sessionUser === null) return (
        history.push("/login")
    )

    function handleSubmit(e) {
        e.preventDefault();

        const group = {
            name: groupName,
            about: about,
            isPrivate: isPrivate,
            city: city,
            type: type,
            state: state,
            imageUrl: imageUrl
        }

        setErrors([]);
        return dispatch(groupActions.createGroupThunk(group)).then((res) => {
            history.push("/profile");
        }).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(Object.values(data.errors))
            }
        });
    }

    return (

        <form onSubmit={handleSubmit} >
            <div className={styles.body}>
                <div className={styles.centerBody}>
                    <div className={styles.heading}>
                        Create Group

                        <hr></hr>
                    </div>
                    <div className={styles.errorDiv}>
                        <ul className={styles.errorMessageUl}>
                            {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
                        </ul>
                    </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Name</label>
                        <input type="text" className={styles.titleTextArea} value={groupName} onChange={((e) => setGroupName(e.target.value))} />
                    </div>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>About</label>
                        <textarea className={styles.titleTextArea} rows="4" cols="33" value={about} onChange={((e) => setAbout(e.target.value))}></textarea>
                    </div>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Type</label>
                        <select className={styles.titleTextArea} value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="In person" className={styles.inputOption}>In person</option>
                            <option value="Online" className={styles.inputOption}>Online</option>
                        </select>
                    </div>

                    <div className={styles.inputPrivateDiv}>
                        <input type="checkbox" className={styles.inputPrivate} checked={isPrivate} onChange={(e) => setIsPrivate(!isPrivate)}></input>
                        &nbsp;<label className={styles.label}>Private</label>
                    </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>City</label>
                        <input type="text" className={styles.titleTextArea} value={city} onChange={((e) => setCity(e.target.value))}></input>
                    </div>
                    <div className={styles.inputDiv}>
                        <label className={styles.label}>State</label>
                        <input type="text" className={styles.titleTextArea} value={state} onChange={((e) => setState(e.target.value))}></input>
                    </div>

                    <div className={styles.inputDiv}>
                        <label className={styles.label}>Image Url</label>
                        <input type="text" className={styles.titleTextArea} value={imageUrl} onChange={((e) => setImageUrl(e.target.value))}></input>
                    </div>
                    <div className={styles.inputDiv}>
                        <button type="submit" className={styles.updateGroup}>Continue</button>
                    </div>
                    <br></br>
                </div>
            </div>
        </form>
        // <form onSubmit={handleSubmit} className={styles.main}>
        //     <div className={styles.subMain}>
        //         <div className={styles.signup}>
        //             <img src={smallLogo} alt="logo" className={styles.logo} />
        //             <h1 className="login-title-signup">Create New Group</h1>    
        //         </div>
        //         <div className={styles.innerDiv}>
        //             <ul>
        //                 {errors.map((error, idx) => <li className={styles.errorMessageLi} key={idx}>{error}</li>)}
        //             </ul>
        //         </div>
        //         <div className={styles.innerDiv}>
        //             <label className={styles.createGroupLabel}>Name</label>
        //             <input type="text" className={styles.input} value={groupName} onChange={((e)=>setGroupName(e.target.value))}></input>   
        //         </div>
        //         <div className={styles.innerDiv}>
        //             <label className={styles.createGroupLabel}>About</label>
        //             <textarea className={styles.textArea} rows="4" cols="33" value={about} onChange={((e)=>setAbout(e.target.value))}></textarea>   
        //         </div>
        //         <div className={styles.innerDiv}>
        //             <label className={styles.createGroupLabel}>Type</label>
        //             <select  className={styles.inputOption} value={type} onChange={(e)=>setType(e.target.value)}>
        //                 <option value="In person" className={styles.inputOption}>In person</option>
        //                 <option value="Online"  className={styles.inputOption}>Online</option>
        //             </select>                    
        //         </div>
        //         <div className={styles.innerDivPrivate}>
        //             <label className={styles.createGroupLabel}>Private</label>
        //             <input type="checkbox" className={styles.inputPrivate} checked={isPrivate} onChange={(e)=>setIsPrivate(!isPrivate)}></input>   
        //         </div>

        //         <div className={styles.innerDiv}>
        //             <label className={styles.createGroupLabel}>City</label>
        //             <input type="text" className={styles.input} value={city} onChange={((e)=>setCity(e.target.value))}></input>   
        //         </div>
        //         <div className={styles.innerDiv}>
        //             <label className={styles.createGroupLabel}>State</label>
        //             <input type="text" className={styles.input} value={state} onChange={((e)=>setState(e.target.value))}></input>   
        //         </div>

        //         <div className={styles.innerDiv}>
        //             <label className={styles.createGroupLabel}>Image Url</label>
        //             <input type="text" className={styles.input} value={imageUrl} onChange={((e)=>setImageUrl(e.target.value))}></input>   
        //         </div>
        //         <div className={styles.buttonDiv}>
        //             <button type="submit" className={styles.formButton}>Continue</button>
        //         </div>
        //     </div>           
        // </form>
    )
}