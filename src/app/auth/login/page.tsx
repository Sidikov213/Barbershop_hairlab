'use client'
import './page.css'
import PasswordField from "@/components/PasswordField"
import { FormEvent, useState } from "react"


const LoginPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
    }

    return (
        <>
        
            <img className='f-b-1' src='/assets/icons/f-e-2.svg' />
            <div className="main-container">
                <header className="header">
                    <div className="header__dagcode-logo">
                        <img src='/assets/icons/dagcode-icon-text.svg' />
                    </div>
                </header>

                <section className="login-container">
                    <h1 className="login__heading">Вход в систему</h1>
                    <form className="login__form" onSubmit={handleSubmit}>
                        <div className='login__field-container'>
                            <input placeholder="E-mail" className="login__field" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                            <PasswordField placeholder="Пароль" value={password} onValueChange={setPassword}/>
                        </div>
                        <div className="login__buttons-container">
                            <button className="login__login-button" onClick={handleSubmit}>Войти</button>
                        </div>
                    </form>
                </section>
            </div>
        </>
    )
}

export default LoginPage