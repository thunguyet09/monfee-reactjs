import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import styles from './Login.module.css'
const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = async (e) => {
        const dialogContent = document.querySelector(`#${styles.dialogContent}`)
        const dialogIcon = document.querySelector(`#${styles.dialogContent} > span`)
        const dialogText = document.querySelector(`.${styles.dialogText}`)
        e.preventDefault()
        if(email == '' || password == ''){
            dialogContent.style.backgroundColor = '#B70328'
            dialogContent.style.display = 'flex'
            dialogText.innerHTML = 'Vui lòng nhập đầy đủ thông tin'
            dialogIcon.innerHTML = `<span class="material-symbols-outlined">error</span>`
            setTimeout(() => {
                dialogContent.style.display = 'none'
            }, 2000)
        }else{
            fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        .then(async(res) => {
            if (res.ok) {
                dialogContent.style.display = 'flex';
                dialogContent.style.backgroundColor = '#6B8A47';
                dialogContent.style.color = 'white';
                dialogText.textContent = 'Đăng nhập thành công';
                dialogIcon.innerHTML = '<span class="material-symbols-outlined">check</span>';
                const data = await res.json()
                localStorage.setItem('token', data.token)
                localStorage.setItem('userId', data.user_id)

                setTimeout(() => {
                    dialogContent.style.display = 'none';
                    dialogContent.style.backgroundColor = '';
                    dialogContent.style.color = '';
                    dialogText.textContent = '';
                    dialogIcon.innerHTML = '';
                    if(data.role == 'Thành viên'){
                        document.location.href = '/'
                    }else{
                        document.location.href = '/dashboard'
                    }
                }, 2000);
            } else if (res.status === 404) {
                dialogContent.style.display = 'flex';
                dialogContent.style.backgroundColor = '#C5041B';
                dialogContent.style.color = 'white';
                dialogText.textContent = 'Không tìm thấy người dùng';
                dialogIcon.innerHTML = `<span class="material-symbols-outlined">close</span>`;
            } else if (res.status === 400) {
                dialogContent.style.display = 'flex';
                dialogContent.style.backgroundColor = '#C5041B';
                dialogContent.style.color = 'white';
                dialogText.textContent = 'Mật khẩu không chính xác';
                dialogIcon.innerHTML = `<span class="material-symbols-outlined">close</span>`;
            }else {
                throw new Error('Đăng nhập thất bại');
            }

            setTimeout(() => {
                dialogContent.style.display = 'none';
                dialogContent.style.backgroundColor = '';
                dialogContent.style.color = '';
                dialogText.textContent = '';
                dialogIcon.innerHTML = '';
            }, 4000);
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
        <>
            <div id={styles.register}>
                <div className={styles.register}>
                    <img src="./img/login.png" width="500px" />
                    <div className={styles.registerForm}>
                        <h2>LOGIN</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.groupControl}>
                                <label htmlFor="email">Email address</label>
                                <input type="email" id={styles.email} name="email" key="email" placeholder='Email address'
                                    onChange={(e) => setEmail(e.target.value)} />
                                <span className={styles.envelopeIcon}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                            </div>

                            <div className={styles.groupControl}>
                                <label htmlFor="password">Password</label>
                                <input type="password" id={styles.password} name="password" key="password" placeholder='Password'
                                    onChange={(e) => setPassword(e.target.value)} />
                                <span className={styles.lockIcon}>
                                    <span className="material-symbols-outlined">lock</span>
                                </span>
                            </div>

                            <button type="submit" className={styles.registerBtn}>LOG IN</button>
                            <div className={styles.btnAction}>
                                <a href="/register">Sign Up</a>
                                <p><a>Forgot your password?</a></p>
                            </div>
                        </form>
                    </div>
                </div>

                <div id={styles.dialogContent}>
                    <span></span>
                    <p className={styles.dialogText}></p>
                </div>
            </div>
        </>
    )

}

export default Login