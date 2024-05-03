import React, { useEffect, useLayoutEffect, useState } from 'react'
import styles from './Cart.module.css'
import { getCarts, getDetail } from '../../api'
const Cart = () => {
    useLayoutEffect(() => {
        const tbody = document.querySelector(`.${styles.page_cart} > table > tbody`)
        const userId = localStorage.getItem('userId')
        let isMounted = true;
        const getAPI = async () => {
            const carts = await getCarts()
           
            if(isMounted){
                const filteredCarts = carts.filter(((item) => item.user_id == userId))
                cartTable(filteredCarts)
            }
        }

        const cartTable = (data) => {
           data.forEach(async (item) => {
            tbody.innerHTML = ''
            const detail = await getDetail(item.prod_id)
            const sizeIndex = detail.sizes.indexOf(item.size)
            const tr = document.createElement('tr')
            tbody.appendChild(tr)
            const product_name = document.createElement('td')
            tr.appendChild(product_name)
            const img = document.createElement('img')
            img.src = `../../img/${item.img_url}`
            img.width = 100
            product_name.appendChild(img)
            const detail_box = document.createElement('div')
            detail_box.className = styles.detail_box
            product_name.appendChild(detail_box)
            const name = document.createElement('h3')
            name.textContent = detail.name
            detail_box.appendChild(name)
            const attribute = document.createElement('span')
            detail_box.appendChild(attribute)
            if(item.color){
                attribute.innerHTML = `${item.size} / ${item.color}`
            }else{
                attribute.innerHTML = `${item.size}`
            }
            const price = document.createElement('td')
            tr.appendChild(price)
            let subtotal = 0
            if(detail.promo_price && sizeIndex == 0){
                price.innerHTML = `${detail.promo_price.toLocaleString()}&#8363;`
                subtotal += item.quantity * detail.promo_price
            }else{
                price.innerHTML = `${detail.price[sizeIndex].toLocaleString()}&#8363;`
                subtotal += item.quantity * detail.price[sizeIndex]
            }

            const quantity = document.createElement('td')
            quantity.textContent = item.quantity
            tr.appendChild(quantity)
            let total_num = 0;
            total_num += subtotal
            const total = document.createElement('td')
            total.innerHTML = `${total_num.toLocaleString()}&#8363;`
            tr.appendChild(total)
            const removeItem = document.createElement('td')
            removeItem.innerHTML = `<span class="material-symbols-outlined">close</span>`
            tr.appendChild(removeItem)
           })
        }

        getAPI()
        return () => {
            isMounted = false;
        }
    }, [])
    return (
        <>
            <div id={styles.cart}>
                <div className={styles.cart}>
                    <div className={styles.cart_title}>
                        <img src="../../img/cart_bg.webp"/>
                        <div className={styles.breadcrumb}>
                            <h1>Cart</h1>
                            <div>
                                <a>Home</a>
                                <span class="material-symbols-outlined">
                                    chevron_right
                                </span>
                                <a>Your Shopping Cart</a>
                            </div>
                        </div>
                    </div>
                    <div className={styles.page_cart}>
                        <table>
                            <thead>
                                <tr>
                                    <th>PRODUCT NAME</th>
                                    <th>PRICE</th>
                                    <th>QUANTITY</th>
                                    <th>TOTAL</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart