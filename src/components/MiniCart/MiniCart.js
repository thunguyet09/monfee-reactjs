import React from 'react'
import { useEffect } from 'react'
import styles from './MiniCart.module.css'
import { useMiniCart } from '../../contexts/SearchContext/MiniCartContext'
const MiniCart = () => {
    const {openMiniCart, setMiniCartOpen} = useMiniCart()
    useEffect(() => {
        const handleMiniCart = () => {
            const relative = document.querySelector(`.${styles.relative}`)
            const mini_content = document.querySelector(`.${styles.mini_content}`)
            const mini_cart_close = document.querySelector(`.${styles.mini_cart_close}`)
            if(openMiniCart){
                relative.style.display = 'block'
                setTimeout(() => {
                    mini_content.style.right = 0
                }, 100)
            }

            mini_cart_close.addEventListener('click', () => {
                setMiniCartOpen(false)
                mini_content.style.right = '-380px'
                setTimeout(() => {
                    relative.style.display = 'none'
                }, 200)
            })
        }
        handleMiniCart()
        return () => {}
    }, [openMiniCart])
    return (
        <>
            <div id={styles.minicart}>
                <div className={styles.relative}>
                    <div className={styles.mini_content}>
                        <div className={styles.mini_cart_head}>
                            <a className={styles.mini_cart_close}>
                                <span class="material-symbols-outlined">close</span>
                            </a>
                            <h3 className={styles.title}>Shopping Cart</h3>
                            <div className={styles.mini_cart_counter}>
                                <span></span>
                            </div>
                        </div>
                        <div className={styles.mini_cart_bottom}>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MiniCart