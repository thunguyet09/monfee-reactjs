import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faInfoCircle, faLock, faTimesCircle, faUser, faSearch, faHeart, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css'
import { getData } from '../../api';
import Search from '../Search/Search';
import { SearchContext, useSearch } from '../../contexts/SearchContext/SearchContext';
import { useMiniCart } from '../../contexts/SearchContext/MiniCartContext';
const userId = localStorage.getItem('userId')
const numsInCart = async () => {
  const carts = await getData('cart')
  const numsInCart = document.querySelector(`.${styles.numsInCart}`)
  const filteredCarts = carts.filter(((item) => item.user_id == userId))
  numsInCart.innerHTML = `${filteredCarts.length}`
}

export {numsInCart}
const Header = () => {
  const url = new URL(document.location.href);
  const path = url.pathname.split('/').filter(Boolean);
  const value = path[path.length - 1];
  const detail = path[path.length - 2]
  numsInCart()
  const {openMiniCart, setMiniCartOpen} = useMiniCart()
  useEffect(() => {
    const menuItems = document.querySelectorAll(`.${styles.leftHeader} > ul > li > a`)
    const icons = document.querySelectorAll(`.${styles.rightHeader} > span > span`)
    const shoppingIcon = document.querySelector(`.${styles.rightHeader} > span:last-child`)
    const header = document.getElementById(styles.header);
    const handleScroll = () => {
      if (window.scrollY > 66) {
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
        subAvatar.childNodes[5].addEventListener('click', () => {
          localStorage.clear()
          document.location.href = '/'
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
  }, [openMiniCart]);


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
        <img src="../img/monfee-logo.png" width={250} />
      </div>
      <div className={styles.rightHeader}>
        <span>
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