import styles from './AuthInput.module.css'

function AuthInput({ type, placeholder, onChange, value }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      className={styles['AuthInput']}
      onChange={onChange}
    />
  )
}

export default AuthInput