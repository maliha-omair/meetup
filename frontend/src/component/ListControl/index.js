import { Redirect } from "react-router-dom";

export default function ListControl ( {children, elements, altMessage}){
    if(!elements) return (<h3>{altMessage}</h3>)
    if(elements && elements.length > 0){
        return children
    }else{
        return (<h3>{altMessage}</h3>)
    }
    

}