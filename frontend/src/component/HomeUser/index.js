import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHandsClapping} from '@fortawesome/free-solid-svg-icons'
import "../HomeUser/HomeUser.css"

export default function HomeUser({user}){
    return(
        <div className="hone-user-main-div">
            <div className="sub-div">
                <h1>Welcome {user.firstName} 👋</h1>
               
            </div>
        </div>
    )
}