import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, useNavigate } from 'react-router'
import { createChat, joinPublicChat, fetchChats } from '../../store/slices/chat/chatSlice'
import { createPublicChat, fetchPubChats, joinPubPrivateChat, joinPubPublicChat, setCurrentPubChat } from '../../store/slices/chat/publicChatSlice'
import { getAllUsers } from '../../store/slices/users/usersSlice'
import styles from './mainPage.module.css'
import { setPassword, setTitle } from '../auth/checks'

const HomePage = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { user } = useSelector(state => state.auth)
	const { users } = useSelector(state => state.users)
	const { chats } = useSelector(state => state.chat)
	const { pubChats, currentPubChat } = useSelector(state => state.pubChat)
	const [chatList, setChatList] = useState(false)
	const [userList, setUserList] = useState(true)
	const [inputList, setInputList] = useState(false)
	const [chatTitle, setChatTitle] = useState()
	const [chatPassword, setChatPassword] = useState()

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
		const getPubChats = async () => {
			try {
				await dispatch(fetchPubChats()).unwrap()
			} catch (err) {
				alert(err.message)
			}
		}
		fetchUsers()
		getChats()
		getPubChats()
	}, [dispatch])


	const showChatList = async () => {
		setChatList(true)
		setUserList(false)
		setInputList(false)
		await dispatch(fetchPubChats()).unwrap()
	}

	const showUserList = async () => {
		setChatList(false)
		setUserList(true)
		setInputList(false)
		await dispatch(getAllUsers()).unwrap()
	}

	const showInputList = async () => {
		setChatList(false)
		setUserList(false)
		setInputList(true)
	}

	const startPubChat = async () => {
		try {
			const updPrivacy = chatPassword ? 'private' : 'public'
			const createdChat = await dispatch(
				createPublicChat({
					title: chatTitle,
					password: chatPassword,
					privacy: updPrivacy
				})
			).unwrap()
			alert('Чат создан')
			const chatId = createdChat._id
			await dispatch(joinPubPublicChat(chatId)).unwrap()
			navigate(`/chat/${chatId}`)
		} catch (err) {
			alert(err.message)
		}
	}

	const startChat = async otherUserId => {
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
					title: 'unnamed',
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
        const curChatId = currentPubChat._id
        const chat = pubChats.find(chat => chat._id == curChatId)

        if (!chat) {
           return alert('Чат не найден')
        }

        if (chat.privacy == 'public') {
            await dispatch(joinPubPublicChat(curChatId)).unwrap()
            navigate(`/chat/${curChatId}`)
        } else if (chat.privacy == 'private') {
            const passwordP = prompt('Введите пароль')
            if (passwordP === chat.password) {
                await dispatch(joinPubPrivateChat({ chatId: curChatId, password: passwordP })).unwrap()
                navigate(`/chat/${curChatId}`)
            } else {
                alert('Неверный пароль')
            }
        }
    } catch (err) {
        alert(err.message)
    }
}

	return (
		<div className={styles["container"]}>
			<div className={styles["TopCont"]}>
				<h2 className={styles['h2']}>Добро пожаловать, {user.username}</h2>
			</div>
			<div className={styles["BottomCont"]}>
				<div className={styles["BottomBlock1"]}>
					<div onClick={showUserList} className={styles["selUsers"]}>Пользователи</div>
					<div onClick={showChatList} className={styles["selChats"]}>Чаты</div>
					<div onClick={showInputList} className={styles["makeChat"]}>Создать чат</div>
				</div>
				<div className={styles["BottomBlock2"]}>
				{userList ? (
					<ul className={styles['list']}>
				        {users.map(u => (
					        <li key={u._id}>
						        <div onClick={() => startChat(u._id)} className={styles["UserLi"]}>{u.username}</div>
					        </li>
				        ))}
			        </ul>
					)
				: ''}
				{chatList ? (
					<ul className={styles['list']}>
						{pubChats.map(pubChat => (
							<li key={pubChat._id}>
								<div onClick={() => dispatch(setCurrentPubChat(pubChat))} className={styles["ChatLi"]}>{pubChat.title}<button onClick={joinChat} className={styles['joinBtn']}>Зайти</button></div>
							</li>
						))}
					</ul>
				)
			: ''}
			    {inputList ? (
					<form className={styles['chatForm']} action='#'>
						<input value={chatTitle} onChange={(event) => setTitle(event, setChatTitle)} type='text' className={styles['inputTitle']}></input>
						<input value={chatPassword} onChange={(event) => setPassword(event, setChatPassword)} type='password' className={styles['inputPassword']}></input>
						<button onClick={() => startPubChat()} className={styles['createBtn']}>Создать</button>
					</form>
			    ) : ''}
				</div>
			</div>
		</div>
	)
}

export default HomePage