import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, useNavigate } from 'react-router'
import { createChat, joinPublicChat, fetchChats, createGroupChat, setCurrentChat, fetchMyChats } from '../../store/slices/chat/chatSlice'
import { getAllUsers } from '../../store/slices/users/usersSlice'
import styles from './mainPage.module.css'
import { setPassword, setTitle } from '../../utils/checks'
import cn from 'classnames'
import { useTheme } from '../../context/theme/useTheme'
import { IoIosSettings } from 'react-icons/io'
import { MdDarkMode, MdLightMode, } from 'react-icons/md'
import { TbDoorEnter } from "react-icons/tb"
import { GiExitDoor } from "react-icons/gi"
import { logout } from '../../store/slices/auth/authSlice'

const HomePage = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { user } = useSelector(state => state.auth)
	const { users } = useSelector(state => state.users)
	const { chats, currentChat } = useSelector(state => state.chat)
	const { theme, toggleTheme } = useTheme()
	const [chatList, setChatList] = useState(false)
	const [allChats, setAllChats] = useState(false)
	const [userList, setUserList] = useState(true)
	const [inputList, setInputList] = useState(false)
	const [chatTitle, setChatTitle] = useState()
	const [chatPassword, setChatPassword] = useState()
	const [selectedUsers, setSelectedUsers] = useState([])
	const [btnActive, setBtnActive] = useState(false)
	const [isSettingsDropDownOpen, setIsSettingsDropDownOpen] = useState(false)


	useEffect(() => {
		const fetchUsers = async () => {
			try {
				await dispatch(getAllUsers()).unwrap()
			} catch (err) {
				alert(err.message)
			}
		}
		const getChats = async () => {
			try {
				await dispatch(fetchChats()).unwrap()
			} catch (err) {
				alert(err.message)
			}
		}
		fetchUsers()
		getChats()
	}, [dispatch])


	const showChatList = async () => {
		setAllChats(false)
		setChatList(true)
		setUserList(false)
		setInputList(false)
		setBtnActive(false)
		await dispatch(fetchMyChats()).unwrap()
	}

	const showAllChatList = async () => {
		setAllChats(true)
		setChatList(false)
		setUserList(false)
		setInputList(false)
		setBtnActive(false)
		await dispatch(fetchChats()).unwrap()
	}

	const showUserList = async () => {
		setChatList(false)
		setAllChats(false)
		setUserList(true)
		setInputList(false)
		setBtnActive(false)
		await dispatch(getAllUsers()).unwrap()
	}

	const showInputList = async () => {
		setChatList(false)
		setAllChats(false)
		setUserList(false)
		setInputList(true)
		setBtnActive(false)
	}

	const startGroupChat = async () => {
		try {
			const updPrivacy = chatPassword ? 'private' : 'public'
			const createdChat = await dispatch(
				createGroupChat({
					title: chatTitle,
					password: chatPassword,
					privacy: updPrivacy,
					members: [user._id, ...selectedUsers]
				})
			).unwrap()
			const chatId = createdChat._id
			navigate(`/chat/${chatId}`)
		} catch (err) {
			alert('Чат с таким названием уже создан')
		}
	}

	const startChat = async (otherUserId, otherUserName) => {
		try {
			const sameChat = chats.find(chat => {
				return (
					chat.members.includes(user._id) && chat.members.includes(otherUserId)
				)
			})
			if (sameChat) {
				navigate(`/chat/${sameChat._id}`)
			} else {
			const createdChat = await dispatch(
				createChat({
					title: otherUserName,
					privacy: 'public',
					password: null,
					members: [user._id, otherUserId]
				})
			).unwrap()
			alert('Чат создан')
			console.log(createdChat)
			const chatId = createdChat._id
			await dispatch(joinPublicChat(chatId)).unwrap()
			navigate(`/chat/${chatId}`)
		}
		} catch (err) {
			alert(err.message)
		}
	}

