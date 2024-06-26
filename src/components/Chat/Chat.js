import React, { useEffect, useState, useContext } from 'react';
import chat from './Chat.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { getMyConversations, getUser, getData, getConversation, getMessagesByConversationId, uploadImgMessage, insertMessage, handleUserSearch, createdConversation } from '../../api';
function Chat() {
    const [isMount, setIsMount] = useState(false)
    const [img, setImg] = useState('')
    const [message, setMessage] = useState('')
    const [conversationId, setConversationId] = useState(0)
    const [userId, setUserId] = useState(0)
    const [receiverId, setReceiverId] = useState(0)
    const [darkMode, setDarkMode] = useState('')
    const [choose, setChoose] = useState(false)

    const chatBox_row2 = document.querySelector(`.${chat.chatBox_row2}`)
    const greeting = document.querySelector(`.${chat.greeting}`)
    useEffect(() => {
        setIsMount(true)
        if(isMount){
            if(choose){
                chatBox_row2.style.display = 'block'
                greeting.style.display = 'none'
            }else{
                greeting.style.display = 'block'
                chatBox_row2.style.display = 'none'
            }
            const userId = localStorage.getItem('userId')
            setUserId(userId)
            handleMyAccount(userId)
            getConversationsAPI(userId)
            getModeStatus()
        }
    }, [isMount])
    const handleMyAccount = async(userId) => {
        const user = await getUser(userId.toString())
        const myAccount = document.querySelector(`.${chat.myAccount}`)
        myAccount.innerHTML = `
            <div class="${chat.myAccount_row1}">
                <img src="http://localhost:3000/images/${user.avatar}" />
                <div>
                    <h3>${user.full_name}</h3>
                    <a href="/account">My Account</a>
                </div>
            </div>
            <a class="${chat.return}" href="/">
                <span class="material-symbols-outlined">
                chevron_left
                </span>
            </a>
        `
        const avatar_typing = document.querySelector(`.${chat.avatar_typing}`)
        avatar_typing.innerHTML = `
            <img src="http://localhost:3000/images/${user.avatar}" />
        `
    }

    const getConversationsAPI = async(userId) => {
        const conversations = await getMyConversations(userId)
        const conversationsBox = document.querySelector(`.${chat.conversations}`)
        conversationsBox.innerHTML = ''
        const chatBox_row1 = document.querySelector(`.${chat.chatBox_row1}`)
        if(conversations.length < 5) {
            chatBox_row1.style.position = 'absolute'
        }
        conversations.forEach(async (item) => {
            const senderId = item.members.filter((val) => val !== userId)
            if(senderId.length > 0){
                const sender = await getUser(senderId)
                const conversationItem = document.createElement('div')
                conversationItem.className = chat.conversationItem
                conversationsBox.appendChild(conversationItem)
                conversationItem.addEventListener('click', () => {
                    getConversationData(sender._id, userId)
                    chatBox_row2.style.display = 'block'
                    setChoose(true)
                })
                const conversationItem_user = document.createElement('div')
                conversationItem_user.className = chat.conversationItem_user
                conversationItem.appendChild(conversationItem_user)
                conversationItem_user.innerHTML = `
                    ${sender.role == 'Admin' ?
                        `<img src="./img/logo.png" />` : 
                        `<img src="http://localhost:3000/images/${sender.avatar}" />`
                    }
                    <div>
                        <h4>${sender.full_name} ${sender.position ? `(${sender.position})` : ''}</h4>
                        <p>${sender.active == 1 || sender.position == 'Consultant' ? 'Online' + `<button style="background-color: green" class=${chat.online_status}></button>` : 'Offline' + `<button style="background-color: red" class=${chat.offline_status}></button>`}</p>
                    </div>
                `
                const conversationItem_date = document.createElement('div')
                conversationItem_date.className = chat.conversationItem_date
                conversationItem_date.innerHTML = item.date
                conversationItem.appendChild(conversationItem_date)
            }
        })
    }

    const getConversationData = async(receiver_id, senderId) => {
        const receiver = await getUser(receiver_id)
        const conversation = await getConversation(senderId, receiver_id)
        const conversation_id = conversation._id
        setConversationId(conversation_id)
        getReceiverData(receiver_id, conversation_id, senderId)
        const messages = await getMessagesByConversationId(conversation_id)
        const receiverMessages = messages.filter((item) => item.user.id !== senderId)
        const senderMessages = messages.filter((item) => item.user.id == senderId)
        const chatting_container = document.querySelector(`.${chat.chatting_container}`)
        chatting_container.innerHTML = ''
        const chatting_person1 = document.createElement('div')
        chatting_person1.className = chat.chatting_person1
        chatting_container.appendChild(chatting_person1)
        receiverMessages.forEach((res) => {
            const chatting_person1_box = document.createElement('div')
            chatting_person1_box.className = chat.chatting_person1_box
            chatting_person1.appendChild(chatting_person1_box)
            const chatting_person1_img = document.createElement('img')
            chatting_person1_img.src = `http://localhost:3000/images/${res.user.avatar}`
            chatting_person1_box.appendChild(chatting_person1_img)
            const chatting_info_person1 = document.createElement('div')
            chatting_info_person1.className = chat.chatting_info_person1 
            chatting_person1_box.appendChild(chatting_info_person1)
            if(res.img !== '' && res.message !== ''){
                chatting_info_person1.innerHTML = `
                    <div>
                        <img src="http://localhost:3000/images/${res.img}" />
                        <div>${res.message}</div>
                    </div>
                    <p>${res.date}</p>
                `
            }else if(res.img !== '' && res.message == ''){
                chatting_info_person1.innerHTML = `
                    <div>
                        <img src="http://localhost:3000/images/${res.img}" />
                    </div>
                    <p>${res.date}</p>
                `
            }else if(res.img == '' && res.message !== ''){
                chatting_info_person1.innerHTML = `
                    <div>${res.message}</div>
                    <p>${res.date}</p>
                `
            }else{
                chatting_info_person1.innerHTML = `
                    <div>${res.message}</div>
                    <p>${res.date}</p>
                `
            }

            if(res.message == '' && receiver.position == 'Consultant'){
                chatting_info_person1.innerHTML = `
                <div>
                    <h4>Let's start shopping with us!</h4>
                    <p>Don't forget to explore our product catalog with other wonderful products as well. Wish you a happy shopping!</p>
                    <p>Working hours are from 08:00 to 17:30 all week. After this time frame, if you have any questions, just leave your information and the shop will respond immediately when online.</p>
                </div>
                <p>${res.date}</p>
            `
            }
        })
        const chatting_person2 = document.createElement('div')
        chatting_person2.className = chat.chatting_person2
        chatting_container.appendChild(chatting_person2)
        senderMessages.forEach((res) => {
            const chatting_person2_box = document.createElement('div')
            chatting_person2_box.className = chat.chatting_person2_box
            chatting_person2.appendChild(chatting_person2_box)
            const chatting_person2_img = document.createElement('img')
            chatting_person2_img.src = `http://localhost:3000/images/${res.user.avatar}`
            chatting_person2_box.appendChild(chatting_person2_img)
            const chatting_info_person2 = document.createElement('div')
            chatting_info_person2.className = chat.chatting_info_person2
            chatting_person2_box.appendChild(chatting_info_person2)
            if(res.img !== '' && res.message !== ''){
                chatting_info_person2.innerHTML = `
                    <div>
                        <img src="http://localhost:3000/images/${res.img}" />
                        <div>${res.message}</div>
                    </div>
                    <p>${res.date}</p>
                `
            }else if(res.img !== '' && res.message == ''){
                chatting_info_person2.innerHTML = `
                    <div>
                        <img src="http://localhost:3000/images/${res.img}" />
                    </div>
                    <p>${res.date}</p>
                `
            }else{
                chatting_info_person2.innerHTML = `
                    <div>${res.message}</div>
                    <p>${res.date}</p>
                `
            }
        })
    }
    const getReceiverData = async (receiver_id, conversation_id, userId) => {
        setReceiverId(receiver_id)
        const receiver = await getUser(receiver_id)
        const receiver_title = document.querySelector(`.${chat.receiver_title}`)
        receiver_title.innerHTML = ''
        const receiver_title_row1 = document.createElement('div')
        receiver_title_row1.className = chat.receiver_title_row1
        receiver_title.appendChild(receiver_title_row1)
        const receiver_avatar = document.createElement('img')
        receiver_avatar.src = `http://localhost:3000/images/${receiver.avatar}`
        receiver_avatar.width = '60'
        receiver_avatar.height = '60'
        receiver_title_row1.appendChild(receiver_avatar)
        const receiver_info = document.createElement('div')
        receiver_title_row1.appendChild(receiver_info)
        receiver_info.innerHTML = `
            <h3>${receiver.full_name} ${receiver.position ? `(${receiver.position})` : ''}</h3>
            <p>${receiver.role == 'Admin' ? 'Usually replies within a few minutes' :
            receiver.active == 1 ? `Online <button class=${chat.online_status} style="background-color: green"></button>` : `Offline <button class=${chat.offline_status} style="background-color: red"></button>`}</p>
        `
        const title_actions = document.createElement('div')
        title_actions.className = chat.title_actions
        receiver_title.appendChild(title_actions)
        const report = document.createElement('div')
        report.className = chat.report
        report.innerHTML = `<span class="material-symbols-outlined">report</span>`
        title_actions.appendChild(report)
        const more_actions = document.createElement('div')
        more_actions.className = chat.more_actions
        title_actions.appendChild(more_actions)
        const more_actions_icon = document.createElement('span')
        more_actions_icon.innerHTML = `<span class="material-symbols-outlined">more_vert</span>`
        more_actions.appendChild(more_actions_icon)
        const more_actions_dropdown = document.createElement('div')
        more_actions_dropdown.className = chat.more_actions_dropdown
        more_actions.appendChild(more_actions_dropdown)
        more_actions_dropdown.innerHTML = `
            <li>Delete conversation</li>
        `
        let open = false;
        more_actions_icon.addEventListener('click', () => {
            open = !open;
            if(open){
                more_actions_dropdown.style.display = 'block'
            }else{
                more_actions_dropdown.style.display = 'none'
            }
        })

        more_actions_dropdown.childNodes[1].addEventListener('click', () => {
            const deleteConfirmModal = document.querySelector(`.${chat.deleteConversationModal}`)
            deleteConfirmModal.style.display = 'block'
            setConversationId(conversation_id)
            setUserId(userId)
        })
    }

    const handleAvatar = async (e) => {
        const img_container = document.querySelector(`.${chat.img_container}`)
        if(!e.target.files[0]){
            setImg('')
        }else{
            setImg(e.target.files[0].name)
        }
        const formData = new FormData();
        formData.append('img', e.target.files[0]);
        console.log(formData)
        try {
            await uploadImgMessage(formData)
            .then(() => {
                img_container.innerHTML = `
                    <div class=${chat.temporImg}>
                        <img src="http://localhost:3000/images/${e.target.files[0].name}" />
                        <button class=${chat.removeImg}>
                            <span class="material-symbols-outlined">
                                close
                            </span>
                        </button>
                    </div>
                `
            })

            if(img_container.childNodes[1].childNodes[3]){
                img_container.childNodes[1].childNodes[3].addEventListener('click', handleRemoveTemporImg)
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    const handleRemoveTemporImg = () => {
        setImg('')
        const img_container = document.querySelector(`.${chat.img_container}`)
        img_container.innerHTML = ''

    }
    const handleSend = async () => {
        const currentDate = new Date()
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const hours = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const dateWithHours = year + '/' + month + '/' + day + " " + hours + ':' + minutes
        if(message !== ''){
            console.log(conversationId, userId, receiverId, message, dateWithHours, img)
            await insertMessage(conversationId, userId, receiverId, message, dateWithHours, img)
            .then(() => {
                getConversationData(receiverId, userId)
            })
            .then(() => {
                const img_container = document.querySelector(`.${chat.img_container}`)
                const message_input = document.querySelector(`.${chat.message}`)
                img_container.innerHTML = ''
                message_input.value = ''
                setImg('')
                setMessage('')
            })
        }else if (message == '' && img !== ''){
            await insertMessage(conversationId, userId, receiverId, '', dateWithHours, img)
            .then(() => {
                getConversationData(receiverId, userId)
                const img_container = document.querySelector(`.${chat.img_container}`)
                img_container.innerHTML = ''
                setImg('')
                setMessage('')
            })
        }
    }

    const onType = (e) => {
        const target = e.target 
        setMessage(target.value)
    }

    const handleSearchUser = (e) => {
        const target = e.target 
        handleSearchUserValue(target.value)
    }

    const handleSearchUserValue = async(searchVal) => {
        const userId = localStorage.getItem('userId')
        const searchValueBox = document.querySelector(`.${chat.searchValueBox}`)
        searchValueBox.innerHTML = ''
        const currentDate = new Date()
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const date = year + '/' + month + '/' + day 
        const users = await handleUserSearch(searchVal)
        if(!users){
            searchValueBox.style.display = 'none'
        }
        if(users){
            searchValueBox.style.display = 'block'
            users.forEach((item) => {
                const searchItem = document.createElement('div')
                searchValueBox.appendChild(searchItem)
                searchItem.addEventListener('click', async() => {
                   await createdConversation(item._id, userId, date)
                   .then(() => {
                        searchValueBox.innerHTML = ''
                        getReceiverData(item._id)
                        getConversationsAPI(userId)
                        getConversationData(item._id, userId)
                        setChoose(true)
                   })
                })
                const user_img = document.createElement('img')
                user_img.src = `http://localhost:3000/images/${item.avatar}`
                searchItem.appendChild(user_img)
                const user_name = document.createElement('h4')
                user_name.innerHTML = item.full_name
                searchItem.appendChild(user_name)
            })
        }
    }

    const getModeStatus = async() => {
        const chatTheme = await getData('theme/chat')
        setDarkMode(chatTheme.darkMode)
    }

    const handleMode = () => {
        setDarkMode(!darkMode)
    }

    const closeModal = () => {
        const cancelOrderModal = document.querySelector(`.${chat.deleteConversationModal}`)
        cancelOrderModal.style.display = 'none'
    }  
    
    const handleDeleteConversation = async() => {
        await fetch(`http://localhost:3000/conversations/${conversationId}`, {
            method: 'DELETE'
        })
        .then(async() => {
            await fetch(`http://localhost:3000/messages/${conversationId}`, {
                method: 'DELETE'
            })
        })
        .then(() => {
            getConversationsAPI(userId)
            closeModal()
            chatBox_row2.style.display = 'none'
            greeting.style.display = 'block'
        })
    }
  return (
    <>
        <div id={chat.chatBox}>
            <div className={chat.chatBox}>
                <div className={chat.chatBox_row1}>
                    <div className={chat.myAccount}>
                        
                    </div>
                    <div className={chat.search_users}>
                        <input type="text" placeholder="Search.." onChange={(e) => handleSearchUser(e)}/>
                        <span className="material-symbols-outlined">search</span>
                        <div className={chat.searchValueBox}>

                        </div>
                    </div>
                    <h4>Messages</h4>
                    <div className={chat.conversations}>

                    </div>
                </div>

                <div className={chat.greeting}>
                    <h3>Welcome to Monfee!</h3>
                </div>
                <div className={`${chat.chatBox_row2} ${darkMode ? chat.dark_layout : chat.light_layout}` }>
                    <div>
                        <div className={`${chat.modeBtn} ${darkMode ? chat.darkMode : chat.lightMode}`} 
                            onClick={handleMode}>
                            {
                                darkMode ? 
                                <button>
                                    <span className="material-symbols-outlined">dark_mode</span>
                                </button> : 
                                <button>
                                    <span className="material-symbols-outlined">light_mode</span>
                                </button>
                            }
                        </div>
                    </div>
                    <div className={chat.receiver_title}>

                    </div>
                    <div className={chat.chatting_container}>

                    </div>

                    <div className={`${chat.typing} ${darkMode ? chat.dark_layout : chat.light_layout}`}>
                        <div className={chat.img_container}></div> 
                        <div className={`${chat.typing_container} ${darkMode ? chat.dark_typing_container : chat.light_typing_container}`}>
                            <div className={chat.avatar_typing}></div>
                            <div className={chat.typingBox}>
                                <textarea onChange={(e) => onType(e)} className={`${chat.message} ${darkMode ? chat.dark_layout : chat.light_layout} ${darkMode ? chat.dark_text : chat.light_text}` } placeholder='Type something...'/>
                                <div className={chat.actions}>
                                    <div className={`${chat.choose_img} ${darkMode ? chat.dark_text : chat.light_text}`}>
                                        <span className="material-symbols-outlined">photo_library</span>
                                        <input type="file" name="img" onChange={(e) => handleAvatar(e)} className={chat.img_file} />
                                    </div>

                                    <div className={chat.sendBtn} onClick={handleSend}>
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>

        <div id={chat.deleteConversationModal} className={chat.deleteConversationModal}>
            <div className={chat.modal_content}>
                <div className={chat.modal_title}>
                    <h2>Confirm</h2>
                    <span className={chat.closeBtn} onClick={closeModal}>&times;</span>
                </div>
                <div className={chat.delete_confirm}>
                    <p>All chat content will be permanently deleted.</p>
                    <p>Are you sure you want to delete?</p>

                    <div className={chat.btns}>
                        <button className={chat.noBtn} onClick={closeModal}>NO, CANCEL</button>
                        <button className={chat.yesBtn} onClick={handleDeleteConversation}>YES, CONTINUE</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default Chat;