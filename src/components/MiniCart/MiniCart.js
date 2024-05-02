import React from 'react'
import styles from './MiniCart.module.css'
const MiniCart = () => {
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