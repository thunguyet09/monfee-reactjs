import React, { useEffect } from 'react'
import styles from './Detail.module.css'
import { getAllProducts, getDetail, getProductsByCategoryId } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { getCarts } from '../../api';
import { numsInCart } from '../Header/Header';
const Detail = () => {
    useEffect(() => {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        const url = new URL(document.location.href);
        const path = url.pathname.split('/').filter(Boolean);
        const id = parseInt(path[path.length - 1])
        const fetchData = async () => {
            const detail = await getDetail(id);
            const carts = await getCarts()
            const products = await getAllProducts()
            const lastId = products[products.length - 1].id
            let prev_prod;
            if (id == 0) {
                prev_prod = await getDetail(0);
            } else {
                prev_prod = await getDetail(id - 1);
            }
            let next_prod;
            if (id == lastId) {
                next_prod = await getDetail(lastId);
            } else {
                next_prod = await getDetail(id + 1);
            }
            try {
                const product_title = document.querySelector(`.${styles.product_title} > h1`)
                product_title.textContent = detail.name
                const product_name = document.querySelector(`.${styles.product_name}`)
                product_name.textContent = detail.name
                const img_prev = document.querySelector(`.${styles.img_prev}`)
                img_prev.innerHTML = `
                <a href="/products/${prev_prod.id}">
                    <img src="../../img/${prev_prod.img_url[0]}" width="80px">
                </a>
                <div class="${styles.info_prod}">
                    <a href="/products/${prev_prod.id}">${prev_prod.name}</a>
                    <p>${prev_prod.promo_price ? prev_prod.promo_price.toLocaleString() : prev_prod.price[0].toLocaleString()}</p>
                </div>
            `
                const prev_prod_btn = document.querySelector(`.${styles.prev_prod}`)
                prev_prod_btn.addEventListener('mouseenter', () => {
                    img_prev.style.display = 'flex'
                    img_prev.style.animation = `${styles.slideRight} .8s ease`
                })

                prev_prod_btn.addEventListener('mouseleave', () => {
                    img_prev.style.animation = `${styles.slideLeft} .8s ease`
                    setTimeout(() => {
                        img_prev.style.display = 'none'
                    }, 800)
                })

                const img_next = document.querySelector(`.${styles.img_next}`)
                img_next.innerHTML = `
                <a href="/products/${next_prod.id}">
                    <img src="../../img/${next_prod.img_url[0]}" width="80px">
                </a>
                <div class="${styles.info_prod}">
                    <a href="/products/${next_prod.id}">${next_prod.name}</a>
                    <p>${next_prod.promo_price ? next_prod.promo_price.toLocaleString() : next_prod.price[0].toLocaleString()}</p>
                </div>
            `

                const next_prod_btn = document.querySelector(`.${styles.next_prod}`)
                next_prod_btn.addEventListener('mouseenter', () => {
                    img_next.style.display = 'flex'
                    img_next.style.animation = `${styles.slideRight} .8s ease`
                })

                next_prod_btn.addEventListener('mouseleave', () => {
                    img_next.style.animation = `${styles.slideLeft} .8s ease`
                    setTimeout(() => {
                        img_next.style.display = 'none'
                    }, 800)
                })

                const slides = document.querySelector(`.${styles.slides}`)
                const img_featured = document.querySelector(`#${styles.featured}`)
                const imgAfter = document.querySelector(`.${styles.img1}`)
                slides.innerHTML = ''
                detail.img_url.forEach((item) => {
                    const img = document.createElement('img')
                    img.src = `../../img/${item}`
                    img.className = styles.slick_slide
                    slides.appendChild(img)
                    img.addEventListener('click', () => {
                        img_featured.style.transform = 'translateX(-400px)'
                        img_featured.style.transition = '.5s ease'
                        img_featured.style.opacity = '0'
                        img_featured.style.zIndex = '0'
                        imgAfter.src = img.src
                        imgAfter.style.transform = 'translateX(0)'
                        imgAfter.style.zIndex = '9'
                    })
                })
                img_featured.src = `../../img/${detail.img_url[0]}`

                //detail
                const main_detail = document.querySelector(`.${styles.main_detail}`)
                const maxSales = Math.max(...products.map(item => item.sales));
                const topSelling = products.filter(item => item.sales === maxSales);
                const top_product = document.querySelector(`.${styles.top_product}`)
                topSelling.forEach((top) => {
                    if (top.id == id) {
                        top_product.innerHTML = 'HOT'
                        top_product.style.backgroundColor = '#e62e05'
                    }
                })
                main_detail.innerHTML = ''
                const sales = document.createElement('div')
                sales.className = styles.sales
                sales.innerHTML = `Lượt bán: ${detail.sales}`
                main_detail.appendChild(sales)
                if (detail.promo_price > 0) {
                    const prices = document.createElement('div')
                    prices.className = styles.prices
                    main_detail.appendChild(prices)
                    const price = document.createElement('h3')
                    price.innerHTML = `<del>${detail.price[0].toLocaleString()}&#8363;</del>`
                    prices.appendChild(price)
                    const promo_price = document.createElement('h2')
                    promo_price.innerHTML = `${detail.promo_price.toLocaleString()}&#8363;`
                    prices.appendChild(promo_price)
                } else {
                    const price = document.createElement('h2')
                    price.className = styles.price
                    price.innerHTML = `${detail.price[0].toLocaleString()}&#8363;`
                    main_detail.appendChild(price)
                }

                //reviews
                const rating = document.createElement('div')
                rating.className = styles.wrap_rating
                main_detail.appendChild(rating)
                const stars = document.createElement('div')
                stars.innerHTML = `
                <span class="material-symbols-outlined">star</span>
                <span class="material-symbols-outlined">star</span>
                <span class="material-symbols-outlined">star</span>
                <span class="material-symbols-outlined">star</span>
                <span class="material-symbols-outlined">star_half</span>
                `
                rating.appendChild(stars)
                const badge_caption = document.createElement('h5')
                badge_caption.innerHTML = '1 review'
                rating.appendChild(badge_caption)
                const describe = document.createElement('div')
                describe.className = styles.describe
                describe.innerHTML = detail.mo_ta
                main_detail.appendChild(describe)

                const count_down = document.createElement('div')
                count_down.className = styles.count_down
                main_detail.appendChild(count_down)
                const original_quantity = detail.sales + detail.quantity
                const count_down_text = document.createElement('h3')
                count_down_text.innerHTML = `HURRY! ONLY <b>${detail.quantity}</b> LEFT IN STOCK`
                count_down_text.className = styles.count_down_text
                count_down.appendChild(count_down_text)
                const process = document.createElement('input')
                process.type = 'range'
                process.min = 0
                process.max = original_quantity
                process.value = detail.quantity
                process.className = styles.process
                process.disabled = true
                count_down.appendChild(process)

                const size_guide = document.createElement('div')
                size_guide.className = styles.size_guide
                size_guide.innerHTML = `
                    <img src="../../img/size.png" width="21px"/>
                    <h4>Size guide</h4>
                `
                main_detail.appendChild(size_guide)

                let sizeItem = ''
                const size_box = document.createElement('div')
                size_box.className = styles.size_box
                main_detail.appendChild(size_box)
                const size_btn = document.createElement('button')
                size_btn.className = styles.size_btn
                size_btn.textContent = 'SIZE'
                size_box.appendChild(size_btn)
                const size_items = document.createElement('div')
                size_items.className = styles.size_items
                size_box.appendChild(size_items)
                let size_1000g = '';
                detail.sizes.forEach((item) => {
                    const size = document.createElement('button')
                    size.textContent = item
                    size_items.appendChild(size)
                    size.addEventListener('click', () => {
                        if(item = '1000g'){
                            const sizeIndex = detail.sizes.indexOf(size.textContent)
                            size_1000g = detail.price[sizeIndex]
                            if (detail.promo_price > 0) {
                                const price = document.querySelector(`.${styles.prices} > h2`)
                                price.innerHTML = `${size_1000g.toLocaleString()}&#8363;`
                            } else {
                                const price = document.querySelector(`.${styles.price}`)
                                price.innerHTML = `${size_1000g.toLocaleString()}&#8363;`
                            }
                        }else{
                            if (detail.promo_price > 0) {
                                const price = document.querySelector(`.${styles.prices} > h3`)
                                price.innerHTML = `${detail.price[0].toLocaleString()}&#8363;`
                                const promo_price = document.querySelector(`.${styles.prices} > h2`)
                                promo_price.innerHTML = `${detail.promo_price.toLocaleString()}&#8363;`
                            } else {
                                const price = document.querySelector(`.${styles.price}`)
                                price.innerHTML = `${detail.price[0].toLocaleString()}&#8363;`
                            }
                        }
                        size_items.childNodes.forEach((val) => {
                            val.style.backgroundColor = 'white'
                            val.style.color = 'grey'
                        })
                        sizeItem = size.textContent
                        size.style.backgroundColor = 'black'
                        size.style.color = 'white'
                    })
                })
                let colorItem = ''
                if (detail.colors.length > 0) {
                    const color_box = document.createElement('div')
                    color_box.className = styles.color_box
                    main_detail.appendChild(color_box)
                    const color_btn = document.createElement('button')
                    color_btn.className = styles.color_btn
                    color_btn.textContent = 'COLOR'
                    color_box.appendChild(color_btn)
                    const color_items = document.createElement('div')
                    color_items.className = styles.color_items
                    color_box.appendChild(color_items)
                    detail.colors.forEach((val) => {
                        const color_block = document.createElement('div')
                        color_block.className = styles.color_block
                        color_items.appendChild(color_block)
                        color_block.addEventListener('click', () => {
                            color_items.childNodes.forEach((res) => {
                                res.style.border = 'none'
                            })
                            const selectedColorIndex = detail.colors.indexOf(color_block.childNodes[0].value)
                            img_featured.src = `../../img/${detail.img_url[selectedColorIndex]}`
                            colorItem = color_block.childNodes[0].value
                            color_block.style.border = '1px solid rgb(195, 195, 195)'
                        })
                        const color = document.createElement('button')
                        color.value = val
                        color.style.backgroundColor = val
                        color.type = 'button'
                        color_block.appendChild(color)
                    })
                }
                const detail_actions = document.createElement('div')
                detail_actions.className = styles.detail_actions
                main_detail.appendChild(detail_actions)
                let quantityValue = 1;
                const quantity_box = document.createElement('div')
                quantity_box.className = styles.quantity_box
                detail_actions.appendChild(quantity_box)
                const quantity_input = document.createElement('input')
                quantity_input.value = 1
                quantity_box.appendChild(quantity_input)
                const quantity_btns = document.createElement('div')
                quantity_btns.className = styles.quantity_btns
                quantity_box.appendChild(quantity_btns)
                const increase = document.createElement('button')

                increase.addEventListener('click', () => {
                    if (quantity_input.value >= detail.quantity) {
                        quantity_input.value = detail.quantity
                        quantityValue = detail.quantity
                    } else {
                        quantityValue = parseInt(quantity_input.value) + 1;
                        quantity_input.value = quantityValue
                    }
                })
                increase.innerHTML = `<span class="material-symbols-outlined">add</span>`
                quantity_btns.appendChild(increase)
                const decrease = document.createElement('button')
                decrease.addEventListener('click', () => {
                    if (quantity_input.value <= 1) {
                        quantity_input.value = 1;
                        quantityValue = 1;
                    } else {
                        quantityValue = parseInt(quantity_input.value) - 1;
                        quantity_input.value = quantityValue
                    }
                })
                decrease.innerHTML = `<span class="material-symbols-outlined">remove</span>`
                quantity_btns.appendChild(decrease)

                quantity_input.addEventListener('change', (e) => {
                    quantityValue = e.target.value
                })

                const cartModal = document.querySelector(`.${styles.cartModal}`)
                const closeCartModal = document.querySelector(`.${styles.closeCartModal}`)
                closeCartModal.addEventListener('click', () => {
                    localStorage.removeItem('product_id')
                    cartModal.style.display = 'none'
                })
                const addToCart = document.createElement('button')
                addToCart.textContent = 'ADD TO CART'
                addToCart.className = styles.addToCart
                detail_actions.appendChild(addToCart)
                const cartId = carts[carts.length - 1].id + 1
                addToCart.addEventListener('click', async () => {
                    if (token) {
                        const existingCart = carts.filter((res) => res.user_id == userId && res.prod_id == detail.id)
                        if (existingCart.length > 0) {
                            existingCart.forEach(async (val) => {
                                const new_quantity = val.quantity + 1;
                                await fetch(`http://localhost:3000/cart`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ quantity: new_quantity, prod_id: val.prod_id, user_id: userId })
                                })
                                    .then(() => {
                                        localStorage.setItem('product_id', val.prod_id)
                                        setTimeout(() => {
                                            cartModal.style.display = 'block'
                                            handleCartModal()
                                            numsInCart()
                                        }, 2000)
                                    })
                            })
                        } else {
                            if (detail.colors.length > 0) {
                                const cart = {
                                    id: cartId,
                                    prod_id: detail.id,
                                    quantity: quantityValue,
                                    size: sizeItem,
                                    color: colorItem,
                                    user_id: localStorage.getItem('userId')
                                }
                                await fetch(`http://localhost:3000/cart`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(cart)
                                })
                                .then(() => {
                                    localStorage.setItem('product_id', detail.id)
                                    setTimeout(() => {
                                        cartModal.style.display = 'block'
                                        handleCartModal()
                                        numsInCart()
                                    }, 2000)
                                })
                            } else {
                                const cart = {
                                    id: cartId,
                                    prod_id: detail.id,
                                    quantity: quantityValue,
                                    size: sizeItem,
                                    user_id: localStorage.getItem('userId')
                                }
                                await fetch(`http://localhost:3000/cart`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(cart)
                                })
                                .then(() => {
                                    localStorage.setItem('product_id', detail.id)
                                    setTimeout(() => {
                                        cartModal.style.display = 'block'
                                        handleCartModal()
                                        numsInCart()
                                    }, 2000)
                                })
                            }
                        }
                    }
                })
                const buy_now = document.createElement('button')
                buy_now.className = styles.buy_now
                buy_now.textContent = 'BUY IT NOW'
                main_detail.appendChild(buy_now)

                const nav_tabs = document.querySelectorAll(`.${styles.nav_tab} > li`);
                const first_nav_tab = document.querySelector(`.${styles.nav_tab} > li:first-child`)
                first_nav_tab.setAttribute('id', styles.nav_tab_after)
                first_nav_tab.style.borderBottom = '2px solid #b8784e'
                nav_tabs.forEach((item) => {
                    item.addEventListener('mouseenter', () => {
                        item.setAttribute('id', styles.nav_tab_after)
                    });

                    item.addEventListener('mouseleave', () => {
                        item.removeAttribute('id')
                    });
                });

                const related_products_data = await getProductsByCategoryId(detail.cat_id)
                const relate_slider = document.querySelector(`.${styles.relate_slider}`)
                related_products_data.forEach((item) => {
                    const relate_block = document.createElement('div')
                    relate_block.className = styles.relate_block
                    relate_slider.appendChild(relate_block)
                    const relate_item = document.createElement('div')
                    relate_item.addEventListener('mouseenter', () => {
                        relate_item.childNodes[3].style.transform = 'translateY(-50px)'
                    })
                    relate_item.addEventListener('mouseleave', () => {
                        relate_item.childNodes[3].style.transform = 'translateY(0)'
                    })
                    relate_item.className = styles.relate_item
                    relate_block.appendChild(relate_item)
                    const img_box = document.createElement('div')
                    img_box.className = styles.img_box
                    relate_item.appendChild(img_box)
                    img_box.addEventListener('mouseenter', () => {
                        img_box.childNodes[1].style.transform = 'translateY(0)'
                    })
                    img_box.addEventListener('mouseleave', () => {
                        img_box.childNodes[1].style.transform = 'translateY(100px)'
                    })
                    const img = document.createElement('img')
                    img.src = `../../img/${item.img_url[0]}`
                    img.width = 315
                    img_box.appendChild(img)
                    const relate_funcs = document.createElement('div')
                    relate_funcs.className = styles.relate_funcs
                    img_box.appendChild(relate_funcs)
                    const wishlist_box = document.createElement('div')
                    wishlist_box.className = styles.wishlist_box
                    relate_funcs.appendChild(wishlist_box)
                    const wishlist = document.createElement('button')
                    wishlist.innerHTML = `<span class="material-symbols-outlined">favorite</span>`
                    wishlist_box.appendChild(wishlist)
                    const wishlist_tooltip = document.createElement('div')
                    wishlist_tooltip.className = styles.wishlist_tooltip
                    wishlist_tooltip.textContent = 'Add to Wishlist'
                    wishlist_box.appendChild(wishlist_tooltip)
                    const quick_view_box = document.createElement('div')
                    quick_view_box.className = styles.quick_view_box
                    relate_funcs.appendChild(quick_view_box)
                    const quick_view = document.createElement('button')
                    quick_view.innerHTML = `<span class="material-symbols-outlined">search</span>`
                    quick_view_box.appendChild(quick_view)
                    const quickview_tooltip = document.createElement('div')
                    quickview_tooltip.className = styles.quickview_tooltip
                    quickview_tooltip.textContent = 'Quickview'
                    quick_view_box.appendChild(quickview_tooltip)
                    const relate_title = document.createElement('h3')
                    relate_title.className = styles.relate_prod_name
                    relate_title.textContent = item.name
                    relate_item.appendChild(relate_title)
                    if (item.promo_price) {
                        const price_box = document.createElement('div')
                        price_box.className = styles.relate_price_box
                        relate_item.appendChild(price_box)
                        const promo_price = document.createElement('h3')
                        promo_price.innerHTML = `${item.promo_price.toLocaleString()}&#8363;`
                        price_box.appendChild(promo_price)
                        const price = document.createElement('h4')
                        price.innerHTML = `<del>${item.price[0].toLocaleString()}&#8363;</del>`
                        price_box.appendChild(price)
                    } else {
                        const price = document.createElement('h3')
                        price.className = styles.price
                        price.innerHTML = `${item.price[0].toLocaleString()}&#8363;`
                        relate_item.appendChild(price)
                    }

                    const add_to_cart_box = document.createElement('div')
                    add_to_cart_box.className = styles.add_to_cart_box
                    relate_item.appendChild(add_to_cart_box)
                    const add_to_cart = document.createElement('button')
                    add_to_cart.className = styles.add_to_cart
                    add_to_cart.textContent = 'ADD TO CART'
                    add_to_cart_box.appendChild(add_to_cart)
                    const addtocart_tooltip = document.createElement('div')
                    addtocart_tooltip.className = styles.addtocart_tooltip
                    addtocart_tooltip.textContent = 'Add to Cart'
                    add_to_cart_box.appendChild(addtocart_tooltip)

                    const slider_btns = document.querySelector(`.${styles.slider_btns}`)
                    const relate_container = document.querySelector(`.${styles.relate_container}`)
                    slider_btns.innerHTML = ''
                    const slider_num = Math.ceil(related_products_data.length / 5)
                    for (let i = 1; i <= slider_num; i++) {
                        const slider_nav = document.createElement('button')
                        slider_nav.className = styles.slider_nav
                        slider_btns.appendChild(slider_nav)
                        slider_nav.addEventListener('click', () => {
                            if (i == 1) {
                                slider_btns.childNodes.forEach((res) => {
                                    res.style.backgroundColor = 'white'
                                    relate_slider.style.transform = `translateX(0)`
                                })
                                slider_nav.style.backgroundColor = 'rgb(79, 79, 79)'
                            } else {
                                let width = relate_slider.clientWidth - 270
                                slider_btns.childNodes.forEach((res) => {
                                    res.style.backgroundColor = 'white'
                                    relate_slider.style.transform = `translateX(-${width}px)`
                                })
                                slider_nav.style.backgroundColor = 'rgb(79, 79, 79)'
                            }
                        })

                    }


                })
            } catch (error) {
                console.error("Error fetching detail:", error);
            }
        };

        const handleCartModal = async () => {
            const productId = localStorage.getItem('product_id')
            const cart = await getCarts()
            const data = cart.filter((item) => item.prod_id == productId && item.user_id == userId)
            const myCart = cart.filter((item) => item.user_id == userId)
            const product = await getDetail(productId)
            const products_by_categoryId = await getProductsByCategoryId(product.cat_id)
            data.forEach(async (item) => {
                const imgCart = document.querySelector(`.${styles.imgCart}`)
                imgCart.innerHTML = ''
                const cartInfo = document.querySelector(`.${styles.cartInfo}`)
                cartInfo.innerHTML = ''
                const confirm = document.createElement('h2')
                confirm.innerHTML = `
              <span class="material-symbols-outlined">
                done
              </span>
              <span>Added to cart successfully!</span>
              `
                imgCart.appendChild(confirm)
                const img = document.createElement('img')
                img.src = `../../img/${product.img_url[0]}`
                img.width = 200
                imgCart.appendChild(img)
                const product_name = document.createElement('h3')
                product_name.textContent = product.name
                imgCart.appendChild(product_name)
                let sizeIndex = 0;
                cart.forEach((val) => {
                    sizeIndex = product.sizes.indexOf(val.size)
                })
                console.log(sizeIndex)
                if (item.promo_price && sizeIndex == 0) {
                    const price = document.createElement('h4')
                    price.className = styles.cart_price
                    price.innerHTML = `PRICE: <b>${product.promo_price.toLocaleString()}&#8363;</b>`
                    imgCart.appendChild(price)
                } else {
                    const price = document.createElement('h4')
                    price.className = styles.cart_price
                    price.innerHTML = `PRICE: <b>${product.price[sizeIndex].toLocaleString()}&#8363;</b>`
                    imgCart.appendChild(price)
                }

                let total = 0
                for (const res of myCart) {
                    const product = await getDetail(res.prod_id);
                    if(product.sizes.indexOf(res.size) > 0){
                        const sizeIndex = product.sizes.indexOf(res.size)
                        const itemTotal = product.promo_price ? res.quantity * product.promo_price : res.quantity * product.price[sizeIndex];
                        total += itemTotal;
                    }else{
                        const itemTotal = product.promo_price ? res.quantity * product.promo_price : res.quantity * product.price[0];
                        total += itemTotal;
                    }
                }
                const quantity = document.createElement('h4')
                quantity.className = styles.cart_quantity
                quantity.innerHTML = `QTY: <b>${item.quantity}</b>`
                imgCart.appendChild(quantity)

                let cal_subtotal = 0;
                if (item.promo_price && sizeIndex == 0) {
                    cal_subtotal = item.quantity * product.promo_price
                } else {
                    cal_subtotal = item.quantity * product.price[sizeIndex]
                }
                const subtotal = document.createElement('h4')
                subtotal.className = styles.cart_subtotal
                subtotal.innerHTML = `SUBTOTAL: <b>${cal_subtotal.toLocaleString()}&#8363;</b>`
                imgCart.appendChild(subtotal)

                if (myCart.length < 2) {
                    const items_count = document.createElement('p')
                    items_count.className = styles.items_count
                    items_count.innerHTML = `There are <span>${myCart.length}</span> item in your cart`
                    cartInfo.appendChild(items_count)
                } else {
                    const items_count = document.createElement('p')
                    items_count.className = styles.items_count
                    items_count.innerHTML = `There are <span>${myCart.length}</span> items in your cart`
                    cartInfo.appendChild(items_count)
                }
                const cartModal = document.querySelector(`.${styles.cartModal}`)
                const cart_total = document.createElement('p')
                cart_total.className = styles.total_price
                cart_total.innerHTML = `CART TOTALS: <span>${total.toLocaleString()}&#8363;</span>`
                cartInfo.appendChild(cart_total)
                const continue_shopping = document.createElement('button')
                continue_shopping.className = styles.continue_shopping
                continue_shopping.textContent = 'CONTINUE SHOPPING'
                continue_shopping.addEventListener('click', () => {
                    cartModal.style.display = 'none'
                })
                cartInfo.appendChild(continue_shopping)

                const go_to_cart = document.createElement('button')
                go_to_cart.className = styles.go_to_cart
                go_to_cart.textContent = 'GO TO CART'
                cartInfo.appendChild(go_to_cart)
                const cart_condition = document.createElement('div')
                cart_condition.className = styles.cart_condition
                cartInfo.appendChild(cart_condition)
                const condition_checkbox = document.createElement('input')
                condition_checkbox.type = 'checkbox'
                cart_condition.appendChild(condition_checkbox)
                const condition_label = document.createElement('label')
                condition_label.textContent = 'Agree with term and conditional.'
                cart_condition.appendChild(condition_label)

                const checkOutBtn = document.createElement('input')
                checkOutBtn.type = 'button'
                checkOutBtn.value = 'PROCEED TO CHECKOUT'
                checkOutBtn.className = styles.checkOutBtn
                checkOutBtn.disabled = true
                checkOutBtn.style.opacity = 0.7
                cartInfo.appendChild(checkOutBtn)

                condition_checkbox.addEventListener('change', () => {
                    if (condition_checkbox.checked == true) {
                        checkOutBtn.disabled = false;
                        checkOutBtn.style.opacity = 1
                    } else {
                        checkOutBtn.disabled = true;
                        checkOutBtn.style.opacity = 0.7
                    }
                })

                const cartCol2 = document.querySelector(`.${styles.cartCol2}`)
                cartCol2.innerHTML = ''
                const suggested_products = document.createElement('div')
                cartCol2.appendChild(suggested_products)
                const suggested_products_title = document.createElement('div')
                suggested_products_title.className = styles.suggested_products_title
                suggested_products.appendChild(suggested_products_title)
                const also_like_title = document.createElement('h3')
                also_like_title.textContent = 'Suggested products:'
                suggested_products_title.appendChild(also_like_title)
                const also_like_btns = document.createElement('div')
                also_like_btns.className = styles.also_like_btns
                suggested_products_title.appendChild(also_like_btns)
                const prevBtn = document.createElement('button')
                prevBtn.className = styles.also_like_prevBtn
                prevBtn.innerHTML = `<span class="material-symbols-outlined">arrow_back_ios</span>`
                prevBtn.childNodes[0].setAttribute('id', styles.arrow_active)
                also_like_btns.appendChild(prevBtn)
                const nextBtn = document.createElement('button')
                nextBtn.className = styles.also_like_nextBtn
                nextBtn.innerHTML = `<span class="material-symbols-outlined">arrow_forward_ios</span>`
                also_like_btns.appendChild(nextBtn)

                const buttons = document.querySelectorAll(`.${styles.also_like_btns} > button`)
                buttons.forEach((item) => {
                    item.addEventListener('click', () => {
                        buttons.forEach((val) => {
                            val.childNodes[0].removeAttribute('id')
                        })
                        item.childNodes[0].setAttribute('id', styles.arrow_active)
                    })
                })
                const suggected_prod_container = document.createElement('div')
                suggected_prod_container.className = styles.suggected_prod_container
                cartCol2.appendChild(suggected_prod_container)
                products_by_categoryId.forEach((item) => {
                    const suggested_prod_box = document.createElement('div')
                    suggested_prod_box.className = styles.box
                    suggected_prod_container.appendChild(suggested_prod_box)
                    const img = document.createElement('img')
                    img.src = `../../img/${item.img_url[0]}`
                    img.width = 200
                    suggested_prod_box.appendChild(img)
                    const name = document.createElement('h4')
                    name.textContent = item.name
                    suggested_prod_box.appendChild(name)
                    if (item.promo_price) {
                        const price_box = document.createElement('div')
                        price_box.className = styles.price_box
                        suggested_prod_box.appendChild(price_box)
                        const promo_price = document.createElement('h4')
                        promo_price.innerHTML = `${item.promo_price.toLocaleString()}`
                        price_box.appendChild(promo_price)
                        const price = document.createElement('span')
                        price.innerHTML = `<del>${item.price[0].toLocaleString()}</del>`
                        price_box.appendChild(price)

                        const discount = document.createElement('div')
                        discount.className = styles.discount
                        const percent = 100 - Math.floor(((item.promo_price * 100) / item.price[0]))
                        discount.textContent = '-' + percent + '%'
                        suggested_prod_box.appendChild(discount)
                    } else {
                        const price = document.createElement('h3')
                        price.className = styles.suggested_price
                        price.innerHTML = `${item.price[0].toLocaleString()}`
                        suggested_prod_box.appendChild(price)
                    }
                })

                let slideIndex = 0;

                prevBtn.addEventListener('click', () => {
                    if (slideIndex == 0) {
                        slideIndex = 2;
                        const slideWidth = suggected_prod_container.clientWidth;
                        suggected_prod_container.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
                    } else {
                        slideIndex = (slideIndex - 1 + suggected_prod_container.children.length) % suggected_prod_container.children.length;
                        updateSliderPosition();
                    }
                });

                nextBtn.addEventListener('click', () => {
                    slideIndex = (slideIndex + 1) % suggected_prod_container.children.length;

                    if (slideIndex > 2) {
                        slideIndex = 0;
                        suggected_prod_container.style.transform = `translateX(0px)`
                    } else {
                        updateSliderPosition();
                    }
                });
                function updateSliderPosition() {
                    const slideWidth = (suggected_prod_container.clientWidth - 205);
                    suggected_prod_container.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
                }
            })
        }

        const additional_information = async () => {
            const detail = await getDetail(id);
            const tab_container = document.querySelector(`.${styles.tab_container}`)
            const nav_tabs = document.querySelectorAll(`.${styles.nav_tab} > li`)
            const desc_prod = document.querySelector(`.${styles.desc_prod}`)
            const more_info = document.querySelector(`.${styles.more_info}`)
            const more_info_col2 = document.querySelector(`.${styles.more_info_col2}`)
            more_info_col2.innerHTML = `<img src="../../img/${detail.img_url[0]}" />`
            nav_tabs.forEach((item) => {
                item.addEventListener('click', () => {
                    if(item.value == '0'){
                        desc_prod.style.display = 'block'
                        more_info.style.display = 'none'
                    }else if(item.value == '1'){
                       more_info.style.display = 'flex'
                       desc_prod.style.display = 'none'
                    }else {
                        desc_prod.style.display = 'none'
                        more_info.style.display = 'none'
                    }
                    nav_tabs.forEach((val) => {
                        val.removeAttribute('id')
                        val.style.borderBottom = 'none'
                    })
                    item.setAttribute('id', styles.nav_tab_after)
                    item.style.borderBottom = '2px solid #b8784e'
                })
            })
        }

        additional_information()
        handleCartModal()
        fetchData()

        return () => {

        };
    }, []);
    return (
        <>
            <div id={styles.detail}>
                <div className={styles.bread_crumb}>
                    <div className={styles.back_page}>
                        <a href='/'>Home</a>
                        <span class="material-symbols-outlined">
                            navigate_next
                        </span>
                        <strong className={styles.product_name}></strong>
                    </div>
                    <div className={styles.arrows_product}>
                        <div className={styles.prev_prod}>
                            <div className={styles.prev_prod_btn}>
                                <span class="material-symbols-outlined">
                                    arrow_back_ios_new
                                </span>
                                <h4 >PREV</h4>
                            </div>
                            <div className={styles.img_prev}>

                            </div>

                        </div>
                        <div className={styles.next_prod}>
                            <div className={styles.next_prod_btn}>
                                <h4>NEXT</h4>
                                <span class="material-symbols-outlined">
                                    navigate_next
                                </span>
                            </div>
                            <div className={styles.img_next}>

                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.detail_container}>
                    <div className={styles.slide_wrapper}>
                        <div className={styles.slides}>

                        </div>
                        <div className={styles.slider}>
                            <img id={styles.featured} />
                            <img className={styles.img1} />
                        </div>
                    </div>
                    <div className={styles.detail_content}>
                        <div class={styles.product_title}>
                            <h1></h1>
                            <div className={styles.top_product}></div>
                            <span><FontAwesomeIcon icon={faHeart} /></span>
                        </div>
                        <div className={styles.main_detail}>

                        </div>
                    </div>
                    <div className={styles.content_detail}>
                        <div className={styles.content_box}>
                            <div className={styles.content_text}>
                                <h3 className={styles.content_title}>Tại sao chọn chúng tôi ?</h3>
                                <div className={styles.text}>
                                    Sở hữu 20 năm kinh nghiệm trong lĩnh vực đồ uống, chúng tôi tự tin khẳng định uy tín trong lòng khách hàng. Mục tiêu của chúng tôi là mang đến chất lượng tiêu chuẩn và trải nghiệm tuyệt vời cho khách hàng.
                                </div>
                            </div>
                        </div>
                        <div className={styles.content_box}>
                            <div className={styles.content_text}>
                                <h3 className={styles.content_title}>Hoàn trả</h3>
                                <div className={styles.text}>
                                    Hoàn trả sản phẩm trong vòng 100 ngày nếu bạn thay đổi ý định.
                                    Nhận tiền hoàn lại/thay thế sản phẩm khác và miễn phí vận chuyển hoàn trả hàng nếu sản phẩm bị hư hỏng hoặc không như mô tả
                                </div>
                            </div>
                        </div>
                        <div className={styles.content_box}>
                            <div className={styles.content_text}>
                                <h3 className={styles.content_title}>Vận chuyển</h3>
                                <div className={styles.text}>
                                    Giao hàng nhanh chóng, hỗ trợ phí vận chuyển.
                                    Miễn phí vận chuyển cho đơn hàng trong bán kính 3km
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.tab_details}>
                    <div className={styles.nav_tab}>
                        <li value="0"><a>Description</a></li>
                        <li value="1"><a>Additional Information</a></li>
                        <li value="2"><a>Review</a></li>
                    </div>
                    <div className={styles.tab_container}>
                        <div className={styles.desc_prod}>
                            <div className={styles.row1}>
                                <div className={styles.desc_col1}>
                                    <img src="../../img/des1.webp" />
                                </div>
                                <div className={styles.desc_col2}>
                                    <h1>Calf-Length Dress In Airy, Textured Cotton Fabric With A Printed Pattern</h1>
                                    <p>Sed hendrerit. Cras risus ipsum, faucibus ut, ullamcorper id, varius estibulum ante ipsum primis in faucibus</p>
                                    <img src="../../img/des2.jpg" />
                                </div>
                            </div>
                            <div className={styles.desc_info}>
                                <h3>PRODUCT DETAILS</h3>
                                <p>Inspired by traditional blockprinting techniques in India, our own in-house design is the vibrant pattern that every closet needs. That's why we crafted our party standout tiered maxi dress in this royal blue-and-yellow print: It's lightweight, lined and will look great at all your most festive summer events.</p>
                            </div>
                            <div className={styles.img_block}>
                                <img src="../../img/des3.webp" />
                            </div>
                        </div>
                        <div className={styles.more_info}>
                            <div className={styles.more_info_col1}>
                                 <p>MORE INFORMATION TO YOU</p>
                                 <h3>Things You Need To Know</h3>
                                 <div className={styles.row}>
                                    <div className={styles.more_info_content1}>
                                        <p>We use industry standard SSL encryption to protect your details. Potentially sensitive information such as your name, address and card details are encoded so they can only be read on the secure server.</p>
                                        <ul>
                                            <li>Safe Payments</li>
                                            <li>Accept Credit Card</li>
                                            <li>Different Payment Method</li>
                                            <li>Price include VAT</li>
                                            <li>Easy To Order</li>
                                        </ul>
                                    </div>
                                    <div className={styles.more_info_content2}>
                                        <div className={styles.info2}>
                                            <h3>Express Delivery</h3>
                                            <ul>
                                                <li>Europe & USA within 2-4 days</li>
                                                <li>Rest of the world within 3-7 days</li>
                                                <li>Selected locations</li>
                                            </ul>
                                        </div>
                                        <div className={styles.info2}>
                                            <h3>Need More Information</h3>
                                            <ul>
                                                <li>Orders & Shipping</li>
                                                <li>Returns & Refunds</li>
                                                <li>Payments</li>
                                                <li>Your Orders</li>
                                            </ul>
                                        </div>
                                    </div>
                                 </div>
                            </div>
                            <div className={styles.more_info_col2}>
                                 
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.relate_products}>
                    <div className={styles.relate_title}>
                        <h1>Relate Products</h1>
                    </div>
                    <div className={styles.relate_container}>
                        <div className={styles.relate_slider}>

                        </div>
                    </div>
                    <div className={styles.slider_btns}>

                    </div>
                </div>
            </div>

            <>
            <div id={styles.cartModal} className={styles.cartModal}>
              <div className={styles.cartContent}>
                <div className={styles.cartCol1}>
                  <div className={styles.imgCart}>
                  </div>
                  <div className={styles.cartInfo}>
                  </div>
                  <span className={styles.closeCartModal}>&times;</span>
                </div>
                <div className={styles.cartCol2}>

                </div>
              </div>
            </div>
            </>
        </>


    )
}

export default Detail