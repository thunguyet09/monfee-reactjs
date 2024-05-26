import React from 'react'
import { useEffect } from 'react'
import styles from './MiniCart.module.css'
import { useMiniCart } from '../../contexts/SearchContext/MiniCartContext'
import { getCarts, getDetail } from '../../api'
const MiniCart = () => {
    const {openMiniCart, setMiniCartOpen} = useMiniCart()
    const userId = localStorage.getItem('userId')
    useEffect(() => {
        const numsInCart = async () => {
            const carts = await getCarts("cart")
            const numsInCart = document.querySelector(`.${styles.mini_cart_counter} > span`)
            const filteredCarts = carts.filter(((item) => item.user_id == userId))
            numsInCart.innerHTML = `${filteredCarts.length}`
            handleMiniCart(filteredCarts)
        }
        const handleMiniCart = async (filteredCarts) => {
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
                mini_content.style.right = '-420px'
                setTimeout(() => {
                    relative.style.display = 'none'
                }, 200)
            })

            const total = document.querySelector(`.${styles.total} > h4`)
            let total_num = 0;
            const product_cart = document.querySelector(`.${styles.product_cart}`)
            product_cart.innerHTML = ''
            filteredCarts.forEach(async (item) => {
                let subtotal = 0;
                const detail = await getDetail(item.prod_id.toString())
                const sizeIndex = detail.sizes.indexOf(item.size)
                const minicart_item = document.createElement('div')
                minicart_item.className = styles.minicart_item
                product_cart.appendChild(minicart_item)
                const cart_img = document.createElement('a')
                cart_img.className = styles.cart_img
                cart_img.href = `/products/${item.prod_id}`
                minicart_item.appendChild(cart_img)
                const img = document.createElement('img')
                img.width = 90
                img.src = `../../img/${detail.img_url[0]}`
                cart_img.appendChild(img)
                const product_mini = document.createElement('div')
                product_mini.className = styles.product_mini
                minicart_item.appendChild(product_mini)
                const product_mini_row1 = document.createElement('div')
                product_mini_row1.className = styles.product_mini_row1
                product_mini.appendChild(product_mini_row1)
                const product_mini_row2 = document.createElement('div')
                product_mini.appendChild(product_mini_row2)
                const removeItem = document.createElement('div')
                removeItem.className = styles.removeItem
                removeItem.innerHTML = `<span class="material-symbols-outlined">delete</span>`
                product_mini_row2.appendChild(removeItem)
                removeItem.addEventListener('click', async () => {
                    await fetch(`http://localhost:3000/cart/${item.id}`, {
                        method: 'DELETE'
                    })
                    .then(() => {
                        numsInCart()
                    })
                })
                const product_name_mini = document.createElement('h4')
                product_name_mini.className = styles.product_name_mini
                product_mini_row1.appendChild(product_name_mini)
                product_name_mini.innerHTML = `<a href="/products/${item.prod_id}">${detail.name}</a>`
                const product_attribute = document.createElement('span')
                product_attribute.className = styles.product_attribute
                product_mini_row1.appendChild(product_attribute)
                if(item.color){
                    product_attribute.innerHTML = `${item.size} / <button style="background-color: ${item.color}; width: 15px;
                    height: 15px; border: none; outline: none; border-radius: 50%"></button>`
                    
                }else{
                    product_attribute.innerHTML = `${item.size}`
                }
                const quantity = document.createElement('p')
                quantity.className = styles.minicart_quantity
                quantity.innerHTML = `QTY: ${item.quantity}`
                product_mini_row1.appendChild(quantity)

                const price = document.createElement('h4')
                price.className = styles.minicart_price
                product_mini_row1.appendChild(price)
                if(detail.promo_price && detail.promo_price[0] > 0){
                    price.innerHTML = `${detail.promo_price[sizeIndex].toLocaleString()}&#8363;`
                    subtotal += item.quantity * detail.promo_price[sizeIndex]
                }else{
                    price.innerHTML = `${detail.price[sizeIndex].toLocaleString()}&#8363;`
                    subtotal += item.quantity * detail.price[sizeIndex]
                }

                total_num += subtotal;
                total.innerHTML = `${total_num.toLocaleString()}&#8363;`
            })
        }

        numsInCart()
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
                            <div className={styles.prod}>
                                <div className={styles.product_cart}>
                                    
                                </div>
                            </div>
                            <div className={styles.subtotal}>
                                <div className={styles.total}>
                                    <h3>Total:</h3>
                                    <h4></h4>
                                </div>
                                <div className={styles.action_checkout}>
                                    <button className={styles.view_cart}><a href="/cart">VIEW CART</a></button>
                                    <button className={styles.checkout}><a href="/checkout">CHECK OUT</a></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MiniCart