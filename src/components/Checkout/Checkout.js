import React from 'react'
import styles from './Checkout.module.css'
const Checkout = () => {
    return (
        <>
            <div id={styles.checkout}>
                <div className={styles.checkout_main}>
                    <div className={styles.customer_info}>
                        <div className={styles.contact}>
                            <h2>Contact</h2>
                            <div className={styles.group_control}>
                                <h3>Email</h3>
                                <input type="email" className={styles.email}/>
                            </div>
                            <div className={styles.email_checkbox}>
                                <input type="checkbox"/>
                                <span>Email me with news and offers</span>
                            </div>
                            <div className={styles.group_control}>
                                <h3>Phone number</h3>
                                <input type="number" className={styles.phone}/>
                            </div>
                        </div>  
                        <div className={styles.delivery}>
                            <div className={styles.fullName_box}>
                                <h3>Full name</h3>
                                <input type="text" className={styles.full_name} />
                            </div>
                            <div className={styles.address_box}>
                                <h3>Address</h3>
                                <input type="text" className={styles.address} />
                            </div>
                            <div className={styles.city_box}>
                                <h3>City</h3>
                                <input type="text" className={styles.city} />
                            </div>
                            <div className={styles.save_info}>
                                <input type="checkbox" />
                                <span>Save this information for next time</span>
                            </div>
                        </div>
                        <div className={styles.shipping}>
                            <div className={styles.standard}>
                                <span>Standard</span>
                                <span>Free</span>
                            </div>
                        </div>
                        <div className={styles.payment}>
                            <h3>Payment</h3>
                            <p>All transactions are secure and encrypted</p>
                        </div>
                    </div>
                    <div className={styles.products_info}>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkout