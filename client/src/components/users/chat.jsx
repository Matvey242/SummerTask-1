import styles from './users.module.css'

const Chat = ({ curUser }) => {

    return (
        <div className={styles["container"]}>
            <h1>Чат с {curUser.username}</h1>
            <div className={styles["container1-1"]}></div>
            <div className={styles["container1-2"]}>
                <input className={styles['chatInput']} type='text'></input>
            </div>
        </div>
    )
}

export default Chat