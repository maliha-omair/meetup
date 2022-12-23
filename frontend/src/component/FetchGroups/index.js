import React from "react";
import { useQuery } from "react-query";
import { csrfFetch } from "../../store/csrf";
import axios from "axios";
import styles from "../FetchGroups/FetchGroups.module.css"
export default function FetchGroups() {

    const { isLoading, isError, data , isSuccess } = useQuery("allGroups", () => {
        return csrfFetch("/api/groups",{
            method:'GET'
          })

    });
    if(!isSuccess){
        return(
            <div>
                failing
            </div>
        )
    }

    if (isLoading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }

    if (isError) {
        return (
            <div>
                <h1>Unable to fetch data please try again</h1>
            </div>
        )
    }


    console.log("query result is ... ", data.data.Groups[0].attributes);
    
    return (
        <div >
            <table className={styles.table}>
                <tr className={styles.tr}>
                    <th className={styles.th}>
                        Name
                    </th>
                    <th className={styles.th}>
                        Description
                    </th>
                    <th className={styles.th}>
                        type
                    </th>
                </tr>
           
            {data.data.Groups.map((group, index) => {
                // const { name, about, type } = group.name;
                return (
                    <tr key={index} className={styles.tr}>
                        <td className={styles.td}>{group.name}</td>
                        <td className={styles.td}>{group.about}</td>
                        <td className={styles.td}> {group.type}</td>
                        <td className={styles.td} > <button  className={styles.button}>Edit</button></td>
                    </tr>
                )

            })}
             </table>
        </div>

    )
}