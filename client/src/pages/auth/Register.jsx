import { useState } from "react"
import styles from './auth.module.css'
import AuthInput from "../../components/Input/AuthInput.jsx"
import { NavLink } from "react-router"
import {
    OnChangeName,
    OnChangeEmail,
    OnChangePassword,
    OnChangeRepPassword,
} from './checks.js'
import { useDispatch } from "react-redux"
import { registerUser } from "../../store/slices/auth/authSlice.js"

function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()


    return (
        <div className={styles["container"]}>
            <h1 className={styles["h1"]}>Register</h1>
            <form className={styles["formR"]} action="#">
                <div className={styles["blockName"]}>
                    <AuthInput type='text' placeholder='Nickname' value={username} onChange={(event) => OnChangeName(event, setUsername)} />
                </div>
                <div className={styles["blockEmail"]}>
                    <AuthInput type='text' placeholder='Email' value={email} onChange={(event) => OnChangeEmail(event, setEmail)} />
                </div>
                <div className={styles["blockPassword"]}>
                    <AuthInput type='password' placeholder='Password' value={password} onChange={(event) => OnChangePassword(event, setPassword)} />
                </div>
            </form>
            <div className={styles["btnBlock"]}>
                <button className={styles["btn"]} onClick={() => dispatch(registerUser({ username, email, password }))}>Register</button>
                <span className={styles["LinkSpan"]}>Have an account? <NavLink to='/login' className={styles['Link']}>Log In</NavLink></span>
            </div>
        </div>
    )
}

export default Register