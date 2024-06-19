import React, { useEffect, useState } from 'react'
import account from './Account.module.css'
import { faUserCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getUser, sendResetPasswordLink, triggerEmail, updateUser } from '../../api';
import axios from 'axios';
const Account = () => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState(null)
    const [gender, setGender] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const [male, setMale] = useState(false)
    const [female, setFemale] = useState(false)
    const [other, setOther] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [userId, setUserId] = useState('')
    useEffect(() => {
        handleUserInfo()
        return () => {
            setIsMounted(false)
        }
    }, [isMounted])

    const handleUserInfo = async () => {
        setIsMounted(true)
        if (isMounted) {
            const avatar = document.querySelector(`.${account.avatar}`)
            const userId = localStorage.getItem('userId')
            setUserId(userId)
            const userData = await getUser(userId)
            if (userData.gender == 'male') {
                setMale(true)
            } else if (userData.gender == 'female') {
                setFemale(true)
            } else {
                setOther(true)
            }
            setFullName(userData.full_name)
            setEmail(userData.email)
            setPhone(userData.phone)
            setGender(userData.gender)
            setAddress(userData.address)
            setAvatar(userData.avatar)
            const img = document.createElement('img')
            img.width = '60'
            img.height = '60'
            img.src = `http://localhost:3000/images/${userData.avatar}`
            avatar.appendChild(img)
            const nameBox = document.createElement('div')
            avatar.appendChild(nameBox)
            const fullName = document.createElement('h5')
            fullName.textContent = userData.full_name
            nameBox.appendChild(fullName)
            const edit_profile = document.createElement('button')
            edit_profile.className = account.changeInfoBtn
            edit_profile.innerHTML = `
            <span class="material-symbols-outlined">edit</span> 
            <span>Edit profile</span>`
            nameBox.appendChild(edit_profile)
        }
    }

    const handleAvatar = async (e) => {
        setAvatar(e.target.files[0].name)

        const formData = new FormData();
        formData.append('avatar', e.target.files[0]);
        console.log(formData)
        try {
            const response = await fetch('http://localhost:3000/users/uploadImg', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
            } else {
                console.log(await response.json());
                const currentImg = document.querySelector(`.${account.currentImg}`)
                currentImg.src = `http://localhost:3000/images/${e.target.files[0].name}`
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    const navigateToOrderHistory = () => {
        document.location.href = '/orders'
    }

    const handleSave = async () => {
        const dialogContent = document.querySelector(`#${account.dialogContent}`)
        const dialogIcon = document.querySelector(`#${account.dialogContent} > span`)
        const dialogText = document.querySelector(`.${account.dialogText}`)

        const updateUserInfo = {
            full_name: fullName.trim(),
            gender: gender,
            avatar: avatar,
            address: address
        }
        try {
            await updateUser(userId, updateUserInfo)
            dialogContent.style.display = 'flex';
            dialogContent.style.backgroundColor = '#6B8A47';
            dialogContent.style.color = 'white';
            dialogText.textContent = 'Information has been updated.';
            dialogIcon.innerHTML = '<span class="material-symbols-outlined">check</span>';
            const avatar = document.querySelector(`.${account.avatar}`)
            avatar.innerHTML = ''
            await handleUserInfo()
            setTimeout(() => {
                dialogContent.style.display = 'none';
            }, 2000);
        } catch (error) {
            console.error('Error updating user information:', error);
        }
    }

    const handleGender = (e) => {
        setMale(false)
        setFemale(false)
        setOther(false)
        const checkBoxes = document.querySelectorAll(`.${account.gender_box} > div > input`)
        checkBoxes.forEach((input) => {
            input.checked = false;
        })
        e.target.checked = true;
        setGender(e.target.value)
    }

    const handlePasswordChange = () => {
        const accountRow = document.querySelector(`.${account.account_row}`)
        accountRow.innerHTML = ''
        changePassword()
    }
    const changePassword = async () => {
        const list = document.querySelector(`.${account.sub_list}`)
        const accountRow = document.querySelector(`.${account.account_row}`)
        const list_child = Array.from(list.childNodes)
        list_child.forEach((item) => {
            item.removeAttribute('id');
        });
        const changePasswordNode = list.childNodes[1]
        changePasswordNode.setAttribute('id', `.${account.active_list}`)
        const accountBox = document.createElement('div')
        accountBox.className = account.authenticateBox
        accountRow.appendChild(accountBox)
        accountBox.style.width = '450px'
        accountBox.style.fontFamily = "'Roboto', sans-serif"
        accountBox.style.display = 'flex'
        accountBox.style.justifyContent = 'center'
        accountBox.style.alignItems = 'center'
        accountBox.style.flexDirection = 'column'
        accountBox.style.textAlign = 'center'
        const authenticateImg = document.createElement('img')
        authenticateImg.width = 130
        authenticateImg.src = './img/authenticate.svg'
        accountBox.appendChild(authenticateImg)
        const authenticateText = document.createElement('h4')
        authenticateText.textContent = 'Please check your email for password reset link.'
        authenticateText.style.fontWeight = '400'
        authenticateText.style.fontSize = '17px'
        authenticateText.style.color = 'red'
        authenticateText.style.margin = '30px 0px 30px 0px'
        accountBox.appendChild(authenticateText)
        const authenticateBtn = document.createElement('button')
        authenticateBtn.addEventListener('mouseenter', () => {
            authenticateBtn.style.opacity = '0.8'
            authenticateBtn.style.cursor = 'pointer'
        })
        authenticateBtn.style.display = 'flex'
        authenticateBtn.style.flexDirection = 'row'
        authenticateBtn.style.alignItems = 'center'
        authenticateBtn.style.justifyContent = 'center'
        authenticateBtn.style.gap = '10px'
        authenticateBtn.style.border = 'none'
        authenticateBtn.style.outline = 'none'
        authenticateBtn.style.border = '1px solid rgb(231, 231, 231)'
        authenticateBtn.style.padding = '10px 30px'
        authenticateBtn.style.backgroundColor = 'white'
        authenticateBtn.style.transition = '.2s ease'
        authenticateBtn.innerHTML = `
            <span class="material-symbols-outlined">
                mail
            </span>
            <h4>Send Password Reset Link</h4>
        `
        const authenticateBtn_childText = authenticateBtn.childNodes[3]
        authenticateBtn_childText.style.fontWeight = '600'
        authenticateBtn_childText.style.fontFamily = "'Mulish', sans-serif"
        authenticateBtn_childText.style.fontSize = '15px'
        authenticateBtn_childText.style.margin = '0'
        accountBox.appendChild(authenticateBtn)

        authenticateBtn.addEventListener('click', async () => {
            const info = {
                email: email,
                id: userId
            }

            await sendResetPasswordLink(info)
            .then(() => {
                authenticateBtn.innerHTML = `
                    <span class="material-symbols-outlined">
                        check
                    </span>
                    <h4>Link Sent.</h4>
                `
              authenticateBtn.style.backgroundColor = '#72B42A'
              authenticateBtn.style.color = 'white'
              const authenticateBtn_text = authenticateBtn.childNodes[3] 
              authenticateBtn_text.style.margin = '0'
            })
        })
    }

    const handleEmail = async () => {
        const res = await triggerEmail()
        console.log(res)
    }

    return (
        <>
            <div id={account.account}>
                <div className={account.account}>
                    <div className={account.account_list}>
                        <div className={account.avatar}></div>
                        <div className={account.listBox}>
                            <div className={account.userCicleIcon}><FontAwesomeIcon icon={faUserCircle} /></div>
                            <div>
                                <p>My Account</p>
                                <div className={account.sub_list}>
                                    <p>Profile</p>
                                    <p onClick={handlePasswordChange}>Reset password</p>
                                </div>
                            </div>
                        </div>
                        <div className={account.bills}>
                            <div className={account.clipboardList}>
                                <FontAwesomeIcon
                                    icon={faClipboardList}
                                />
                            </div>
                            <p onClick={() => navigateToOrderHistory()}>Orders</p>
                        </div>
                    </div>
                    <div className={account.accountBox}>
                        <div className={account.account_title}>
                            <h3>My Profile</h3>
                            <p>Profile information management for account security.</p>
                        </div>
                        <div className={account.account_row} >
                            <div className={account.infos}>
                                <div className={account.group_control}>
                                    <label>Full name</label>
                                    <div>
                                        <input type="text" id={account.full_name} onChange={(e) => setFullName(e.target.value)} value={fullName} />
                                    </div>
                                </div>
                                <div className={account.group_control}>
                                    <label>Email</label>
                                    <div className={account.emailBox}>
                                        <span id="email">{email}</span>
                                        <button className={account.change_email}>Thay đổi</button>
                                    </div>
                                </div>
                                <div className={account.group_control}>
                                    <label>Phone number</label>
                                    <div className={account.phoneBox}>
                                        <span id="phone">{phone}</span>
                                        <button className={account.change_phone}>Thay đổi</button>
                                    </div>
                                </div>
                                <div className={account.group_control}>
                                    <label>Gender</label>
                                    <div className={account.gender_box}>
                                        <div>
                                            {
                                                male ?
                                                    <input type="checkbox" className={account.gender} checked value="male" onChange={(e) => [setGender(e.target.value), handleGender(e)]} /> :
                                                    <input type="checkbox" className={account.gender} value="male" onChange={(e) => [setGender(e.target.value), handleGender(e)]} />
                                            }
                                            <label>Male</label>
                                        </div>
                                        <div>
                                            {
                                                female ?
                                                    <input type="checkbox" className={account.gender} checked value="female" onChange={(e) => [setGender(e.target.value), handleGender(e)]} /> :
                                                    <input type="checkbox" className={account.gender} value="female" onChange={(e) => [setGender(e.target.value), handleGender(e)]} />
                                            }
                                            <label>Female</label>
                                        </div>
                                        <div>
                                            {
                                                other ?
                                                    <input type="checkbox" className={account.gender} checked value="other" onChange={(e) => [setGender(e.target.value), handleGender(e)]} /> :
                                                    <input type="checkbox" className={account.gender} value="other" onChange={(e) => [setGender(e.target.value), handleGender(e)]} />
                                            }
                                            <label>Other</label>
                                        </div>
                                    </div>
                                </div>
                                <div className={account.group_control}>
                                    <label>Address</label>
                                    <div>
                                        <input type="text" id={account.address} value={address} onChange={(e) => setAddress(e.target.value)} />
                                    </div>
                                </div>
                                <div className={account.save_info}>
                                    <button onClick={handleSave}>SAVE</button>
                                </div>
                            </div>
                            <div className={account.change_avatar}>
                                <div className={account.change_avatar_box}>
                                    <img className={account.currentImg} />
                                    <div className={account.choose_img}>
                                        <button className={account.chooseImgBtn}>Choose image</button>
                                        <input type="file" name="avatar" onChange={(e) => handleAvatar(e)} className={account.avatarFile} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id={account.dialogContent}>
                    <span></span>
                    <p className={account.dialogText}></p>
                </div>
            </div>
        </>
    )
}

export default Account