import styles from "../AboutGroup/AboutGroup.module.css"
export default function AboutEvent({event}){
    return (
        <div className={styles.main}>
            {event.description}
        </div>
    )
}