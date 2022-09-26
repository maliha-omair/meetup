import { NavLink } from 'react-router-dom';
import emptyGroups from '../../assets/EmptyGroups.svg';
// import emptyEvents from '../../assets/EmptyGroups.svg';
import emptyEvents from '../../assets/NoAttending.svg';
import styles from "../EmptyListMessage/EmptyListMessage.module.css"

export default function EmptyListMessage({listType}){

if (listType === "groups")
{    
    return (
        <div className={styles.main}>
            <NavLink to="/" className={styles.back}>&lt;- Back to home page</NavLink>
            <img src={emptyGroups} className={styles.image}></img>
            <h3>No groups joined</h3>
            <div className={styles.noGroups}> groups you join and organize will be shown here. </div>
        </div>
)}else{
    return (
        <div className={styles.main}>
            <NavLink to="/" className={styles.back}>&lt;- Back to home page</NavLink>
            <img src={emptyEvents} className={styles.image}></img>
            <div className={styles.noEvents}>You are not hosting any upcoming events</div>
        </div>
    )    
}

}