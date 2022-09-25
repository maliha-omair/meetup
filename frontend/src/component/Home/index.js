
import HomeGuest from '../HomeGuest';
import HomeUser from '../HomeUser';
import { useDispatch, useSelector } from 'react-redux';



export default function Home(){
   
    const sessionUser = useSelector(state => state.session.user);
    return (sessionUser ? <HomeUser user={sessionUser}/> : <HomeGuest user={sessionUser}/>);

}