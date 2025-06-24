import { useState } from "react"
import UserList from '../components/users/userList.jsx'
import Chat from '../components/users/chat.jsx'
import styles from './mainPage.module.css'

const Main = () => {

    const [curUser, setUser] = useState('')

    return (
         <div className={styles["container"]}>
            <div className={styles["userList"]}><UserList setUser={setUser} /></div>
            <div className={styles["line"]}></div>
            {curUser ? (
            <div className={styles["chatDiv"]}><Chat curUser={curUser} /></div>
            ) : ''}
         </div>
    )
}

export default Main
