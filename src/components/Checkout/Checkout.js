import React, { useEffect } from 'react'
import styles from './Checkout.module.css'
import { getCarts, getDetail } from '../../api'
const Checkout = () => {
    useEffect(() => {
        let isMounted = true;
        const products_info = document.querySelector(`.${styles.products_info}`)
        const userId = localStorage.getItem('userId')
        const getAPI = async () => {
            const carts = await getCarts()
            if(isMounted){
                const filteredCarts = carts.filter(((item) => item.user_id == userId))
                showProducts(filteredCarts)
                calc_total(filteredCarts)
            }
        }

        const showProducts = (data) => {
            data.forEach(async (item) => {
                const detail = await getDetail(item.prod_id)
                const product_frame = document.createElement('div')
                product_frame.className = styles.product_frame
                products_info.appendChild(product_frame)
                const img_box = document.createElement('div')
                img_box.className = styles.img_box
                product_frame.appendChild(img_box)
                const img = document.createElement('img')
                img.src = `../../img/${item.img_url}`
                img.width = 70
                img_box.appendChild(img)
                const quantity = document.createElement('button')
                quantity.className = styles.quantity
                quantity.textContent = item.quantity
                img_box.appendChild(quantity)
                const product_item = document.createElement('div')
                product_item.className = styles.product_item
                product_frame.appendChild(product_item)
                const product_item_col1 = document.createElement('div')
                product_item_col1.className = styles.product_item_col1
                product_item.appendChild(product_item_col1)
                const name = document.createElement('h4')
                name.textContent = detail.name
                product_item_col1.appendChild(name)
                const prod_attribute = document.createElement('span')
                prod_attribute.className = styles.prod_attribute
                product_item_col1.appendChild(prod_attribute)

                if(item.color){
                    prod_attribute.innerHTML = `${item.size} / ${item.color}`
                }else{
                    prod_attribute.innerHTML = `${item.size}`
                }
                const product_item_col2 = document.createElement('div')
                product_item_col2.className = styles.product_item_col2
                product_item.appendChild(product_item_col2)
                let itemSubtotal = item.quantity * item.price 
                product_item_col2.innerHTML = `${itemSubtotal.toLocaleString()}&#8363;`
            })
        }

        let subtotal = 0;
        const calc_total = (data) => {
            const shipping = document.createElement('div')
            shipping.className = styles.shipping_box
            shipping.innerHTML = `
                <h3>Shipping</h3>
                <h3>FREE</h3>
            `
            products_info.appendChild(shipping)

            data.forEach((item) => {
                let itemSubtotal = item.quantity * item.price 
                subtotal += itemSubtotal
            })
            const subtotalDiv = document.createElement('div')
            subtotalDiv.className = styles.subtotalDiv
            subtotalDiv.innerHTML = `
                <h3>Subtotal</h3>
                <h3>${subtotal.toLocaleString()}&#8363;</h3>
            `
            products_info.appendChild(subtotalDiv)
        }

        getAPI() 
        return () => {
            isMounted = false;
        }
    }, [])
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
                            <h2>Delivery</h2>
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
                            <h3>Shipping method</h3>
                            <div className={styles.standard}>
                                <span>Standard</span>
                                <span>Free</span>
                            </div>
                        </div>
                        <div className={styles.payment}>
                            <h3>Payment</h3>
                            <p>All transactions are secure and encrypted.</p>
                            <div className={styles.cod}>
                                <h3>Thanh toán khi nhận hàng</h3>
                                <img src="../../img/cash.png" width="30px" height="30px" />
                            </div>
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