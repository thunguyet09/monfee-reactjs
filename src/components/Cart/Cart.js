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

            if (isMounted) {
                const filteredCarts = carts.filter(((item) => item.user_id == userId))
                filteredCarts.forEach(async (item) => {
                    const detail = await getDetail(item.prod_id)
                    const sizeIndex = detail.sizes.indexOf(item.size)
                    let price = detail.promo_price && sizeIndex == 0 ? detail.promo_price : detail.price[sizeIndex]
                    updateQuantity(item.id, item.quantity, price)
                })
                setTimeout(() => {
                    calc_total(filteredCarts)
                }, 200)
            }
        }

        const renderCart = async () => {
            const carts = await getCarts()
            if(isMounted){
                const filteredCarts = carts.filter(((item) => item.user_id == userId))
                cartTable(filteredCarts)
            }
        }
        
        const calc_total = (data) => {
            let total = 0;
            data.forEach((item) => {
                let subtotal = item.quantity * item.price
                total += subtotal
                console.log(total)
            })
        }
        const updateQuantity = async (itemId, quantity, price) => {
            try {
              const response = await fetch(`http://localhost:3000/cart/quantity`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: itemId, quantity: quantity, price: price}),
              });
          
              if (response.ok) {
                console.log('Quantity updated successfully');
              } else {
                console.error('Failed to update quantity');
              }
            } catch (error) {
              console.error('Error occurred while updating quantity', error);
            }
          };
        const cartTable = (data) => {
            let itemSubtotal = 0;
            data.forEach(async (item) => {
                tbody.innerHTML = ''
                const detail = await getDetail(item.prod_id)
                const sizeIndex = detail.sizes.indexOf(item.size)
                const tr = document.createElement('tr')
                tbody.appendChild(tr)
                const product_name = document.createElement('td')
                product_name.className = styles.product_name
                tr.appendChild(product_name)
                const img = document.createElement('img')
                img.src = `../../img/${item.img_url}`
                img.width = 100
                product_name.appendChild(img)
                img.addEventListener('click', () => {
                    document.location.href = `/products/${detail.id}`
                })
                const detail_box = document.createElement('div')
                detail_box.className = styles.detail_box
                product_name.appendChild(detail_box)
                const name = document.createElement('h3')
                name.addEventListener('click', () => {
                    document.location.href = `/products/${detail.id}`
                })
                name.textContent = detail.name
                detail_box.appendChild(name)
                const attribute = document.createElement('span')
                detail_box.appendChild(attribute)
                if (item.color) {
                    attribute.innerHTML = `${item.size} / ${item.color}`
                } else {
                    attribute.innerHTML = `${item.size}`
                }
                const price = document.createElement('td')
                price.className = styles.cart_price
                tr.appendChild(price)

                let quantity_value = item.quantity
                if (detail.promo_price && sizeIndex == 0) {
                    price.innerHTML = `${detail.promo_price.toLocaleString()}&#8363;`
                    itemSubtotal = quantity_value * detail.promo_price
                } else {
                    price.innerHTML = `${detail.price[sizeIndex].toLocaleString()}&#8363;`
                    itemSubtotal = quantity_value * detail.price[sizeIndex]
                }
                const quantity = document.createElement('td')
                quantity.className = styles.quantity
                tr.appendChild(quantity)
                const quantity_box = document.createElement('div')
                quantity_box.className = styles.quantity_box
                quantity.appendChild(quantity_box)
                
                const quantity_input = document.createElement('input')
                quantity_input.value = item.quantity
                quantity_input.addEventListener('change', async () => {
                    quantity_value = parseInt(quantity_input.value);
                    if (isNaN(quantity_value)) {
                        quantity_value = 0;
                    }
                    updateSubtotal();
                    let price = detail.promo_price && sizeIndex == 0 ? detail.promo_price : detail.price[sizeIndex]
                    await fetch('http://localhost:3000/cart/quantity', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: item.id,
                            quantity: quantity_value,
                            price: price
                        })
                    })
                    .then(() => {
                        getAPI()
                    })
                })
                quantity_input.value = item.quantity
                quantity_box.appendChild(quantity_input)
                const quantity_btns = document.createElement('div')
                quantity_btns.className = styles.quantity_btns
                quantity_box.appendChild(quantity_btns)
                const increase = document.createElement('button')

                increase.addEventListener('click', async () => {
                    quantity_input.value++;
                    quantity_value = quantity_input.value
                    updateSubtotal()
                    let price = detail.promo_price && sizeIndex == 0 ? detail.promo_price : detail.price[sizeIndex]
                    await fetch('http://localhost:3000/cart/quantity', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: item.id,
                            quantity: quantity_value,
                            price: price
                        })
                    })
                    .then(() => {
                        getAPI()
                    })
                })
                increase.innerHTML = `<span class="material-symbols-outlined">add</span>`
                increase.className = styles.increase
                quantity_btns.appendChild(increase)
                const decrease = document.createElement('button')
                decrease.addEventListener('click', async () => {
                    quantity_input.value--;
                    quantity_value = quantity_input.value
                    updateSubtotal()
                    let price = detail.promo_price && sizeIndex == 0 ? detail.promo_price : detail.price[sizeIndex]
                    await fetch('http://localhost:3000/cart/quantity', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: item.id,
                            quantity: quantity_value,
                            price: price
                        })
                    })
                    .then(() => {
                        getAPI()
                    })
                })
                decrease.innerHTML = `<span class="material-symbols-outlined">remove</span>`
                decrease.className = styles.decrease
                quantity_btns.appendChild(decrease)
                const subtotal_node = document.createElement('td')
                subtotal_node.className = styles.subtotal
                subtotal_node.innerHTML = `${itemSubtotal.toLocaleString()}&#8363;`
                tr.appendChild(subtotal_node)
                const removeItem = document.createElement('td')
                removeItem.className = styles.removeItem
                removeItem.innerHTML = `<span class="material-symbols-outlined">close</span>`
                tr.appendChild(removeItem)


                const updateSubtotal = () => {
                    if (detail.promo_price && sizeIndex === 0) {
                        itemSubtotal = quantity_value * detail.promo_price;
                    } else {
                        itemSubtotal = quantity_value * detail.price[sizeIndex];
                    }

                    subtotal_node.innerHTML = `${itemSubtotal.toLocaleString()}&#8363;`;
                }
            })
        }

        getAPI()
        renderCart()
        return () => {
            isMounted = false;
        }
    }, [])
    return (
        <>
            <div id={styles.cart}>
                <div className={styles.cart}>
                    <div className={styles.cart_title}>
                        <img src="../../img/cart_bg.webp" />
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
                        <div className={styles.voucher}>
                            <div className={styles.voucher_box}>
                                <input placeholder='VOUCHER CODE' type="text"/>
                                <button className={styles.apply_btn}>APPLY</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart