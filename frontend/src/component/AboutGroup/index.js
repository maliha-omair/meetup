import styles from "../AboutGroup/AboutGroup.module.css"
export default function AboutGroup({group}){
    return (
        <div className={styles.main}>
            {group.about}
        </div>
    )
}