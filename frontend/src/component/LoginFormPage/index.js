import {useState} from "react"
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import smallLogo from "../../assets/small-logo.png"
import * as sessionActions from '../../store/session';
import { Redirect } from 'react-router-dom';
import "./LoginFormPage.css"



export default function LoginFormPage(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [demoUser,setDemoUser] = useState(false);
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();
    if (sessionUser) return (
        <Redirect to="/" />
    );

    function handleSubmit(e){
        e.preventDefault();
        let user={}
        if(demoUser){
             user = {
                credential:"demo@aa.com",
                password:"demouser"
            }
        }else{
            user = {
                credential:email,
                password:password
            }
        }
        setErrors([]);        
        return dispatch(sessionActions.login(user))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });
    }
    

    return(   
        <form onSubmit={handleSubmit} className="main">          

                <div className="sub-main">                   
                    <div className="login-top">                            
                        <img src={smallLogo} alt="logo" className="logo-login"/>
                        <h1 className="login-title">Log in</h1>
                        <span className="not-a-member">Not a member yet? <NavLink to="/signup" className="signup-link" >Sign up</NavLink> </span>
                    </div>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                 
                    <div className="login-sub-div">
                        <label className="login-label" >Email</label>
                        <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>

                    <div className="login-sub-div">
                        <label className="login-label">Password</label>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    </div>    
                   
                    <div className="login-button-div">
                        <button className="login-button" kery="login" type="submit" onClick={()=>setDemoUser(false)}>Log in</button>
                    </div> 
                    <div className="login-button-div">
                        <button className="login-button" key="demouser" type="submit" onClick={()=>setDemoUser(true)} >Demo User</button>
                    </div>
                </div>            
 
        </form>     
        
    )
}