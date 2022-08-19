import {useState} from "react"
import smallLogo from "../../assets/small-logo.png"
import "../../css/style.css"
export default function LoginFormPage(){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [checked,setChecked] = useState(true)


    return(        
        <div className="main">
            <div className="sub-main">
                <div>
                    <div className="imgs">
                        <div className="container-image">
                            <img src={smallLogo} alt="logo" className="login"/>
                        </div>
                    </div>
                </div>
                <h1>Login</h1>
                <h4>Not a member yet? Sign up</h4>
                <div className="email-div">
                    <label className="email" >Email</label>
                    <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div className="pass-div">
                    <label className="pass">Password</label>
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>    
                <div className="login-checkbox-div">
                    <input type="checkbox" className="login-check" value={checked} onChange={(e)=>setChecked(e.target.value)} />
                    <label>Keep me signed in</label>
                </div>
                <div >
                    <button className="login-button">Log in</button>
                </div>
                {/* <div>
                    <label>Email</label>
                    <input type="text" />
                </div>
                <div>
                    <label>Password</label>
                    <input type="text" />
                </div>    
                <div>
                    <input type="checkbox"  />
                    <label>Keep me signed in</label>
                </div>
                <div>
                    <button>Log in</button>
                </div> */}
            </div>
        </div>
        
    )
}