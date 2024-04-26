import React, { useState, useEffect, useRef, useContext } from 'react'
import styles from './Product.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { getAllProducts, product_pagination } from '../../api';

const Product = () => {
    useEffect(() => {
        const slick_track = document.querySelector(`.${styles.slick_track}`);
        const cate_collection = document.querySelector(`.${styles.cate_collection}`)
        const prevBtn = document.querySelector(`.${styles.prevBtn}`);
        const nextBtn = document.querySelector(`.${styles.nextBtn}`);

        const handleMouseEnter = () => {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            prevBtn.style.animation = `${styles.toLeft} 1s ease forwards`;
            nextBtn.style.animation = `${styles.toRight} 1s ease forwards`;
        };

        const handleMouseLeave = () => {
            prevBtn.style.animation = `${styles.backToLeft} 1s ease forwards`;
            nextBtn.style.animation = `${styles.backToRight} 1s ease forwards`;
        };

        cate_collection.addEventListener('mouseenter', handleMouseEnter);
        cate_collection.addEventListener('mouseleave', handleMouseLeave);


        let slideIndex = 0;

        prevBtn.addEventListener('click', () => {
            if (slideIndex == 0) {
                slideIndex = 2;
                const slideWidth = slick_track.clientWidth;
                slick_track.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
            } else {
                slideIndex = (slideIndex - 1 + slick_track.children.length) % slick_track.children.length;
                updateSliderPosition();
            }
        });

        nextBtn.addEventListener('click', () => {
            slideIndex = (slideIndex + 1) % slick_track.children.length;

            if (slideIndex > 2) {
                slideIndex = 0;
                slick_track.style.transform = `translateX(0px)`
            } else {
                updateSliderPosition();
            }
        });

        function updateSliderPosition() {
            const slideWidth = (slick_track.clientWidth - 400);
            slick_track.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
        }

        const change_column = document.querySelector(`.${styles.change_column}`)
        const prod_per = document.querySelector(`.${styles.prod_per}`)
        change_column.addEventListener('mouseenter', () => {
            prod_per.style.opacity = 1
            prod_per.style.visibility = 'visible'
        })

        change_column.addEventListener('mouseleave', () => {
            prod_per.style.opacity = 0
            prod_per.style.visibility = 'hidden'
        })

        const featuredBtn = document.querySelector(`.${styles.featuredBtn}`)
        const dropdown = document.querySelector(`.${styles.dropdown}`)
        const featured_icon = document.querySelector(`.${styles.featuredBtn} > span`)
        let flag = false;
        featuredBtn.addEventListener('click', () => {
            flag = !flag
            if (flag) {
                dropdown.style.opacity = 1
                featured_icon.innerHTML = `<span class="material-symbols-outlined">arrow_drop_up</span>`
            } else {
                dropdown.style.opacity = 0
                dropdown.style.zIndex = -1
                featured_icon.innerHTML = `<span class="material-symbols-outlined">arrow_drop_down</span>`
            }
        })

        return () => {
            slick_track.removeEventListener('mouseenter', handleMouseEnter);
            slick_track.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    useEffect(() => {
        const colors = async () => {
            const products = await getAllProducts()
            const uniqueColors = products.reduce((colorSet, item) => {
                item.colors.forEach(color => colorSet.add(color));
                return colorSet;
            }, new Set())
            const list_color = document.querySelector(`.${styles.list_color}`)
            list_color.innerHTML = ''
            uniqueColors.forEach((item) => {
                const color_item = document.createElement('li')
                list_color.appendChild(color_item)
                const color_item_a = document.createElement('a')
                color_item.appendChild(color_item_a)
                color_item_a.style.backgroundColor = item
                color_item_a.title = item
            })
            const filter_colors = document.querySelector(`.${styles.filter_colors}`)
            filter_colors.innerHTML = ''
            uniqueColors.forEach((item) => {
                const button = document.createElement('button')
                const color_item = document.createElement('input')
                color_item.style.backgroundColor = item
                color_item.type = 'button'
                filter_colors.appendChild(button)
                button.appendChild(color_item)
            })

            const price_list = document.querySelector(`.${styles.list_price}`)
            const filter_price = document.querySelector(`.${styles.filter_price}`)
            filter_price.innerHTML = ''
            price_list.innerHTML = ''
            const minPrice = products.reduce((min, product) => {
                const price = product.price
                return price < min ? price : min;
            }, Infinity);

            const price_list_v1 = document.createElement('li')
            const price_v1 = minPrice + 80000
            price_list_v1.innerHTML = `<a>${minPrice.toLocaleString()} - ${price_v1.toLocaleString()}</a>`
            price_list.appendChild(price_list_v1)
            filter_price.appendChild(price_list_v1)
            const price_list_v2 = document.createElement('li')
            const price_v2 = price_v1 + 80000
            price_list_v2.innerHTML = `<a>${price_v1.toLocaleString()} - ${price_v2.toLocaleString()}</a>`
            price_list.appendChild(price_list_v2)
            filter_price.appendChild(price_list_v2)
            const price_list_v3 = document.createElement('li')
            const price_v3 = price_v2 + 80000
            price_list_v3.innerHTML = `<a>${price_v2.toLocaleString()} - ${price_v3.toLocaleString()}</a>`
            price_list.appendChild(price_list_v3)
            filter_price.appendChild(price_list_v3)
            const price_list_v4 = document.createElement('li')
            const price_v4 = price_v3 + 80000
            price_list_v4.innerHTML = `<a>${price_v3.toLocaleString()} - ${price_v4.toLocaleString()}</a>`
            price_list.appendChild(price_list_v4)
            filter_price.appendChild(price_list_v4)
            const price_list_v5 = document.createElement('li')
            price_list_v5.innerHTML = `<a>Over ${price_v4.toLocaleString()}</a>`
            price_list.appendChild(price_list_v5)
            filter_price.appendChild(price_list_v5)
        }

        const getApi = async () => {
            const data = await product_pagination(1, 12)
            pages(data.totalPages, data.page)
            showProductGrid(data.products)
        }
        const showProductGrid = async (products) => {
            const product_items = document.querySelector(`.${styles.product_grid_parent}`)
            product_items.innerHTML = ''
            const product_item_arr = []
            products.forEach((item) => {
                const row = document.createElement('div')
                row.className = styles.row
                product_items.appendChild(row)
                const img_product = document.createElement('div')
                img_product.className = styles.img_product
                row.appendChild(img_product)
                product_item_arr.push(img_product)
                img_product.addEventListener('mouseenter', () => {
                    product_item_arr.forEach((node) => {
                        node.removeAttribute('id')
                        img_product.childNodes[1].style.display = 'flex'
                        if (row.childNodes[3]) {
                            setTimeout(() => {
                                row.childNodes[3].style.display = 'flex'
                                row.childNodes[3].setAttribute('id', styles.animate_color)
                            }, 900)
                        }
                    })
                    img_product.setAttribute('id', styles.img_product_after)
                })

                img_product.addEventListener('mouseleave', () => {
                    if (row.childNodes[3]) {
                        row.childNodes[3].style.display = 'none'
                    }
                    img_product.childNodes[1].style.display = 'none'
                })
                const img_link = document.createElement('img')
                img_link.width = 280
                img_link.src = `./img/${item.img_url[0]}`
                img_product.appendChild(img_link)
                const product_icon_action = document.createElement('ul')
                product_icon_action.className = styles.product_icon_action
                img_product.appendChild(product_icon_action)
                if (item.colors) {
                    const select_option = document.createElement('button')
                    select_option.className = styles.select_option
                    select_option.innerHTML = `<span class="material-symbols-outlined">more_horiz</span>`
                    product_icon_action.appendChild(select_option)
                } else {
                    const addToCart = document.createElement('button')
                    addToCart.className = styles.addToCart
                    addToCart.innerHTML = `<span class="material-symbols-outlined">local_mall</span>`
                    product_icon_action.appendChild(addToCart)
                }
                const quick_view = document.createElement('button')
                quick_view.innerHTML = `<span class="material-symbols-outlined">search</span>`
                product_icon_action.appendChild(quick_view)

                const wishlist = document.createElement('button')
                wishlist.innerHTML = `<span class="material-symbols-outlined">favorite</span>`
                product_icon_action.appendChild(wishlist)

                const title_product = document.createElement('h4')
                title_product.className = styles.title_product
                title_product.textContent = item.name
                row.appendChild(title_product)
                if (item.promo_price) {
                    const price_box = document.createElement('div')
                    price_box.className = styles.price_box
                    row.appendChild(price_box)
                    const price = document.createElement('h5')
                    price.innerHTML = `<del>${item.price.toLocaleString()}</del>`
                    price_box.appendChild(price)
                    const promo_price = document.createElement('h4')
                    promo_price.textContent = item.promo_price.toLocaleString()
                    price_box.appendChild(promo_price)
                } else {
                    const price = document.createElement('h4')
                    price.className = styles.price_item
                    price.innerHTML = `${item.price.toLocaleString()}`
                    row.appendChild(price)
                }

                if (item.colors.length > 0) {
                    const product_colors = document.createElement('div')
                    product_colors.className = styles.product_colors
                    row.appendChild(product_colors)
                    item.colors.forEach((val) => {
                        const color_btn = document.createElement('button')
                        color_btn.style.backgroundColor = val
                        product_colors.appendChild(color_btn)
                    })
                } else {
                    const product_colors = document.createElement('div')
                    row.appendChild(product_colors)
                }

                if (item.promo_price) {
                    const discount = document.createElement('div')
                    discount.className = styles.discount
                    const percent = 100 - Math.floor(((item.promo_price * 100) / item.price))
                    discount.innerHTML = `-${percent}%`
                    row.appendChild(discount)
                }
            })

        }

        const pages = (totalPages, page) => {
            const pagination = document.querySelector(`.${styles.pagination}`)
            const total_pages = document.querySelector(`.${styles.total_pages}`)
            total_pages.innerHTML = ''
            const prev_page = document.querySelector(`.${styles.prev_page}`)
            const first_page = document.querySelector(`.${styles.first_page}`)
            if(page == '1'){
                first_page.style.display = 'none'
                prev_page.style.display = 'none'
            }
            for(let i = 1; i <= totalPages; i++){
                const page_link = document.createElement('a')
                page_link.title = `page${i}`
                page_link.innerHTML = `0${i}`
                total_pages.appendChild(page_link)
                if(i == 1){
                    page_link.setAttribute('id', styles.page_active)
                }

                page_link.addEventListener('click', () => {
                    total_pages.childNodes.forEach((item) => {
                        item.removeAttribute('id')
                    })
                    page_link.setAttribute('id', styles.page_active)
                    setTimeout(async () => {
                        const data = await product_pagination(i, 12)
                        showProductGrid(data.products)
                    }, 200)
                })
            }
        }

        const handleData = () => {
            const filterBtn = document.querySelector(`.${styles.filterBtn}`)
            const filter_box = document.querySelector(`.${styles.filter_box}`)
            const filter_v2 = document.querySelector(`.${styles.filter_v2}`)
            let flag = false;
            filterBtn.addEventListener('click', () => {
                flag = !flag;
                if (flag) {
                    filter_v2.style.height = '370px';
                    filter_box.classList.add(styles.show)
                    filter_box.classList.remove(styles.collapse)
                } else {
                    filter_box.classList.add(styles.collapse)
                    filter_box.classList.remove(styles.show)
                    filter_v2.style.height = 0;
                }
            })
        }

        handleData()
        getApi()
        colors()
    }, [])
    return (
        <>
            <div id={styles.products}>
                <div className={styles.title_page}>
                    <img src="./img/product_bg.webp" width="100%" />
                    <div className={styles.bread_crumb}>
                        <h1>Products</h1>
                        <div>
                            <h4>Home</h4>
                            <span class="material-symbols-outlined">chevron_right</span>
                            <h4>Products</h4>
                        </div>
                    </div>
                </div>

                <div className={styles.collectionBox}>
                    <div className={styles.cate_collection}>
                        <div className={styles.slick_track}>
                            <div className={styles.slider_item}>
                                <img src="./img/collect1.jpg" width="110px" height="110px" />
                                <h3>ALL ITEMS</h3>
                            </div>
                            <div className={styles.slider_item}>
                                <img src="./img/collect2.jpg" width="110px" height="110px" />
                                <h3>BEST SELLER</h3>
                            </div>
                            <div className={styles.slider_item}>
                                <img src="./img/collect3.jpg" width="110px" height="110px" />
                                <h3>COFFEE</h3>
                            </div>
                            <div className={styles.slider_item}>
                                <img src="./img/collect4.jpg" width="110px" height="110px" />
                                <h3>SALE</h3>
                            </div>
                            <div className={styles.slider_item}>
                                <img src="./img/collect5.jpg" width="110px" height="110px" />
                                <h3>NEW</h3>
                            </div>
                            <div className={styles.slider_item}>
                                <img src="./img/collect6.jpg" width="110px" height="110px" />
                                <h3>HIGHLIGHT</h3>
                            </div>
                        </div>
                        <button className={styles.prevBtn}><span class="material-symbols-outlined">arrow_back_ios</span></button>
                        <button className={styles.nextBtn}><span class="material-symbols-outlined">arrow_forward_ios</span></button>
                    </div>
                </div>

                <div className={styles.shop_container}>
                    <div className={styles.widget}>
                        <div className={styles.filter_category}>
                            <div className={styles.widget_title}>
                                <h3>Categories</h3>
                            </div>
                            <div className={styles.widget_content}>
                                <ul>
                                    <li><a href=''>Home</a></li>
                                    <li><a href=''>Shop</a></li>
                                    <li><a href=''>Featured</a></li>
                                    <li><a href=''>Pages</a></li>
                                    <li><a href=''>Element</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.color_option}>
                            <div className={styles.widget_title}>
                                <h3>Color Option</h3>
                            </div>
                            <div>
                                <ul className={styles.list_color}>

                                </ul>
                            </div>
                        </div>
                        <div className={styles.size_option}>
                            <div className={styles.widget_title}>
                                <h3>Size Option</h3>
                            </div>
                            <div>
                                <ul className={styles.list_size}>
                                    <li><a title="500g">500g</a></li>
                                    <li><a title="1000g">1000g</a></li>
                                    <li><a title="1500g">1500g</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.price_filter_option}>
                            <div className={styles.widget_title}>
                                <h3>Price Filter</h3>
                            </div>
                            <div>
                                <ul className={styles.list_price}></ul>
                            </div>
                        </div>
                        <div className={styles.banner_sidebar}>
                            <a>
                                <img src='./img/banner_sidebar.webp' width="350px" />
                            </a>
                        </div>
                    </div>
                    <div className={styles.product_view}>
                        <div className={styles.shop_control}>
                            <div className={styles.shop_control_col1}>
                                <button className={styles.filterBtn}>
                                    <span><FontAwesomeIcon icon={faFilter} /></span>
                                    <h3>FILTER</h3>
                                </button>
                            </div>
                            <div className={styles.shop_control_col2}>
                                <div className={styles.change_column}>
                                    <div className={styles.prod_per}>
                                        <button className={styles.col_size_2}>2</button>
                                        <button className={styles.col_size_3}>3</button>
                                        <button className={styles.col_size_4} id={styles.size_active}>4</button>
                                        <button className={styles.col_size_5}>5</button>
                                    </div>
                                    <button className={styles.icon_change}>
                                        <img src="./img/column.png" width="35px" height="35px" />
                                    </button>
                                </div>
                                <div className={styles.featured}>
                                    <button className={styles.featuredBtn}>
                                        <h3>Featured</h3>
                                        <span class="material-symbols-outlined">arrow_drop_down</span>
                                    </button>
                                    <ul className={styles.dropdown}>
                                        <li>Featured</li>
                                        <li>Best Selling</li>
                                        <li>Alphabetically, A-Z</li>
                                        <li>Price, high to low</li>
                                        <li>Price, low to high</li>
                                        <li>Date, old to new</li>
                                        <li>Date, new to old</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={styles.filter_v2}>
                            <div className={styles.filter_box}>
                                <div className={styles.col}>
                                    <div className={styles.col_title}>
                                        <h2>Categories</h2>
                                    </div>
                                    <div className={styles.col_content}>
                                        <ul>
                                            <li><a href="/">Home</a></li>
                                            <li><a href="/shop">Shop</a></li>
                                            <li><a href="/">Featured</a></li>
                                            <li><a href="/">Pages</a></li>
                                            <li><a href="/">Element</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className={styles.col}>
                                    <div className={styles.col_title}>
                                        <h2>Color Option</h2>
                                    </div>
                                    <div className={styles.col_content}>
                                        <div className={styles.filter_colors}>

                                        </div>
                                    </div>
                                </div>
                                <div className={styles.col}>
                                    <div className={styles.col_title}>
                                        <h2>Size Option</h2>
                                    </div>
                                    <div className={styles.col_content}>
                                        <div className={styles.filter_size}>
                                            <button id="500g">500g</button>
                                            <button id="1000g">1000g</button>
                                            <button id="1500g">1500g</button>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.col}>
                                    <div className={styles.col_title}>
                                        <h2>Price Filter</h2>
                                    </div>
                                    <div className={styles.col_content}>
                                        <ul className={styles.filter_price}>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.product_grid_uniform}>
                            <div className={styles.product_items}>
                                <div className={styles.product_item_v1}>
                                    <div className={styles.product_grid_parent}></div>
                                </div>
                            </div>
                            <div className={styles.pagination}>
                                <a className={styles.first_page}>
                                    <span class="material-symbols-outlined">
                                    keyboard_double_arrow_left
                                    </span>
                                </a>
                                <a className={styles.prev_page}>
                                <span class="material-symbols-outlined">
                                arrow_back_ios_new
                                </span>
                                </a>
                                <div className={styles.total_pages}></div>
                                <a className={styles.next_page}>
                                    <span class="material-symbols-outlined">
                                        arrow_forward_ios
                                    </span>
                                </a>
                                <a className={styles.last_page}>
                                    <span class="material-symbols-outlined">
                                    keyboard_double_arrow_right
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product