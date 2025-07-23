import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { useSocket } from '../../context/socket/useSocket.js'
import {
	addMessage,
	fetchMessages,
	joinPrivateChat,
	joinPublicChat,
	setCurrentChat
} from '../../store/slices/chat/chatSlice.js'
import { getChatByIdAPI } from '../../store/slices/chat/chatAPI.js'
import styles from './mainPage.module.css'

const ChatPage = () => {
	const navigate = useNavigate()
	const { chatId } = useParams()
	const dispatch = useDispatch()
	const socket = useSocket()
	const { messages } = useSelector(state => state.chat)
	const { user } = useSelector(state => state.auth)

	const [input, setInput] = useState('')
	const [log, setLog] = useState([])

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
				alert('Введен неверный пароль')
				navigate('/')
			}
		}

		fetchChatData()
	}, [chatId, dispatch])

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

	// Отправка сообщения
	const sendMessage = () => {
		if (!socket || !input.trim()) return

		socket.emit('sendMessage', {
			text: input,
			authorId: user._id,
			chatId
		})
		setInput('')
	}

	return (
    <div className={styles['chatContainer']}>
      <h2 className={styles['ChatH2']}>Чат</h2>
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