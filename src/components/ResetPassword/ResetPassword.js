import React, { useEffect, useState } from 'react';
import styles from './ResetPassword.module.css'
import { comparePassword, getUserByToken } from '../../api';
function ResetPassword() {
    const [matches, setMatches] = useState(false)
    const [currentPassword, setCurrentPassword] = useState(false)
    useEffect(() => {

    })

    const handlePassword = async (e) => {
        const target = e.target
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            const user = await getUserByToken(token)
            const password = e.target.value

            try {
                const res = await comparePassword(user._id, '123')
                if(res){
                    
                }
              } catch (error) {
                console.error('Error:', error);
              }
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
                                    <input type="password" onInput={(e) => handlePassword(e)} />
                                    <span>
                                        <span className="material-symbols-outlined">
                                            visibility_off
                                        </span>
                                    </span>
                                    {
                                        currentPassword ? <div className={styles.err_msg}>The current password is wrong.</div> : ''
                                    }
                                </span>
                            </div>

                            <div className={styles.group_control}>
                                <label>New Password:</label>
                                <span className={styles.group_input}>
                                    <input type="password" />
                                    <span>
                                        <span className="material-symbols-outlined">
                                            visibility_off
                                        </span>
                                    </span>
                                </span>
                            </div>

                            <div className={styles.group_control}>
                                <label>Repeat Password:</label>
                                <span className={styles.group_input}>
                                    <input type="password" />
                                    <span>
                                        <span className="material-symbols-outlined">
                                            visibility_off
                                        </span>
                                    </span>
                                    {
                                        matches ? <div className={styles.err_msg}>The repeat password does not match the password.</div> : ''
                                    }
                                </span>
                            </div>
                            <button type="submit" className={styles.change_password}>Change Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;