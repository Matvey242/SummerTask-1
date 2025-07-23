import { useState } from "react"
import styles from './auth.module.css'
import AuthInput from "../../components/Input/AuthInput.jsx"
import { NavLink } from "react-router"
import {
    OnChangeLogName,
    OnChangeLogPassword
} from '../../utils/checks.js'
import { useDispatch } from "react-redux"
import { loginUser } from "../../store/slices/auth/authSlice.js"


function Login() {
    const dispatch = useDispatch()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

 return (
<div className={styles["container"]}>
        <h1 className={styles["h1"]}>Log In</h1>
        <form className={styles["formL"]} action="#">
            <div className={styles["blockNameL"]}>
                <AuthInput type='text' placeholder='Nickname' value={username} onChange={(event) => OnChangeLogName(event, setUsername)}/>
            </div>
            <div className={styles["blockPasswordL"]}>
                <AuthInput type='password' placeholder='Password' value={password} onChange={(event) => OnChangeLogPassword(event, setPassword)}/>
            </div>
        </form>
        <div className={styles["btnBlock"]}>
        <button className={styles["btn"]} onClick={() => dispatch(loginUser({ username, password }))}>Log In</button>
        <span className={styles["LinkSpan"]}>Dont have an accout? <NavLink to='/register' className={styles['Link']}>Register</NavLink></span>
        </div>
    </div>
 )
}

export default Login