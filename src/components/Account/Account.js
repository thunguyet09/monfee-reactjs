import React, { useEffect } from 'react'
import account from './Account.module.css'
import { faUserCircle,faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Account = () => {
    useEffect(() => {
    }, [])

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
                                <p>Tài Khoản Của Tôi</p>
                                <div className={account.sub_list}>
                                    <p>Hồ Sơ</p>
                                    <p>Đổi Mật Khẩu</p>
                                </div>
                            </div>
                        </div>
                        <div className={account.bills}>
                            <div className={account.clipboardList}>
                                <FontAwesomeIcon
                                    icon={faClipboardList}
                                />
                            </div>
                            <p onClick={() => navigateToOrderHistory()}>Đơn Mua</p>
                        </div>
                    </div>
                    <div className={account.accountBox}>
                        <div className={account.account_title}>
                            <h3>Hồ Sơ Của Tôi</h3>
                            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                        </div>
                        <div className={account.account_row}>
                            <div className={account.infos}>
                                <div className={account.group_control}>
                                    <label>Tên</label>
                                    <div>
                                        <input type="text" id={account.full_name} />
                                    </div>
                                </div>
                                <div className={account.group_control}>
                                    <label>Email</label>
                                    <div>
                                        <span id="email"></span>
                                        <button className={account.change_email}>Thay đổi</button>
                                    </div>
                                </div>
                                <div className={account.group_control}>
                                    <label>Số điện thoại</label>
                                    <div>
                                        <span id="phone"></span>
                                        <button className={account.change_phone}>Thay đổi</button>
                                    </div>
                                </div>
                                <div className={account.group_control}>
                                    <label>Giới tính</label>
                                    <div className={account.gender_box}>
                                        <div>
                                            <input type="checkbox" className={account.gender} value="male" />
                                            <label>Nam</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" className={account.gender} value="female" />
                                            <label>Nữ</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" className={account.gender} value="other" />
                                            <label>Khác</label>
                                        </div>
                                    </div>
                                </div>
                                <div className={account.group_control}>
                                    <label>Địa chỉ</label>
                                    <div>
                                        <input type="text" id={account.address} />
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
                                        <button className={account.chooseImgBtn}>Chọn Ảnh</button>
                                        <input type="file" name="img" className={account.avatarFile} />
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