const joinChat = async () => {
    try {
        const curChatId = currentChat._id
		navigate(`/chat/${curChatId}`)
    } catch (err) {
        alert(err.message)
    }
}

	const toggleUserSelection = userId => {
		setSelectedUsers(prev =>
			prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
		)
	}

	const btnActivate = () => {
		setBtnActive(!btnActive)
	}

    const handleToggleSettingsDropdown = () => setIsSettingsDropDownOpen(prev => !prev)

	const settingsContainerClasses = cn(styles['settings-container'], {
		[styles.active]: isSettingsDropDownOpen
	})
	const settingsDropdownClasses = cn(styles['dropdown'], {
		[styles['is-open']]: isSettingsDropDownOpen
	})
	const ThemeIcon = theme === 'light' ? MdDarkMode : MdLightMode
	const hlogout = () => dispatch(logout())
	

	return (
		<div className={styles["container"]}>
			<div className={styles["TopBlock"]}>
				<div className={styles["TopBlock1"]}>
					<div className={styles['profileIcon']}></div>
					<span className={styles['username']}>{user.username}</span>
				</div>
				<div className={styles["TopBlock2"]}>
			<div className={settingsContainerClasses} onClick={handleToggleSettingsDropdown}>
				<IoIosSettings className={cn(styles['settings-icon'])} />
				<ul className={cn(settingsDropdownClasses, styles['settings-dropdown'])}>
					<li onClick={toggleTheme}>
						<ThemeIcon className={styles['dropdown__icon']} />
					</li>
					<li onClick={hlogout}>
						<GiExitDoor className={styles['dropdown__icon']} />
					</li>
				</ul>
			</div>
				</div>
			</div>
			<div className={styles["BottomBlock"]}>
				<div className={styles["BottomBlock1"]}>
					<div onClick={showUserList} className={`${styles["selUsers"]} ${userList === true ? styles.blue : ""}`}>Пользователи</div>
					<div onClick={showChatList} className={`${styles["selChats"]} ${chatList === true ? styles.blue : ""}`}>Мои чаты</div>
					<div onClick={showAllChatList} className={`${styles["selChats"]} ${allChats === true ? styles.blue : ""}`}>Все чаты</div>
					<div onClick={showInputList} className={`${styles["makeChat"]} ${inputList === true ? styles.blue : ""}`}>Создать чат</div>
				</div>
				<div className={styles["BottomBlock2"]}>
				{userList ? (
					<ul className={styles['list']}>
				        {users.map(u => (
					        <li key={u._id}>
						        <div onClick={() => startChat(u._id, u.username)} className={styles["UserLi"]}>{u.username}</div>
					        </li>
				        ))}
			        </ul>
					)
				: ''}
				{chatList ? (
					<ul className={styles['list']}>
						{chats.map(pubChat => (
							<li key={pubChat._id}>
								<div onClick={() => dispatch(setCurrentChat(pubChat))} className={styles["ChatLi"]}>{pubChat.title}<TbDoorEnter onClick={joinChat} className={styles['joinBtn']} /></div>
							</li>
						))}
					</ul>
				)
			: ''}
				{allChats ? (
					<ul className={styles['list']}>
						{chats.map(pubChat => (
							<li key={pubChat._id}>
								<div onClick={() => dispatch(setCurrentChat(pubChat))} className={styles["ChatLi"]}>{pubChat.title}<TbDoorEnter onClick={joinChat} className={styles['joinBtn']} /></div>
							</li>
						))}
					</ul>
				)
			: ''}
			    {inputList ? (
					<form className={styles['chatForm']} action='#'>
						<input placeholder='Название' value={chatTitle} onChange={(event) => setTitle(event, setChatTitle)} type='text' className={styles['inputTitle']}></input>
						<input placeholder='Пароль' value={chatPassword} onChange={(event) => setPassword(event, setChatPassword)} type='password' className={styles['inputPassword']}></input>
						<button onClick={btnActivate} className={styles['selectUsersBtn']}>Выбрать пользователей</button>
						<button onClick={() => startGroupChat()} className={styles['createBtn']}>Создать</button>
					</form>
			    ) : ''}
				</div>
                {btnActive ? (
                    <div className={styles["activeBlock"]}>
                        {users.map(u => {
                            const isSelected = selectedUsers.includes(u._id)
				            return (
                                <div key={u._id}>
                                    <label 
                                    className={`${styles['UserLi']} ${isSelected ? styles['selected'] : ''}`} 
                                    htmlFor={`user-${u._id}`}
                                    onClick={() => toggleUserSelection(u._id)}
                                >{u.username}</label>
                    </div>
				)
            })}
    </div>
) : ''}
</div>
			</div>
	)
}

export default HomePage