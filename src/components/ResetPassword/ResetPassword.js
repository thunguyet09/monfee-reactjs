import React, { useEffect, useState } from 'react';
import styles from './ResetPassword.module.css'
import { changePassword, comparePassword, getUserByToken, removeExpiredToken, tokenIsExpired } from '../../api';
function ResetPassword() {
    const [matches, setMatches] = useState(false)
    const [currentPassword, setCurrentPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordIsEmpty, setPasswordIsEmpty] = useState(false)
    const [newPasswordIsEmpty, setNewPasswordIsEmpty] = useState(false)
    const [repeatPasswordIsEmpty, setRepeatPasswordIsEmpty] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [isMounted, setMounted] = useState(false)
    const [userId, setUserId] = useState('')
    useEffect(() => {
        setMounted(true)

        setUserId(localStorage.getItem('userId'))
    }, [isMounted])

    const handlePassword = async (e) => {
        const target = e.target
        const password = target.value
        setPassword(password)
        if(target.value == ''){
            setPasswordIsEmpty(true)
            setCurrentPassword(false)
        }else{
            setPasswordIsEmpty(false)
        }
    }

    const handleSubmit = async () => {
        const dialogContent = document.querySelector(`#${styles.dialogContent}`)
        const dialogIcon = document.querySelector(`#${styles.dialogContent} > span`)
        const dialogText = document.querySelector(`.${styles.dialogText}`)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            const user = await getUserByToken(token)
            if (password !== '') {
                try {
                    const res = await comparePassword(user._id, password)
                    if (res) {
                        setCurrentPassword(false)
                        if(newPassword == repeatPassword){
                            const res = await tokenIsExpired(token)
                            if(res.isExpired == true){
                                await removeExpiredToken(userId)
                                .then(() => {
                                    document.location.href = '/'
                                })
                            }else{
                                if(res.isExpired == false){
                                    if(token){
                                        const user = await getUserByToken(token)
                                        if(user.token == token){
                                            const response = await changePassword(userId, newPassword) 
                                            if(response.message == 'Password is changed successfuly'){
                                                await removeExpiredToken(userId)
                                                dialogContent.style.display = 'flex';
                                                dialogContent.style.backgroundColor = '#EE7214';
                                                dialogContent.style.color = 'white';
                                                dialogText.textContent = 'Password has changed successfuly';
                                                dialogIcon.innerHTML = '<span class="material-symbols-outlined">check</span>';
                
                                                setTimeout(() => {
                                                    dialogContent.style.display = 'none';
                                                    dialogContent.style.backgroundColor = '';
                                                    dialogContent.style.color = '';
                                                    dialogText.textContent = '';
                                                    dialogIcon.innerHTML = '';
                                                    document.location.href = '/'
                                                }, 5000);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        setCurrentPassword(true)
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }

        if(newPassword !== repeatPassword){
            setMatches(true)
        }else{
            setMatches(false)
        }
    }

    const handleNewPassword = (e) => {
        const target = e.target
        const password = target.value
        setNewPassword(password)
        if(target.value == ''){
            setNewPasswordIsEmpty(true)
        }else{
            setNewPasswordIsEmpty(false)
        }
    }

    const handleRepeatPassword = (e) => {
        const target = e.target
        const password = target.value
        setRepeatPassword(password)
        if(target.value == ''){
            setRepeatPasswordIsEmpty(true)
            setMatches(false)
        }else{
            setRepeatPasswordIsEmpty(false)
        }
    }
    return (
        <>
            <div id={styles.reset_password}>
                <div className={styles.reset_password}>
                    <form>
                        <div className={styles.logo_web}>
                            <img src="/img/monfee-logo.png" width="200px" />
                        </div>

                        <div className={styles.reset_password_form}>
                            <div className={styles.group_control}>
                                <label>Current Password:</label>
                                <span className={styles.group_input}>
                                    <input type="password" onChange={(e) => handlePassword(e)} />
                                    <span>
                                        <span className="material-symbols-outlined">
                                            visibility_off
                                        </span>
                                    </span>
                                    {
                                        currentPassword ? <div className={styles.err_msg}>The current password is wrong.</div> : ''
                                    }

                                    {
                                        passwordIsEmpty ? <div className={styles.err_msg}>The current password is empty.</div> : ''
                                    }
                                </span>
                            </div>

                            <div className={styles.group_control}>
                                <label>New Password:</label>
                                <span className={styles.group_input}>
                                    <input type="password" onChange={(e) => handleNewPassword(e)}/>
                                    <span>
                                        <span className="material-symbols-outlined">
                                            visibility_off
                                        </span>
                                    </span>
                                    {
                                        newPasswordIsEmpty ? <div className={styles.err_msg}>New password is empty.</div> : ''
                                    }
                                </span>
                            </div>

                            <div className={styles.group_control}>
                                <label>Repeat Password:</label>
                                <span className={styles.group_input}>
                                    <input type="password" onChange={(e) => handleRepeatPassword(e)}/>
                                    <span>
                                        <span className="material-symbols-outlined">
                                            visibility_off
                                        </span>
                                    </span>
                                    {
                                        matches ? <div className={styles.err_msg}>The repeat password does not match the password.</div> : ''
                                    }

{
                                        repeatPasswordIsEmpty ? <div className={styles.err_msg}>The current password is empty.</div> : ''
                                    }
                                </span>
                            </div>
                            <button type="button" className={styles.change_password} onClick={handleSubmit}>Change Password</button>
                        </div>
                    </form>
                </div>
            </div>

            <div id={styles.dialogContent}>
                <span></span>
                <p className={styles.dialogText}></p>
            </div>
        </>
    );
}

export default ResetPassword;