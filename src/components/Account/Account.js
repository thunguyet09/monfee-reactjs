import React, { useEffect, useState } from 'react'
import account from './Account.module.css'
import { faUserCircle,faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getUser, updateUser } from '../../api';
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
    useEffect(() => {
        handleUserInfo()
        return() => {
            setIsMounted(false)
        }
    }, [isMounted])

    const handleUserInfo = async () => {
        setIsMounted(true)
        if(isMounted){
            const avatar = document.querySelector(`.${account.avatar}`)
            const userId = localStorage.getItem('userId')
            const userData = await getUser(userId)
            if(userData.gender == 'male'){
                setMale(true)
            }else if(userData.gender == 'female'){
                setFemale(true)
            }else{
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
        const userId = localStorage.getItem('userId')

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
                                    <p>Reset password</p>
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
                                        <input type="text" id={account.address} value={address} onChange={(e) => setAddress(e.target.value) }/>
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