import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUsers } from '../../store/slices/userSlices.js'
import styles from './users.module.css'

const UserList = ({ setUser }) => {
    const dispatch = useDispatch()
    const { users, status } = useSelector((state) => state.users)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(getUsers())
        }
    }, [status, dispatch])

    return (
            <div className={styles["block"]}>
            <h2 className={styles['h2']}>Пользователи</h2>
            <ul className={styles['userList']}>
                {users.map((user) => (
                    <li key={user.id} onClick={() => setUser(user)}>{user.username}</li>
                ))}
            </ul>
        </div>
    )
}

export default UserList