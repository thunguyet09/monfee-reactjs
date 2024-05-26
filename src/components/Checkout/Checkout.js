import React, { useEffect } from 'react'
import styles from './Checkout.module.css'
import { getCarts, getDetail, getDetailVoucher, getOrderDetails, getOrders, getUser } from '../../api'
const Checkout = () => {
    useEffect(() => {
        let isMounted = true;
        const products_info = document.querySelector(`.${styles.products_info}`)
        const userId = localStorage.getItem('userId')
        const getAPI = async () => {
            const carts = await getCarts("cart")
            if (isMounted) {
                const filteredCarts = carts.filter(((item) => item.user_id == userId))
                showProducts(filteredCarts)
                calc_total(filteredCarts)
            }
        }

        const showProducts = (data) => {
            data.forEach(async (item) => {
                const detail = await getDetail(item.prod_id.toString())
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

                if (item.color) {
                    prod_attribute.innerHTML = `${item.size} / <button style="background-color: ${item.color}"></button>`
                } else {
                    prod_attribute.innerHTML = `${item.size}`
                }
                const product_item_col2 = document.createElement('div')
                product_item_col2.className = styles.product_item_col2
                product_item.appendChild(product_item_col2)
                const sizeIndex = detail.sizes.indexOf(item.size)
                if (detail.promo_price && detail.promo_price[0] > 0) {
                    let itemSubtotal = item.quantity * detail.promo_price[sizeIndex]
                    product_item_col2.innerHTML = `${itemSubtotal.toLocaleString()}&#8363;`
                } else {
                    let itemSubtotal = item.quantity * detail.price[sizeIndex]
                    product_item_col2.innerHTML = `${itemSubtotal.toLocaleString()}&#8363;`
                }
            })
        }

        const calc_total = async (data) => {
            console.log(data)
            let total_quantity = 0;
            const promises = data.map(async (item) => {
                total_quantity += item.quantity;
                const detail = await getDetail(item.prod_id.toString());
                const sizeIndex = detail.sizes.indexOf(item.size);
                let itemSubtotal = detail.promo_price.length > 0 && detail.promo_price[sizeIndex] > 0
                    ? item.quantity * detail.promo_price[sizeIndex]
                    : item.quantity * detail.price[sizeIndex];
                return itemSubtotal;
            });

            const subtotal = (await Promise.all(promises)).reduce((acc, curr) => acc + curr, 0);
            const subtotalDiv = document.createElement('div')
            subtotalDiv.className = styles.subtotalDiv
            subtotalDiv.innerHTML = `
                <h3>Subtotal</h3>
                <h3>${subtotal.toLocaleString()}&#8363;</h3>
            `
            products_info.appendChild(subtotalDiv)

            const shipping = document.createElement('div')
            shipping.className = styles.shipping_box
            shipping.innerHTML = `
                <h3>Shipping</h3>
                <h3>FREE</h3>
            `
            products_info.appendChild(shipping)
            const full_name = document.querySelector(`.${styles.full_name}`)
            const address = document.querySelector(`.${styles.address}`)
            const city = document.querySelector(`.${styles.city}`)
            const email = document.querySelector(`.${styles.email}`)
            const phone = document.querySelector(`.${styles.phone}`)
            const user = await getUser(userId)
           
            if(user.order_info){

            }
            user.vouchers.forEach(async (voucherItem) => {
                const voucher = await getDetailVoucher(`vouchers/${voucherItem}`)
                const discount_box = document.createElement('div')
                discount_box.className = styles.discount_box
                products_info.appendChild(discount_box)
                const discount_content = document.createElement('div')
                discount_box.appendChild(discount_content)
                discount_content.innerHTML = `
                    <h3>Discount</h3>
                    <button>${voucher.voucher_code}</button>
                `
                let calc_discount = (subtotal * voucher.discount) / 100
                const discount = document.createElement('h3')
                discount.innerHTML = `-${calc_discount.toLocaleString()}&#8363;`
                discount_box.appendChild(discount)

                let calc_total = subtotal - calc_discount
                const total = document.createElement('div')
                total.className = styles.total
                total.innerHTML = `<h3>Total</h3>
                <h3>${calc_total.toLocaleString()}&#8363;</h3>`
                products_info.appendChild(total)

                const order_note = document.createElement('div')
                order_note.className = styles.order_note
                products_info.appendChild(order_note)
                const order_note_text = document.createElement('h3')
                order_note_text.textContent = 'Notes:'
                order_note.appendChild(order_note_text)
                const note_box = document.createElement('textarea')
                note_box.rows = '7'
                note_box.cols = '50'
                order_note.appendChild(note_box)
                const checkout_actions = document.createElement('div')
                checkout_actions.className = styles.checkout_actions
                products_info.appendChild(checkout_actions)
                const back_to_shop = document.createElement('a')
                back_to_shop.className = styles.back_to_shop
                back_to_shop.textContent = 'Back to shop'
                back_to_shop.href = '/shop'
                checkout_actions.appendChild(back_to_shop)
                const place_order = document.createElement('button')
                place_order.className = styles.place_order
                place_order.textContent = 'PLACE AN ORDER'
                checkout_actions.appendChild(place_order)
                const save_user_info = document.querySelector(`.${styles.save_info} > input`)
                const emailed_me = document.querySelector(`.${styles.email_checkbox} > input`)
                const currentDate = new Date()
                const year = currentDate.getFullYear()
                const month = currentDate.getMonth() + 1
                const day = currentDate.getDate()
                const hour = currentDate.getHours()
                const minute = currentDate.getMinutes()
                let formatDate = '';
                if (minute < 10 && hour < 10) {
                    formatDate = year + '-' + month + '-' + day + " " + "0" + hour + ":" + "0" + minute
                } else if (hour < 10) {
                    formatDate = year + '-' + month + '-' + day + " " + "0" + hour + ":" + minute
                } else if (minute < 10) {
                    formatDate = year + '-' + month + '-' + day + " " + hour + ":" + "0" + minute
                } else {
                    formatDate = year + "-" + month + "-" + day + " " + hour + ":" + minute
                }
                const orders = await getOrders('orders')
                const dialog_content = document.querySelector(`#${styles.dialog_content}`)
                const dialog_icon = document.querySelector(`#${styles.dialog_content} > span`)
                const dialog_text = document.querySelector(`.${styles.dialog_text}`)
                let flag = false;
                place_order.addEventListener('click', async () => {
                    if (full_name.value !== '' && address.value !== '' && city.value !== '' && email.value !== '' && phone.value !== '') {
                        flag = true;
                    } else {
                        dialog_text.innerHTML = 'Vui lòng nhập đầy đủ thông tin.'
                        dialog_icon.innerHTML = `<span class="material-symbols-outlined">close</span>`
                        dialog_content.style.display = 'flex'
                        dialog_content.style.backgroundColor = '#C5041B'
                        setTimeout(() => {
                            dialog_content.style.display = 'none'
                        }, 2000)
                    }

                    const order = {
                        date: formatDate,
                        da_tra: 0,
                        discount: calc_discount,
                        user_id: user._id,
                        full_name: full_name.value,
                        email: email.value,
                        phone: phone.value,
                        address: address.value,
                        city: city.value,
                        note: note_box.value,
                        order_id: orders.length > 0 ? orders[orders.length - 1].order_id + 1 : 0,
                        payment_method: 'cod',
                        quantity: total_quantity,
                        status: 0,
                        total: calc_total
                    }

                    if (flag) {
                        await fetch(`http://localhost:3000/orders`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(order)
                        })
                            .then(async () => {
                                data.forEach(async (item) => {
                                    const detail = await getDetail(item.prod_id)
                                    const order_details = await getOrderDetails('order-details')
                                    const order_detail_id = order_details.length > 0 ? order_details[order_details.length - 1].order_detail_id + 1 : 0
                                    const newOrderDetails = {
                                        order_detail_id: order_detail_id,
                                        order_id: order.order_id,
                                        prod_id: item.prod_id,
                                        product_name: detail.name,
                                        img_url: item.img_url,
                                        product_price: item.price,
                                        product_quantity: item.quantity,
                                        size: item.size ? item.size : '',
                                        color: item.color ? item.color : '',
                                        subtotal: item.quantity * item.price
                                    }
                                    await fetch(`http://localhost:3000/order-details`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(newOrderDetails)
                                    })
                                })
                            })
                            .then(() => {
                                handleProductQuantity(order.order_id, data)
                            })
                    }

                    const orderInfo = {
                        full_name: full_name.value,
                        email: email.value,
                        phone: phone.value,
                        address: address.value,
                        city: city.value,
                    }

                    if (save_user_info.checked && flag) {
                        await fetch(`http://localhost:3000/users/order-info/${userId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                order_info: orderInfo
                            })
                        })
                    }

                    if (emailed_me.checked && flag) {
                        await fetch(`http://localhost:3000/users/emailed/${userId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                'emailed': true
                            })
                        })
                    }
                })
            })
        }

        const orderSuccessConfirm = () => {
            const order_successful_modal = document.querySelector(`.${styles.order_successful}`)
            order_successful_modal.style.display = 'block'

            const countdown = document.querySelector(`.${styles.order_countdown}`)
            let currentSeconds = new Date().getSeconds();
            let countdownSeconds = currentSeconds + 15;
            let countdownDate = new Date().getTime() + (countdownSeconds * 1000);
            let x = setInterval(function () {
                let now = new Date().getTime();
                let distance = countdownDate - now;
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);
                countdown.innerHTML = `Website sẽ tự quay về lại trang chủ sau ${seconds}s`
                if (distance < 0) {
                    clearInterval(x);
                    document.location.href = '/'
                }
            }, 1000);
        }

        const handleProductQuantity = async (orderId, carts) => {
            for (let i = 0; i < carts.length; i++) {
                const product = await getDetail(carts[i].prod_id)
                const sizeIndex = product.sizes.indexOf(carts[i].size)
                if (carts[i].prod_id == product.id) {
                    const luotBan = parseInt(product.luot_ban) + parseInt(carts[i].quantity)
                    const quantity = parseInt(product.quantity[sizeIndex]) - parseInt(carts[i].quantity)
                    await fetch(`http://localhost:3000/products/${carts[i].prod_id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ quantity: quantity, luot_ban: luotBan })
                    })
                        .then(async () => {
                            await getDetail(carts[i].prod_id)
                        })
                }
            }
            handleOrderDetails(orderId, carts)
        }

        const handleOrderDetails = async (orderId, carts) => {
            carts.forEach(async (item) => {
                const detail = await getDetail(item.prod_id)
                const order_details = await getOrderDetails('order-details')
                const newOrderDetails = {
                    order_id: orderId,
                    prod_id: item.prod_id,
                    product_name: detail.name,
                    img_url: item.img_url,
                    product_price: item.price,
                    product_quantity: item.quantity,
                    size: item.size ? item.size : '',
                    color: item.color ? item.color : '',
                    subtotal: item.quantity * item.price
                }
                await fetch(`http://localhost:3000/order-details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newOrderDetails)
                })
                .then(() => {
                    orderSuccessConfirm()
                })
            })
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
                    <div className={styles.frame}>
                        <div className={styles.customer_info}>
                            <div className={styles.contact}>
                                <h2>Contact</h2>
                                <div className={styles.group_control}>
                                    <h3>Email</h3>
                                    <input type="email" className={styles.email} />
                                </div>
                                <div className={styles.email_checkbox}>
                                    <input type="checkbox" />
                                    <span>Email me with news and offers</span>
                                </div>
                                <div className={styles.group_control}>
                                    <h3>Phone number</h3>
                                    <input type="number" className={styles.phone} />
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
            </div>

            <>
                <div id={styles.dialog_content}>
                    <span></span>
                    <p className={styles.dialog_text}></p>
                </div>
            </>

            <>
                <div className={styles.order_successful}>
                    <div className={styles.order_successful_content}>
                        <div className={styles.order_successful_box}>
                            <img src="../../img/monfee-logo.png" width="200px" />
                            <div className={styles.bread_crumb}>
                                <a href="/">Home</a>
                                <span>/</span>
                                <a>Checkout</a>
                            </div>
                            <div className={styles.order_icon}>
                                <span className="material-symbols-outlined">
                                    shopping_bag
                                </span>
                                <div className={styles.success_img}>
                                    <img src="../../img/success.png" width="60px" />
                                </div>
                            </div>
                            <div class={styles.modal_content}>
                                <h2>Mua hàng thành công</h2>
                            </div>
                        </div>
                        <div className={styles.main_order_successful}>
                            <h3>Cảm ơn bạn đã mua sắm tại Monfee</h3>
                            <span>Bạn đã đặt hàng thành công. Để kiểm tra tất cả chi tiết về đơn hàng,
                                vui lòng chọn "Theo dõi đơn hàng của bạn" hoặc tiếp tục khám phá thêm
                                nhiều sản phẩm khác.
                            </span>
                            <div className={styles.order_countdown}></div>
                        </div>
                        <div className={styles.order_successful_actions}>
                            <div>
                                <button className={styles.order_tracking}>THEO DÕI ĐƠN HÀNG</button>
                            </div>
                            <a href="/shop">
                                <button className={styles.continue_shopping}>TIẾP TỤC MUA SẮM</button>
                            </a>
                        </div>
                    </div>
                </div>
            </>
        </>
    )
}

export default Checkout