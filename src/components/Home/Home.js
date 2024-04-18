import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle, faInfoCircle, faLock, faTimesCircle, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './Home.module.css'
import { getAllProducts } from '../../api.js';
import { daysToWeeks } from 'date-fns';
import MyLoader from '../Loader/Loader';
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { imageUrl: './img/carousel1.webp', alt: 'Image 1', h3: "DON'T MISS TODAY'S FEATURED DEALS", h3_animate: styles.h3_animate1, h1: "Start A Day With Coffee", h1_animate: styles.h1_animate1, h2: "Here to bring your life style to the next level.", h2_animate: styles.h2_animate1, button: "SHOP NOW", button_animate: styles.button_animate1 },
    { imageUrl: './img/carousel2.webp', alt: 'Image 2', h3: "NEED-IT-NOW", h3_animate: styles.h3_animate2, h1: "Start A Day With Coffee", h1_animate: styles.h1_animate2, h2: "Contemporary, minimal and beautifully iconic.", h2_animate: styles.h2_animate2, button: "BUY NOW", button_animate: styles.button_animate2 }
  ];

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const categoryImg = document.querySelectorAll(`.${styles.homeCol2} > div > img`);

    const handleMouseEnter = (e) => {
      const parentNode = e.target.parentNode
      parentNode.classList.add(styles.hovered)
    };

    const handleMouseLeave = (e) => {
      const parentNode = e.target.parentNode
      parentNode.classList.remove(styles.hovered)
    }
    categoryImg.forEach((item) => {
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave)
    });

    return () => {
      categoryImg.forEach((item) => {
        item.removeEventListener('mouseenter', handleMouseEnter);
      });
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getAllProducts();
        const newProducts = products.sort((b, a) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        const data = newProducts.slice(0, 8)
        const productBox = document.querySelector('.' + styles.newProductBox)
        productBox.innerHTML = '';
        data.forEach((item) => {
          const productItem = document.createElement('div')
          productItem.className = styles.productItem
          productBox.appendChild(productItem)
          productItem.addEventListener('mouseenter', () => {
            actions.style.display = 'flex'
          })
  
          productItem.addEventListener('mouseleave', () => {
            actions.style.display = 'none'
          })
  
          const actions = document.createElement('div')
          actions.className = styles.actionBtns
          productItem.appendChild(actions)
  
          const heart = document.createElement('div')
          heart.className = styles.heartBtn
          heart.innerHTML = `<button><span class="material-symbols-outlined">favorite</span></button>`
          actions.appendChild(heart)
  
          const wishlist = document.createElement('div')
          wishlist.textContent = 'Add to Wishlist'
          wishlist.className = styles.tooltip
          heart.appendChild(wishlist)
  
          const cart = document.createElement('div')
          cart.className = styles.cartBtn
          cart.innerHTML = `<button><span class="material-symbols-outlined">local_mall</span></button>`
          actions.appendChild(cart)
  
          const addToCart = document.createElement('div')
          addToCart.textContent = 'Add to Cart'
          addToCart.className = styles.tooltip
          cart.appendChild(addToCart)
  
          const search = document.createElement('div')
          search.className = styles.searchBtn
          search.innerHTML = `<button><span class="material-symbols-outlined">search</span></button>`
          actions.appendChild(search)
          const quick_view = document.createElement('div')
          quick_view.textContent = 'Quick view'
          quick_view.className = styles.tooltip
          search.appendChild(quick_view)
  
          search.addEventListener('click', () => {

            const quickViewModal = document.getElementById(`${styles.quickView}`)
            quickViewModal.style.display = 'block'
            const imgQuickView = document.querySelector(`.${styles.imgQuickView}`)
            imgQuickView.innerHTML = ''
            const mainImg = document.createElement('img')
            mainImg.width = 420
            mainImg.src = `./img/${item.img_url[0]}`
            imgQuickView.appendChild(mainImg)
            const carousel = document.createElement('div')
            carousel.className = styles.carousel
            imgQuickView.appendChild(carousel)
            const imgItems = item.img_url.slice(0,3)
            imgItems.forEach((res) => {
              const imgItem = document.createElement('img')
              imgItem.width = 133
              imgItem.src = `./img/${res}`
              carousel.appendChild(imgItem)
            })

            const quickViewInfo = document.querySelector(`.${styles.quickViewInfo}`)
            quickViewInfo.innerHTML = ''
            const name = document.createElement('h2')
            name.textContent = item.name
            quickViewInfo.appendChild(name)
            const price = document.createElement('div')
            price.className = styles.quickViewPrice
            quickViewInfo.appendChild(price)
            if(item.promo_price){
              price.innerHTML = `<h3>${item.promo_price.toLocaleString()}&#8363;</h3>`
            }else{
              price.innerHTML = `<h3>${item.price.toLocaleString()}&#8363;</h3>`
            }

            const mo_ta = document.createElement('p')
            mo_ta.textContent = item.mo_ta
            quickViewInfo.appendChild(mo_ta)

            const sizeBox = document.createElement('div')
            sizeBox.className = styles.sizeBox
            quickViewInfo.appendChild(sizeBox)
            const sizeBtn = document.createElement('button')
            sizeBtn.className = styles.sizeBtn
            sizeBtn.textContent = 'SIZE'
            sizeBox.appendChild(sizeBtn)
            const sizeItems = document.createElement('div')
            sizeItems.className = styles.sizeItems
            sizeBox.appendChild(sizeItems)
            const smallSize = document.createElement('button')
            smallSize.id = styles.sizeActive
            smallSize.textContent = '500G'
            sizeItems.appendChild(smallSize)
            const largeSize = document.createElement('button')
            largeSize.textContent = '1000G'
            sizeItems.appendChild(largeSize)

            const sizes = document.querySelectorAll(`.${styles.sizeItems} > button`)
            sizes.forEach((val) => {
              val.addEventListener('click', () => {
                sizes.forEach(node => {
                  node.removeAttribute('id')
                }) 
                val.setAttribute('id', styles.sizeActive)
                if(val.textContent == '1000G'){
                  if(item.promo_price){
                    const _price = item.promo_price * 2;
                    price.innerHTML = `<h3>${_price.toLocaleString()}&#8363;</h3>`
                  }else{
                    const _price = item.price * 2;
                    price.innerHTML = `<h3>${_price.toLocaleString()}&#8363;</h3>`
                  }
                }else{
                  if(item.promo_price){
                    price.innerHTML = `<h3>${item.promo_price.toLocaleString()}&#8363;</h3>`
                  }else{
                    price.innerHTML = `<h3>${item.price.toLocaleString()}&#8363;</h3>`
                  }
                }
              })
            })

            const colors = document.createElement('div')
            colors.className = styles.colorBox
            quickViewInfo.appendChild(colors)
            const colorBtn = document.createElement('button')
            colorBtn.className = styles.colorBtn
            colorBtn.textContent = 'COLOR'
            colors.appendChild(colorBtn)
            const colorItems = document.createElement('div')
            colorItems.className = styles.colorItems
            colors.appendChild(colorItems)

            item.colors.forEach((color) => {
              const colorItem = document.createElement('button')
              colorItem.placeholder = color
              colorItem.style.backgroundColor = color
              colorItems.appendChild(colorItem)
            })

            const firstColorItem = document.querySelector(`.${styles.colorItems} > button:first-child`)
            firstColorItem.id = styles.colorActive

            const colorNodes = document.querySelectorAll(`.${styles.colorItems} > button`)
            colorNodes.forEach((node) => {
              node.addEventListener('click', () => {
                colorNodes.forEach((res) => {
                  res.removeAttribute('id')
                })
                node.id = styles.colorActive
    
                if(item.colors[1] == node.placeholder){
                  mainImg.src = `./img/${item.img_url[1]}`
                }else if(item.colors[2] == node.placeholder){
                  mainImg.src = `./img/${item.img_url[2]}`
                }else{
                  mainImg.src = `./img/${item.img_url[0]}`
                }
              })
            })
            const quickViewAction = document.createElement('div')
            quickViewAction.className = styles.quickViewAction
            quickViewInfo.appendChild(quickViewAction)

            const quantityBox = document.createElement('div')
            quantityBox.className = styles.quantityBox
            quickViewAction.appendChild(quantityBox)
            const quantity = document.createElement('input')
            quantity.className = styles.quantity
            quantity.value = 1
            quantityBox.appendChild(quantity)
            const quantityAction = document.createElement('div')
            quantityAction.className = styles.quantityAction
            quantityBox.appendChild(quantityAction)
            const plus = document.createElement('span')
            plus.innerHTML = `<span class="material-symbols-outlined">add</span>`
            quantityAction.appendChild(plus)
            plus.addEventListener('click', () => {
              quantity.value++;
            })
            const minus = document.createElement('span')
            minus.innerHTML = `<span class="material-symbols-outlined">remove</span>`
            quantityAction.appendChild(minus)
            minus.addEventListener('click', () => {
              quantity.value--;
            })
            const addToCartBtn = document.createElement('button')
            addToCartBtn.textContent = 'ADD TO CART'
            quickViewAction.appendChild(addToCartBtn)
          })
  
          const closeModal = document.querySelector(`.${styles.close}`)
          closeModal.addEventListener('click', () => {
            const quickViewModal = document.getElementById(`${styles.quickView}`)
            quickViewModal.style.display = 'none'
          })
          const imgBox = document.createElement('div')
          imgBox.className = styles.imgBox
          productItem.appendChild(imgBox)
  
          const img = document.createElement('img')
          img.src = `./img/${item.img_url[0]}`
          img.width = 388
          imgBox.appendChild(img)
          const name = document.createElement('h3')
          name.textContent = item.name
          productItem.appendChild(name)
          if (item.promo_price) {
            const sale = document.createElement('div')
            sale.className = styles.sale
            sale.innerHTML = `<p>SALE</p>`
            productItem.appendChild(sale)
            const priceBox = document.createElement('div')
            priceBox.className = styles.priceBox
            productItem.appendChild(priceBox)
            const promo_price = document.createElement('h3')
            promo_price.innerHTML = `${item.promo_price.toLocaleString()}&#8363;`
            priceBox.appendChild(promo_price)
            const price = document.createElement('h4')
            price.innerHTML = `<del>${item.price.toLocaleString()}&#8363;</del>`
            priceBox.appendChild(price)
          } else {
            const price = document.createElement('h4')
            price.className = styles.price
            price.innerHTML = `${item.price.toLocaleString()}&#8363;`
            productItem.appendChild(price)
          }
          const imgThumbnail = document.createElement('div')
          imgThumbnail.className = styles.imgThumbnail
          productItem.appendChild(imgThumbnail)
          const imgUrls = item.img_url
          imgUrls.forEach((val) => {
            const image = document.createElement('img')
            image.src = `./img/${val}`
            image.width = 45
            imgThumbnail.appendChild(image)
            if (imgUrls[0] == val) {
              image.className = styles.activeImg
            }
            image.addEventListener('click', (e) => {
              const imgNode = e.target.parentNode.childNodes
              imgNode.forEach((res) => {
                res.removeAttribute('class')
              })
              image.className = styles.activeImg
              img.src = `./img/${val}`
            })
          })
        })
  
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchData();
    setIsLoading(false);
  }, [])

  return (
    <div>
      {
        isLoading ? <MyLoader /> :
          (
            <>
              <div id={styles.home}>
              <div className={styles.homeCol1}>
                <div className={styles.carousel}>
                  {slides.map((slide, index) => (
                    <>
                      <div
                        key={index}
                        className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
                      >
                        <img
                          src={slide.imageUrl} alt={slide.alt}
                        />
                      </div>
                      <div key={index}
                        className={`${styles.slide} ${styles.bgTitle} ${index === currentIndex ? styles.active : ''}`}>
                        <h3 key={index} className={slide.h3_animate}>{slide.h3}</h3>
                        <h1 key={index} className={slide.h1_animate}>{slide.h1}</h1>
                        <h2 className={slide.h2_animate}>{slide.h2}</h2>
                        <button className={slide.button_animate}>
                          {slide.button}
                        </button>
                      </div>
                    </>
                  ))}
                </div>
                <button className={styles.prevBtn} onClick={handlePrevClick}>
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                <button className={styles.nextBtn} onClick={handleNextClick}>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
              <div className={styles.homeCol2}>
                <div className={styles.category1}>
                  <img src="./img/category1.webp" />
                  <div className={styles.categoryTitle}>
                    <h1>Espresso Coffee</h1>
                    <button>SHOP NOW</button>
                  </div>
                </div>
                <div className={styles.category2}>
                  <img src="./img/category2.webp" />
                  <div className={styles.categoryTitle}>
                    <h1>Collection New</h1>
                    <button>SHOP NOW</button>
                  </div>
                </div>
              </div>

              <div className={styles.newProducts}>
                <h1>New Product</h1>
                <div className={styles.newProductBox}>

                </div>
              </div>
            </div>
            </>
          )
      }

      {
        isLoading ? <MyLoader /> :
        (
          <div id={styles.quickView} className={styles.quickViewModal}>
            <div className={styles.quickViewContent}>
              <div className={styles.imgQuickView}>
              </div>
              <div className={styles.quickViewInfo}>
              </div>
              <span className={styles.close}>&times;</span>
            </div>
          </div>
        )
      }
    </div>
  );
};


export default Home