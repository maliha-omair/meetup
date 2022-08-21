import {useState} from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import smallLogo from "../../assets/small-logo.png"
import * as sessionActions from '../../store/session';
import { Redirect } from 'react-router-dom';
import "./LoginFormPage.css"



export default function LoginFormPage(){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();
    if (sessionUser) return (
        <Redirect to="/" />
    );

    function handleSubmit(e){
        e.preventDefault();
        setErrors([]);
        const user = {
            credential:email,
            password:password
        }
        return dispatch(sessionActions.login(user))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(Object.values(data.errors));
        });
       
    }

    return(   
        <form onSubmit={handleSubmit}> 
            <div className="main">
                <div className="sub-main">
                    <div>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                    </div>
                    <div>
                        <div className="imgs">
                            <div className="container-image">
                                <img src={smallLogo} alt="logo" className="imgs"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="login-title">Login</h1>
                        <p className="not-a-member">Not a member yet? Sign up</p>
                    </div>
                    
                    <div className="email-div">
                        <label className="email" >Email</label>
                        <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    <div className="pass-div">
                        <label className="pass">Password</label>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    </div>    
                   
                    <div className="login-button-div">
                        <button className="login-button" type="submit">Log in</button>
                    </div>
                    
                </div>            
            </div>
        </form>     
        
    )
}