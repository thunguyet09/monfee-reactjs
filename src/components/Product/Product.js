import React, { useState, useEffect, useRef, useContext } from 'react'
import styles from './Product.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { getAllProducts } from '../../api';

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
          if(slideIndex == 0){
            slideIndex = 2;
            const slideWidth = slick_track.clientWidth;
            slick_track.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
          }else{
            slideIndex = (slideIndex - 1 + slick_track.children.length) % slick_track.children.length;
            updateSliderPosition();
          }
        });

        nextBtn.addEventListener('click', () => {
          slideIndex = (slideIndex + 1) % slick_track.children.length;
          
          if(slideIndex > 2){
            slideIndex = 0;
            slick_track.style.transform = `translateX(0px)`
          }else{
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
            if(flag){
                dropdown.style.opacity = 1
                featured_icon.innerHTML = `<span class="material-symbols-outlined">arrow_drop_up</span>`
            }else{
                dropdown.style.opacity = 0
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
        }

        const showProductGrid = async () => {
            const products = await getAllProducts()
            const product_items = document.querySelector(`.${styles.product_grid_parent}`)
            products.forEach((item) => {
                const row = document.createElement('div')
                row.className = styles.row
                product_items.appendChild(row)
                const img_product = document.createElement('div')
                row.appendChild(img_product)
                const img_link = document.createElement('img')
                img_link.width = 280
                img_link.src = `./img/${item.img_url[0]}`
                img_product.appendChild(img_link)
                const product_icon_action = document.createElement('ul')
                img_product.appendChild(product_icon_action)
                if(item.colors){
                    const select_option = document.createElement('button')
                    select_option.className = styles.select_option
                    select_option.innerHTML = `<span class="material-symbols-outlined">more_horiz</span>`
                    product_icon_action.appendChild(select_option)
                }else{
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
                if(item.promo_price){
                    const price_box = document.createElement('div')
                    row.appendChild(price_box)
                    const price = document.createElement('h5')
                    price.innerHTML = `<del>${item.price.toLocaleString()}</del>`
                    price_box.appendChild(price)
                    const promo_price = document.createElement('h4')
                    promo_price.textContent = item.promo_price.toLocaleString()
                    price_box.appendChild(promo_price)
                }else{
                    const price = document.createElement('h4')
                    price.innerHTML = `${item.price.toLocaleString()}`
                    row.appendChild(price)
                }

                if(item.colors.length > 0){
                    const product_colors = document.createElement('div')
                    row.appendChild(product_colors)
                    item.colors.forEach((val) => {
                        const color_btn = document.createElement('button')
                        color_btn.style.padding = '10px'
                        color_btn.style.backgroundColor = val
                        product_colors.appendChild(color_btn)
                    })
                }
            })
        }

        showProductGrid()
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
                                <img src="./img/collect3.jpg"width="110px" height="110px" />
                                <h3>COFFEE</h3>
                            </div>
                            <div className={styles.slider_item}>
                                <img src="./img/collect4.jpg" width="110px" height="110px" />
                                <h3>SALE</h3>
                            </div>
                            <div className={styles.slider_item}>
                                <img src="./img/collect5.jpg" width="110px" height="110px"/>
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
                                <ul className={styles.list_price}>
                                    <li><a>50,000 - 100,000</a></li>
                                    <li><a>100,000 - 150,000</a></li>
                                    <li><a>150,000 - 200,000</a></li>
                                    <li><a>200,000 - 250,000</a></li>
                                    <li><a>Over 250,000</a></li>
                                </ul>
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
                                        <img src="./img/column.png" width="35px" height="35px"/>
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
                        <div className={styles.product_grid_uniform}>
                            <div className={styles.product_items}>
                                <div className={styles.product_item_v1}>
                                    <div className={styles.product_grid_parent}></div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product