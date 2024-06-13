import React, { useEffect, useState } from 'react'
import account from './Account.module.css'
import { faUserCircle,faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getUser } from '../../api';
const Account = () => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState()
    const [gender, setGender] = useState()
    const [address, setAddress] = useState('')
    useEffect(() => {
        let isMounted = true;
        const userId = localStorage.getItem('userId')
        const handleUserInfo = async () => {
            const userData = await getUser(userId)
            if(isMounted){
                setFullName(userData.full_name)
                setEmail(userData.email)
                setPhone(userData.phone)
                setGender(userData.gender)
                setAddress(userData.address)
                const avatar = document.querySelector(`.${account.avatar}`)
                const img = document.createElement('img')
                img.width = '60'
                img.height = '60'
                img.src = `../../img/${userData.avatar}`
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

        handleUserInfo()
        
        return() => {
            isMounted = false;
        }
    }, [])

    const handleAvatar = (e) => {
        const currentImg = document.querySelector(`.${account.currentImg}`)
        currentImg.src = `../../img/${e.target.files[0].name}`
    }

    const navigateToOrderHistory = () => {
        document.location.href = '/orders'
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
                        <div className={account.account_row}>
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
                                            <input type="checkbox" className={account.gender} value="male" onChange={(e) => setGender(e.target.value)} />
                                            <label>Male</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" className={account.gender} value="female" onChange={(e) => setGender(e.target.value)} />
                                            <label>Female</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" className={account.gender} value="other" onChange={(e) => setGender(e.target.value)} />
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
                                    <button>SAVE</button>
                                </div>
                            </div>
                            <div className={account.change_avatar}>
                                <div className={account.change_avatar_box}>
                                    <img className={account.currentImg} />
                                    <div className={account.choose_img}>
                                        <button className={account.chooseImgBtn}>Choose image</button>
                                        <input type="file" name="img" onChange={(e) => handleAvatar(e)} className={account.avatarFile} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Account