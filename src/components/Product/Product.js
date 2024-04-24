import React, { useState, useEffect, useRef, useContext } from 'react'
import styles from './Product.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
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
        return () => {
          slick_track.removeEventListener('mouseenter', handleMouseEnter);
          slick_track.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);
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
                    <div className={styles.widget}></div>
                    <div className={styles.shop_control}>
                        <div className={styles.shop_control_col1}>
                            <button className={styles.filterBtn}>
                                <span><FontAwesomeIcon icon={faFilter} /></span>
                                <h3>FILTER</h3>
                            </button>
                        </div>
                        <div className={styles.shop_control_col2}>
                            <div className={styles.change_column}>
                                <div className={styles.prod_per}></div>
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

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product