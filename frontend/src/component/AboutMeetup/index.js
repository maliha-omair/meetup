import styles from "../AboutMeetup/AboutMeetup.module.css"
import image from "../../assets/aboutMeetup.jpg"
import { useHistory } from 'react-router-dom';
export default function AboutMeetup(){
    const history = useHistory()
    return(
        <div className={styles.main}>
           <div className={styles.subDiv}>
                <div className={styles.heading}>
                    Meetup creates possibilities
                </div>
                <div className={styles.paragraph}>
                    Meetup is a platform for finding and building local communities. People use Meetup to meet new people, learn new things, find support, get out of their comfort zones, and pursue their passions, together.
                </div>
                <button className={styles.button} onClick={()=>history.push("/signup")}> Join Meetup</button>
            </div>
            <div style={{ backgroundImage: `url(${image})` }}>
                <img src={image}></img>
            </div>
        </div>
    )
}