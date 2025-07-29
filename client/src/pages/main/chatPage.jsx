import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { useSocket } from '../../context/socket/useSocket.js'
import {
    addMessage,
    fetchMessages,
    joinPrivateChat,
    joinPublicChat,
    setCurrentChat,
    exitChat
} from '../../store/slices/chat/chatSlice.js'
import { getChatByIdAPI } from '../../store/slices/chat/chatAPI.js'
import { GoArrowLeft, GoListUnordered } from "react-icons/go"
import styles from './mainPage.module.css'
import cn from 'classnames'
import { getAllMembers } from '../../store/slices/chat/chatSlice.js'
import { GiExitDoor } from "react-icons/gi"

const ChatPage = () => {
    const navigate = useNavigate()
    const { chatId } = useParams()
    const dispatch = useDispatch()
    const socket = useSocket()
    const { messages, currentChat, currentChatMembers } = useSelector(state => state.chat)
    const { user } = useSelector(state => state.auth)

    const [input, setInput] = useState('')
    const [log, setLog] = useState([])
    const [listOpen, setListOpen] = useState(false)

    useEffect(() => {
        if (!chatId) return

        const fetchChatData = async () => {
            try {
                const chat = await getChatByIdAPI(chatId)
                if (chat.privacy === 'private') {
                    const password = prompt('Введите пароль для приватного чата')
                    if (!password) return navigate(`/`)
                    await dispatch(joinPrivateChat({ chatId, password })).unwrap()
                } else {
                    await dispatch(joinPublicChat(chatId)).unwrap()
                }

                dispatch(setCurrentChat(chat))
                dispatch(fetchMessages(chatId))
            } catch (err) {
                alert(err.message)
                navigate('/')
            }
        }

        fetchChatData()
    }, [chatId, dispatch, navigate])

    useEffect(() => {
        if (!socket || !chatId || !user) return

        socket.emit('joinRoom', {
            chatId,
            userId: user._id,
            username: user.username
        })

        return () => {
            socket.emit('leaveRoom', {
                chatId,
                userId: user._id,
                username: user.username
            })
        }
    }, [socket, chatId, user])

    useEffect(() => {
        if (!socket) return

        const handleNewMessage = msg => {
            if (msg.chat === chatId) {
                dispatch(addMessage(msg))
            }
        }

        const handleUserJoined = ({ username }) => {
            setLog(prev => [...prev, `${username} вошёл в чат`])
        }

        const handleUserLeft = ({ username }) => {
            setLog(prev => [...prev, `${username} вышел из чата`])
        }

        socket.on('newMessage', handleNewMessage)
        socket.on('userJoined', handleUserJoined)
        socket.on('userLeft', handleUserLeft)

        return () => {
            socket.off('newMessage', handleNewMessage)
            socket.off('userJoined', handleUserJoined)
            socket.off('userLeft', handleUserLeft)
        }
    }, [socket, chatId, dispatch])

    useEffect(() => {
        if (currentChat) {
            dispatch(getAllMembers(chatId))
        }
    }, [currentChat, dispatch, chatId])

    const sendMessage = () => {
        if (!socket || !input.trim()) return

        socket.emit('sendMessage', {
            text: input,
            authorId: user._id,
            chatId
        })
        setInput('')
    }

	const goBack = async () => {
        try {
		    navigate(`/`)
        } catch (err) {
            alert(err.message)
        }
    }

    const Exit = async () => {
        try {
            await dispatch(exitChat(chatId)).unwrap()
            navigate(`/`)
        } catch (err) {
            alert(err.message)
        }
    }

    const SwitchListValue = () => setListOpen(prev => !prev)

    const ListContainer = cn(styles['listContainer'], {
        [styles.active]: listOpen
    })

    return (
        <div className={styles['chatContainer']}>
            <div className={styles["titleBlock"]}>
                <div className={styles["titleBlock1"]}>
                    <GoArrowLeft onClick={goBack} className={styles['arrowLeft']} />
                </div>
                <div className={styles["titleBlock2"]}>
                    <h2 className={styles['ChatH2']}>{currentChat?.title}</h2>
                </div>
                <div className={styles["titleBlock3"]}>
                    <GoListUnordered onClick={SwitchListValue} className={styles['svgList']} />
                </div>
            </div>
            <div className={ListContainer}>
                <h1 className={styles['h1']}>Участники</h1>
                <ul className={styles['chatUsersList']}>
                        {currentChatMembers.map(member => (
                            <li key={member._id}>
                                <div className={styles['member']}>{member.username}</div>
                            </li>
                        ))
                    }              
                </ul>
                <div className={styles["ExitDoorBlock"]}>
                <GiExitDoor className={styles['leaveChat']} onClick={Exit} />
                </div>
            </div>
            <div className={styles['chatBox']}>
                {log.map((entry, idx) => (
                    <div key={idx} className={styles['log']}>{entry}</div>
                ))}
                {messages.map(msg => (
                    <div key={msg._id} className={styles['message']}>
                        <b className={styles['author']}>{msg.author?.username || msg.author}: {msg.text}</b>  <span className={styles['date']}>{new Date(msg.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                ))}
            </div>
            <div className={styles['inputContainer']}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    className={styles['inputField']}
                />
                <button className={styles['msgBtn']} onClick={sendMessage}>Отправить</button>
            </div>
        </div>
    )
}

export default ChatPage