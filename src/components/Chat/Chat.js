import React, { useEffect, useState } from 'react';
import chat from './Chat.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { getMyConversations, getUser, getData, getConversation, getMessagesByConversationId } from '../../api';
function Chat() {
    const [isMount, setIsMount] = useState(false)
    useEffect(() => {
        setIsMount(true)
        if(isMount){
            const userId = localStorage.getItem('userId')
            handleMyAccount(userId)
            getConversationsAPI(userId)
            getConsultantId(userId)
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
        const chatBox_row1 = document.querySelector(`.${chat.chatBox_row1}`)
        if(conversations.length < 5) {
            chatBox_row1.style.position = 'absolute'
        }
        conversations.forEach(async (item) => {
            const senderId = item.members.filter((val) => val !== userId)
            const sender = await getUser(senderId)
            const conversationItem = document.createElement('div')
            conversationItem.className = chat.conversationItem
            conversationsBox.appendChild(conversationItem)
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
        })
    }

    const getConsultantId = async(userId) => {
        const consultant = await getData('users/position/consultant')
        const consultantId = consultant._id 
        getReceiverData(consultantId)
        getConversationData(consultantId, userId)
    }

    const getConversationData = async(receiverId, senderId) => {
        const conversation = await getConversation(senderId, receiverId)
        const conversationId = conversation._id
        console.log(conversationId)
        const messages = await getMessagesByConversationId(conversationId)
        console.log(messages)
        const receiverMessages = messages.filter((item) => item.user.id !== senderId)
        const senderMessages = messages.filter((item) => item.user.id == senderId)
        const chatting_container = document.querySelector(`.${chat.chatting_container}`)
        const chatting_person1 = document.createElement('div')
        chatting_person1.className = chat.chatting_person1
        receiverMessages.forEach((res) => {
            console.log(res)
            chatting_person1.innerHTML = `
                <img src="http://localhost:3000/images/${res.user.avatar}" />
                <div class=${chat.chatting_info_person1}>
                    <div>${res.message == '' ? `
                        <h4>Let's start shopping with us!</h4>
                        <p>Don't forget to explore our product catalog with other wonderful products as well. Wish you a happy shopping!</p>
                        <p>Working hours are from 08:00 to 17:30 all week. After this time frame, if you have any questions, just leave your information and the shop will respond immediately when online.</p>
                    ` : ''}</div>
                    <p>${res.date}</p>
                </div>
            `
        })
        chatting_container.appendChild(chatting_person1)
        const chatting_person2 = document.createElement('div')
        chatting_person2.className = chat.chatting_person2
        chatting_container.appendChild(chatting_person2)
        senderMessages.forEach((res) => {
            chatting_person2.innerHTML = `
                <img src="http://localhost:3000/images/${res.user.avatar}" />
                <div class=${chat.chatting_info_person2}>
                    <div>${res.message}</div>
                    <p>${res.date}</p>
                </div>
            `
        })

    }
    const getReceiverData = async (receiverId) => {
        const receiver = await getUser(receiverId)
        const receiver_title = document.querySelector(`.${chat.receiver_title}`)
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
        const report = document.createElement('div')
        report.className = chat.report
        report.innerHTML = `<span class="material-symbols-outlined">report</span>`
        receiver_title.appendChild(report)
    }
  return (
    <>
        <div id={chat.chatBox}>
            <div className={chat.chatBox}>
                <div className={chat.chatBox_row1}>
                    <div className={chat.myAccount}>
                        
                    </div>
                    <div></div>
                    <h4>Messages</h4>
                    <div className={chat.conversations}>

                    </div>
                </div>
                <div className={chat.chatBox_row2}>
                    <div className={chat.receiver_title}>

                    </div>
                    <div className={chat.chatting_container}>

                    </div>

                    <div className={chat.typing}>
                        <div className={chat.typing_container}>
                            <div className={chat.avatar_typing}>

                            </div>
                            <div className={chat.typingBox}>
                                <textarea placeholder='Type something...'/>
                                <div className={chat.actions}>
                                    <div className={chat.choose_img}>
                                        <span class="material-symbols-outlined">photo_library</span>
                                        <input type="file" className={chat.img_file} />
                                    </div>

                                    <div className={chat.sendBtn}>
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default Chat;