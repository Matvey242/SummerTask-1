import { useState } from "react"
import styles from './auth.module.css'
import { handleLogin } from "./SendRequests"
import AuthInput from "../components/Input/AuthInput"
import { NavLink } from "react-router"
import {
    OnChangeName,
    OnChangeEmail,
    OnChangeLogName,
    OnChangePassword,
    OnChangeRepPassword,
    OnChangeLogPassword
} from './checks.js'


function Login() {
    const [logUsername, setLogUsername] = useState('')
    const [logPassword, setLogPassword] = useState('')


 return (
<div className={styles["container"]}>
        <h1 className={styles["h1"]}>Log In</h1>
        <form className={styles["formL"]} action="#">
            <div className={styles["blockNameL"]}>
                <AuthInput type='text' placeholder='Nickname' value={logUsername} onChange={(event) => OnChangeLogName(event, setLogUsername)}/>
            </div>
            <div className={styles["blockPasswordL"]}>
                <AuthInput type='text' placeholder='Password' value={logPassword} onChange={(event) => OnChangeLogPassword(event, setLogPassword)}/>
            </div>
        </form>
        <div className={styles["btnBlock"]}>
        <button className={styles["btn"]} onClick={(e) => handleLogin(logUsername, logPassword)}>Log In</button>
        <span className={styles["LinkSpan"]}>Dont have an accout? <NavLink to='/auth/register' className={styles['Link']}>Register</NavLink></span>
        </div>
    </div>
 )
}

export default Login