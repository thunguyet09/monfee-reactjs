import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import styles from './Register.module.css'
function Register() {
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    useEffect(() => {
        const lockIcon = document.querySelector(`.${styles.lockIcon}`)
        const password = document.getElementById(`${styles.password}`)
        console.log(password)
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
                            <input type="text" id={styles.username} name="username" key="username" placeholder='Username'/>
                            <span className={styles.userIcon}>
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                        </div>

                        <div className={styles.groupControl}>
                            <label htmlFor="email">Email address</label>
                            <input type="email" id={styles.email} name="email" key="email" placeholder='Email address'/>
                            <span className={styles.envelopeIcon}>
                                <FontAwesomeIcon icon={faEnvelope} />   
                            </span>
                        </div>

                        <div className={styles.groupControl}>
                            <label htmlFor="password">Password</label>
                            <input type="password" id={styles.password} name="password" key="password" placeholder='Password' />
                            <span className={styles.lockIcon}>
                                <span className="material-symbols-outlined">lock</span>
                            </span>
                        </div>

                        <button type="submit" className={styles.registerBtn}>REGISTER</button>
                    </form>
                </div>
           </div>
        </div>
    );
};

export default Register