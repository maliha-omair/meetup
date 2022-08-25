import { Redirect } from "react-router-dom";

export default function RequiresSessionUser( {sessionUser, Children, location}){
    const sessionUser = props.sessionUser;
    if(sessionUser){
        return Children
    }else{
        <Redirect to ={location} />
    }
    

}