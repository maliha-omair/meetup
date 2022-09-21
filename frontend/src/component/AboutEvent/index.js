import styles from "../AboutEvent/AboutEvent.module.css"
export default function AboutEvent({event}){
    return (
        <div className={styles.main}>
            {event.description}
        </div>
    )
}