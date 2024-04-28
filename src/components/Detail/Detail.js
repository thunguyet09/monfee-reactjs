import React, { useEffect } from 'react'
import styles from './Detail.module.css'
import { getAllProducts, getDetail } from '../../api';
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
            </div>
        </>
    )
}

export default Detail