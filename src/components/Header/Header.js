import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faHeart, faUserCheck, faBell, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css'
import { automatedMessage, getData, getUser, handleLogout } from '../../api';
import { useSearch } from '../../contexts/SearchContext';
import { useMiniCart } from '../../contexts/MiniCartContext';
const userId = localStorage.getItem('userId')
const numsInCart = async () => {
  const carts = await getData('cart')
  const numsInCart = document.querySelector(`.${styles.numsInCart}`)
  const filteredCarts = carts.filter(((item) => item.user_id == userId))
  numsInCart.innerHTML = `${filteredCarts.length}`
}
export {numsInCart}
const Header = () => {
  const [isMount, setIsMounting] = useState(false)
  const url = new URL(document.location.href);
  const path = url.pathname.split('/').filter(Boolean);
  const value = path[path.length - 1];
  const detail = path[path.length - 2]
  numsInCart()
  const {openMiniCart, setMiniCartOpen} = useMiniCart()
  let isOpen = false;
  useEffect(() => {
    setIsMounting(true)
    const menuItems = document.querySelectorAll(`.${styles.leftHeader} > ul > li > a`)
    const icons = document.querySelectorAll(`.${styles.rightHeader} > span > span`)
    const shoppingIcon = document.querySelector(`.${styles.rightHeader} > span:last-child`)
    const header = document.getElementById(styles.header);
    const notifyItem = document.querySelector(`.${styles.notifyItem}`)
    const handleScroll = () => {
      if (window.scrollY > 66) {
        notifyItem.style.backgroundColor = 'rgba(0, 0, 0, 0.195)'
        header.style.animation = 'slideDown 2s linear'
        if (value == '') {
          header.style.backgroundColor = 'rgba(26, 26, 26, 0.9)'
        } else {
          header.style.backgroundColor = 'white'
        }
        header.style.position = 'fixed'
        if(openMiniCart == true){
          header.style.zIndex = -3
        }else{
          header.style.zIndex = -2
        }
        header.style.top = 0
        header.style.left = 0
        header.style.right = 0
        header.style.boxShadow = '0 2px 5px -2px #0000001a'
        header.style.transition = 'transform .35s cubic-bezier(.46,.01,.32,1), opacity .4s ease-out;'
        menuItems.forEach((node) => {
          node.style.color = 'black'
        })
        icons.forEach((node) => {
          node.style.color = 'black'
        })
        shoppingIcon.style.color = 'black'
      } else {
        if (typeof (value) == 'undefined') {
          header.style.position = 'absolute'
          header.style.backgroundColor = 'rgba(0, 0, 0, 0)'
          menuItems.forEach((node) => {
            node.style.color = 'white'
          })
          icons.forEach((node) => {
            node.style.color = 'white'
          })
          shoppingIcon.style.color = 'white'
        }else if(value == 'shop' || detail){
          header.style.backgroundColor = 'white'
          header.style.position = 'absolute'
        }else {
          header.style.position = 'absolute'
          header.style.backgroundColor = 'rgba(0, 0, 0, 0)'
          menuItems.forEach((node) => {
            node.style.color = 'black'
          })
          icons.forEach((node) => {
            node.style.color = 'black'
          })
          shoppingIcon.style.color = 'black'
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    const handleHeader = async () => {
      shoppingIcon.addEventListener('click', () => {
        setMiniCartOpen(true)
      })

      if (typeof (value) == 'undefined') {
        menuItems.forEach((node) => {
          node.style.color = 'white'
        })
        icons.forEach((node) => {
          node.style.color = 'white'
        })
        shoppingIcon.style.color = 'white'
      }else {
        const notifyItem = document.querySelector(`.${styles.notifyItem}`)
        notifyItem.style.backgroundColor = 'rgba(0, 0, 0, 0.195)'
        menuItems.forEach((node) => {
          node.style.color = 'black'
        })
        icons.forEach((node) => {
          node.style.color = 'black'
        })
        shoppingIcon.style.color = 'black'
      }

      const token = localStorage.getItem('access_token')
      const userChecked = document.querySelector(`.${styles.userChecked}`)
      const userIcon = document.querySelector(`.${styles.user}`)
      const subAvatar = document.querySelector(`.${styles.subAvatar}`)
      if (token) {
        userChecked.style.display = 'block'
        userIcon.style.display = 'none'
        subAvatar.innerHTML = `
          <li><a href="/account">
            <span class="material-symbols-outlined">
                id_card
            </span>
            <p>Account</p>
          </a></li>
          <li class="order"><a>
              <span class="material-symbols-outlined">
                  list_alt
              </span>
              <p>Orders</p>
          </a></li>
          <li class="logout"><a>
              <span class="material-symbols-outlined">
                  logout
              </span>
              <p>Log Out</p>
          </a></li>
        `
        subAvatar.childNodes[5].addEventListener('click', async() => {
          await handleLogout(userId)
          .then(() => {
            localStorage.clear()
            document.location.href = '/'
          })
        })

        subAvatar.childNodes[3].addEventListener('click', () => {
          document.location.href = '/orders'
        })
      } else {
        userChecked.style.display = 'none'
        userIcon.style.display = 'block'
        userIcon.addEventListener('click', () => {
          document.location.href = '/login'
        })
      }
      const user = await getUser(userId)
      const notify_quantity = document.querySelector(`.${styles.notify_quantity}`)
      const notify_container = document.querySelector(`.${styles.notify_container}`)
      const notifyItems = document.querySelector(`.${styles.notifyItem}`)
      const notifyBox = document.querySelector(`.${styles.notifyBox}`)
  
      notifyItems.addEventListener('click', () => {
        isOpen = !isOpen;
        if(isOpen){
          notifyBox.style.display = 'block'
        }else{
          notifyBox.style.display = 'none'
        }
      })

      if(userId && user.notifications.length == 0){
        notify_container.innerHTML = `<p class=${styles.nonNotifications}>You don't have any notifications yet.</p>`
      }
      if(userId && user.notifications.length > 0){
        notify_quantity.innerHTML = `${user.notifications.length}`
        notify_quantity.style.backgroundColor = 'white'
        const notifications = user.notifications.reverse().splice(0,2)
        if(isMount){
          notifications.forEach((item) => {
            const notify_item = document.createElement('div')
            notify_item.className = styles.notify_item
            notify_item.innerHTML = `
              <div>
                <span>${item.content}</span>
                <p>${item.date}</p>
              </div>
            `
            notify_container.appendChild(notify_item)
          })
        }
      }

    }

    const detail_page = () => {
      if(openMiniCart == true){
        header.style.zIndex = -3
      }else{
        header.style.zIndex = -2
      }
      if(detail){
        menuItems.forEach((node) => {
          node.style.color = 'black'
        })
        icons.forEach((node) => {
          node.style.color = 'black'
        })
        shoppingIcon.style.color = 'black'
      }
    }
 
    detail_page()
    handleHeader()
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [openMiniCart, isMount]);


  const { open, setSearchOpen } = useSearch()

  useEffect(() => { 
    const searchItemElement = document.querySelector(`.${styles.searchItem}`);
    const handleClick = () => {
      setSearchOpen(true)
    };
    searchItemElement.addEventListener('click', handleClick);
    return () => {
      searchItemElement.removeEventListener('click', handleClick);
    };
  }, []);

  const handleMessages = async () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours()
    const minutes = currentDate.getMinutes()
    const date = year + '/' + month + '/' + day
    const dateWithHours = year + '/' + month + '/' + day + " " + hours + ':' + minutes
    const consultant = await getData('users/position/consultant')
    const consultantId = consultant._id 
    await automatedMessage(consultantId, userId, '', date, dateWithHours)
    .then(() => {
      document.location.href = '/chat'
    })
  }
  return (
    <>
      <div id={styles.header}>
      <div className={styles.leftHeader}>
        <ul>
          <li><a href="/">HOME</a></li>
          <li><a href="/shop">SHOP</a></li>
          <li><a href="">FEATURED</a></li>
          <li><a href="">PAGES</a></li>
          <li><a href="">BLOGS</a></li>
        </ul>
      </div>
      <div className={styles.logo}>
        <img src="/img/monfee-logo.png" width={250} />
      </div>
      <div className={styles.rightHeader}>
        <span>
          <span className={styles.messages} onClick={handleMessages}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </span>
          <span className={styles.notifyItem}>
            <FontAwesomeIcon icon={faBell} />
            <h5 className={styles.notify_quantity}></h5>
            <div className={styles.notifyBox}>
              <div className={styles.notify_title}>
                <h5>Notifications</h5>
              </div>
              <div className={styles.notify_container}>
                
              </div>
            </div>
          </span>
          <span className={styles.searchItem}>
            <FontAwesomeIcon icon={faSearch} style={{ fontSize: '24px' }} />
          </span>
          <span className={styles.user}>
            <FontAwesomeIcon icon={faUser} style={{ fontSize: '23px' }} />
          </span>
          <span className={styles.userChecked}>
            <FontAwesomeIcon icon={faUserCheck} />
            <ul className={styles.subAvatar}></ul>
          </span>
          <span>
            <FontAwesomeIcon icon={faHeart} style={{ fontSize: '24px' }} />
          </span>
        </span>
        <span className={styles.bag}>
          <span className="material-symbols-outlined">
            shopping_bag
          </span>
          <p className={styles.numsInCart}></p>
        </span>
      </div>
    </div>
    </>
  )
}

export default Header