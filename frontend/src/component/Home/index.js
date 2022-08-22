import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import HomeGuest from '../HomeGuest';
import HomeUser from '../HomeUser';



export default function Home(){
    
    const sessionUser = useSelector(state => state.session.user);
    return (sessionUser ? <HomeUser user={sessionUser}/> : <HomeGuest />);

}