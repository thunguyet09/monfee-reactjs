import React, { useEffect } from 'react'
import styles from './Detail.module.css'
import { getAllProducts, getDetail, getProductsByCategoryId } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
const Detail = () => {
    useEffect(() => {
        const fetchData = async () => {
            const products = await getAllProducts()
            const url = new URL(document.location.href);
            const path = url.pathname.split('/').filter(Boolean);
            const id = parseInt(path[path.length - 1])
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
                const detail = await getDetail(id);
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
                    <p>${prev_prod.promo_price ? prev_prod.promo_price.toLocaleString() : prev_prod.price.toLocaleString()}</p>
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
                    <p>${next_prod.promo_price ? next_prod.promo_price.toLocaleString() : next_prod.price.toLocaleString()}</p>
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
                    if(top.id == id){
                        top_product.innerHTML = 'HOT'
                        top_product.style.backgroundColor = '#e62e05'
                    }
                })
                main_detail.innerHTML = ''
                const sales = document.createElement('div')
                sales.className = styles.sales
                sales.innerHTML = `Lượt bán: ${detail.sales}`
                main_detail.appendChild(sales)
                if(detail.promo_price > 0){
                    const prices = document.createElement('div')
                    prices.className = styles.prices
                    main_detail.appendChild(prices)
                    const price = document.createElement('h3')
                    price.innerHTML = `<del>${detail.price.toLocaleString()}&#8363;</del>`
                    prices.appendChild(price)
                    const promo_price = document.createElement('h2')
                    promo_price.innerHTML = `${detail.promo_price.toLocaleString()}&#8363;`
                    prices.appendChild(promo_price)
                }else{
                    const price = document.createElement('h2')
                    price.className = styles.price
                    price.innerHTML = `${detail.price.toLocaleString()}&#8363;`
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
                detail.sizes.forEach((item) => {
                    const size = document.createElement('button')
                    size.textContent = item
                    size_items.appendChild(size)
                    size.addEventListener('click', () => {
                        size_items.childNodes.forEach((val) => {
                            val.style.backgroundColor = 'white'
                            val.style.color = 'grey'
                        })
                        size.style.backgroundColor = 'black'
                        size.style.color = 'white'
                    })
                })
                const detail_actions = document.createElement('div')
                detail_actions.className = styles.detail_actions
                main_detail.appendChild(detail_actions)
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
                increase.innerHTML = `<span class="material-symbols-outlined">add</span>`
                quantity_btns.appendChild(increase)
                const decrease = document.createElement('button')
                decrease.innerHTML = `<span class="material-symbols-outlined">remove</span>`
                quantity_btns.appendChild(decrease)
                const addToCart = document.createElement('button')
                addToCart.textContent = 'ADD TO CART'
                addToCart.className = styles.addToCart
                detail_actions.appendChild(addToCart)
            
                const buy_now = document.createElement('button')
                buy_now.className = styles.buy_now
                buy_now.textContent = 'BUY IT NOW'
                main_detail.appendChild(buy_now)
                
                const nav_tabs = document.querySelectorAll(`.${styles.nav_tab} > li`);
                const first_nav_tab = document.querySelector(`.${styles.nav_tab} > li:first-child`)
                first_nav_tab.setAttribute('id', styles.nav_tab_after)
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
                    const wishlist = document.createElement('button')
                    wishlist.innerHTML = `<span class="material-symbols-outlined">favorite</span>`
                    relate_funcs.appendChild(wishlist)
                    const quick_view = document.createElement('button')
                    quick_view.innerHTML = `<span class="material-symbols-outlined">search</span>`
                    relate_funcs.appendChild(quick_view)
                    const relate_title = document.createElement('h3')
                    relate_title.className = styles.relate_title
                    relate_title.textContent = item.name
                    relate_item.appendChild(relate_title)
                    if(item.promo_price){
                        const price_box = document.createElement('div')
                        price_box.className = styles.price_box
                        relate_item.appendChild(price_box)
                        const promo_price = document.createElement('h3')
                        promo_price.innerHTML = `${item.promo_price.toLocaleString()}&#8363;`
                        price_box.appendChild(promo_price)
                        const price = document.createElement('h4')
                        price.innerHTML = `<del>${item.price.toLocaleString()}&#8363;</del>`
                        price_box.appendChild(price)
                    }else{
                        const price = document.createElement('h3')
                        price.className = styles.price
                        price.innerHTML = `${item.price.toLocaleString()}&#8363;`
                        relate_item.appendChild(price)
                    }

                    const add_to_cart_box = document.createElement('div')
                    add_to_cart_box.className = styles.add_to_cart_box
                    relate_item.appendChild(add_to_cart_box)
                    const add_to_cart = document.createElement('button')
                    add_to_cart.className = styles.add_to_cart
                    add_to_cart.textContent = 'ADD TO CART'
                    add_to_cart_box.appendChild(add_to_cart)
                })
            } catch (error) {
                console.error("Error fetching detail:", error);
            }
        };



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
                        <li><a>Description</a></li>
                        <li><a>Additional Information</a></li>
                        <li><a>Review</a></li>
                    </div>
                    <div className={styles.tab_container}>
                        <div className={styles.desc_prod}>
                            <div className={styles.row1}>
                                <div className={styles.desc_col1}>
                                    <img src="../../img/des1.webp"/>
                                </div>
                                <div className={styles.desc_col2}>
                                    <h1>Calf-Length Dress In Airy, Textured Cotton Fabric With A Printed Pattern</h1>
                                    <p>Sed hendrerit. Cras risus ipsum, faucibus ut, ullamcorper id, varius estibulum ante ipsum primis in faucibus</p>
                                    <img src="../../img/des2.jpg"/>
                                </div>
                            </div>
                            <div className={styles.desc_info}>
                                <h3>PRODUCT DETAILS</h3>
                                <p>Inspired by traditional blockprinting techniques in India, our own in-house design is the vibrant pattern that every closet needs. That's why we crafted our party standout tiered maxi dress in this royal blue-and-yellow print: It's lightweight, lined and will look great at all your most festive summer events.</p>
                            </div>
                            <div className={styles.img_block}>
                                <img src="../../img/des3.webp"/>
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
        </>
    )
}

export default Detail