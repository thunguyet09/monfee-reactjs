import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import styles from './Register.module.css'
function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = async (e) => {
        const dialogContent = document.querySelector(`#${styles.dialogContent}`)
        const dialogIcon = document.querySelector(`#${styles.dialogContent} > span`)
        const dialogText = document.querySelector(`.${styles.dialogText}`)
        e.preventDefault()
        if(username == '' || email == '' || password == ''){
            dialogContent.style.backgroundColor = '#B70328'
            dialogContent.style.display = 'flex'
            dialogText.innerHTML = 'Vui lòng nhập đầy đủ thông tin'
            dialogIcon.innerHTML = `<span class="material-symbols-outlined">error</span>`
            setTimeout(() => {
                dialogContent.style.display = 'none'
            }, 2000)
        }else{
            const currentDate = new Date()
            const year = currentDate.getFullYear()
            const month = currentDate.getMonth() + 1
            const day = currentDate.getDate()
            const hour = currentDate.getHours()
            const minute = currentDate.getMinutes()
            let formatDate;
            if(minute < 10 && minute < 10){
                formatDate = day + "/" + month + "/" + year + " " + "0"+ hour + ":" + "0" + minute
            }else if(hour < 10){
                formatDate = day + "/" + month + "/" + year + " " + "0"+ hour + ":" + minute
            }else if(minute < 10){
                formatDate = day + "/" + month + "/" + year + " " + hour + ":" + "0" + minute
            }else{
                formatDate = day + "/" + month + "/" + year + " " + hour + ":" + minute
            }
            const obj = {
                full_name: username,
                email: email,
                password: password,
                createdDate: formatDate
            }
            await fetch(`http://localhost:3000/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            .then(() => {
                dialogContent.style.backgroundColor = '#6B8A47'
                dialogContent.style.display = 'flex'
                dialogText.innerHTML = 'Đăng ký thành công'
                dialogIcon.innerHTML = `<span class="material-symbols-outlined">done</span>`
                setTimeout(() => {
                    dialogContent.style.display = 'none'
                }, 2000)
            })
        }

    }

    useEffect(() => {
        const lockIcon = document.querySelector(`.${styles.lockIcon}`)
        const password = document.getElementById(`${styles.password}`)
        let lock = true;
        lockIcon.addEventListener('click', () => {
            lock = !lock
            if(lock){
                password.type = 'text'
                lockIcon.innerHTML = `<span class="material-symbols-outlined">lock_open</span>`
            }else{
                lockIcon.innerHTML = `<span class="material-symbols-outlined">lock</span>`
                password.type = 'password'
            }
        })
    }, [])
    return (
        <div id={styles.register}>
           <div className={styles.register}>
                <img src="./img/login.png" width="500px"/>
                <div className={styles.registerForm}>
                    <h2>REGISTER</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.groupControl}>
                            <label htmlFor="username">Username</label>
                            <input type="text" id={styles.username} name="username" key="username" placeholder='Username' 
                                onChange={(e) => setUsername(e.target.value)}/>
                            <span className={styles.userIcon}>
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                        </div>

                        <div className={styles.groupControl}>
                            <label htmlFor="email">Email address</label>
                            <input type="email" id={styles.email} name="email" key="email" placeholder='Email address'
                                onChange={(e) => setEmail(e.target.value)}/>
                            <span className={styles.envelopeIcon}>
                                <FontAwesomeIcon icon={faEnvelope} />   
                            </span>
                        </div>

                        <div className={styles.groupControl}>
                            <label htmlFor="password">Password</label>
                            <input type="password" id={styles.password} name="password" key="password" placeholder='Password' 
                                onChange={(e) => setPassword(e.target.value)}/>
                            <span className={styles.lockIcon}>
                                <span className="material-symbols-outlined">lock</span>
                            </span>
                        </div>

                        <button type="submit" className={styles.registerBtn}>REGISTER</button>
                        <div className={styles.btnAction}>
                            <a href="/">Return to Store</a>
                            <p>Already have an account? <a href="/login">Sign in</a></p>
                        </div>
                    </form>
                </div>
           </div>

           <div id={styles.dialogContent}>
                <span></span>
                <p className={styles.dialogText}></p>
            </div>
        </div>
    );
};

export default Register