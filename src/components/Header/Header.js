import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faInfoCircle, faLock, faTimesCircle, faUser, faSearch, faHeart } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css'
const Header = () => {

  const url = new URL(document.location.href);
  const path = url.pathname.split('/').filter(Boolean);
  const value = path[path.length - 1]; 
  useEffect(() => {
    const menuItems = document.querySelectorAll(`.${styles.leftHeader} > ul > li > a`)
    const icons = document.querySelectorAll(`.${styles.rightHeader} > span > span`)
    const shoppingIcon = document.querySelector(`.${styles.rightHeader} > span:last-child`)
    if(value == 'register'){
      menuItems.forEach((node) => {
        node.style.color = 'black'
      })
      icons.forEach((node) => {
        node.style.color = 'black'
      })
      shoppingIcon.style.color = 'black'
    }else{
      menuItems.forEach((node) => {
        node.style.color = 'white'
      })
      icons.forEach((node) => {
        node.style.color = 'white'
      })
      shoppingIcon.style.color = 'white'
    }
  }, [])
    useEffect(() => {
        const handleScroll = () => {
          const header = document.getElementById(styles.header);
          if (window.scrollY > 66) {
            header.style.animation = 'slideDown 2s linear'
            if(value == 'register'){
              header.style.backgroundColor = 'white'
            }else{
              header.style.backgroundColor = 'rgba(26, 26, 26, 0.9)'
            }
            header.style.position = 'fixed'
            header.style.top = 0
            header.style.left = 0
            header.style.right = 0
            header.style.boxShadow = '0 2px 5px -2px #0000001a'
          }else{
            header.style.position = 'static'
            header.style.backgroundColor = 'rgba(0, 0, 0, 0)'
          }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []); 
  return (
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
            <img src="./img/monfee-logo.png" width={250}/>
        </div>
        <div className={styles.rightHeader}>
            <span>
                <span>
                  <FontAwesomeIcon icon={faSearch} style={{fontSize: '24px'}} />
                </span>
                <span>
                  <FontAwesomeIcon icon={faUser} style={{fontSize: '23px'}} />
                </span>
                <span>
                  <FontAwesomeIcon icon={faHeart} style={{fontSize: '24px'}} />
                </span>
            </span>
            <span className="material-symbols-outlined">
                shopping_bag
            </span> 
        </div>
    </div>
  )
}

export default Header