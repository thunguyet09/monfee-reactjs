import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle, faInfoCircle, faLock, faTimesCircle, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './Home.module.css'
import { getAllProducts, getChosedVoucher } from '../../api.js';
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
        const productBox = document.querySelector(`.${styles.newProductBox}`)
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
            const imgItems = item.img_url.slice(0, 3)
            imgItems.forEach((res) => {
              const imgItem = document.createElement('img')
              imgItem.width = 133
              imgItem.src = `./img/${res}`
              carousel.appendChild(imgItem)

              imgItem.addEventListener('click', () => {
                mainImg.src = `./img/${res}`
              })
            })

            const quickViewInfo = document.querySelector(`.${styles.quickViewInfo}`)
            quickViewInfo.innerHTML = ''
            const name = document.createElement('h2')
            name.textContent = item.name
            quickViewInfo.appendChild(name)
            const price = document.createElement('div')
            price.className = styles.quickViewPrice
            quickViewInfo.appendChild(price)
            if (item.promo_price) {
              price.innerHTML = `<h3>${item.promo_price.toLocaleString()}&#8363;</h3>`
            } else {
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
                if (val.textContent == '1000G') {
                  if (item.promo_price) {
                    const _price = item.promo_price * 2;
                    price.innerHTML = `<h3>${_price.toLocaleString()}&#8363;</h3>`
                  } else {
                    const _price = item.price * 2;
                    price.innerHTML = `<h3>${_price.toLocaleString()}&#8363;</h3>`
                  }
                } else {
                  if (item.promo_price) {
                    price.innerHTML = `<h3>${item.promo_price.toLocaleString()}&#8363;</h3>`
                  } else {
                    price.innerHTML = `<h3>${item.price.toLocaleString()}&#8363;</h3>`
                  }
                }
              })
            })

            const colors = document.createElement('div');
            colors.className = styles.colorBox;
            quickViewInfo.appendChild(colors);

            const colorBtn = document.createElement('button');
            colorBtn.className = styles.colorBtn;
            colorBtn.textContent = 'COLOR';
            colors.appendChild(colorBtn);

            const colorItems = document.createElement('div');
            colorItems.className = styles.colorItems;
            colors.appendChild(colorItems);

            item.colors.forEach((color) => {
              const colorItem = document.createElement('button');
              colorItem.textContent = ''
              colorItem.style.backgroundColor = color;
              colorItems.appendChild(colorItem);

              colorItem.addEventListener('click', () => {
                colorNodes.forEach((node) => {
                  node.removeAttribute('id');
                });
                colorItem.id = styles.colorActive || '';

                const colorIndex = item.colors.indexOf(color);
                const imgUrl = colorIndex >= 0 ? item.img_url[colorIndex] : item.img_url[0];
                mainImg.src = `./img/${imgUrl}`;
              });

              const colorNodes = colorItems.querySelectorAll('button');
              const firstColorItem = colorNodes[0];
              firstColorItem.id =  styles.colorActive 
            });
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

    const handleCountDown = async () => {
      const voucher = await getChosedVoucher();
      const currentDate = new Date();
      const expiredDate = new Date(voucher.expiredDate);
      let times = expiredDate - currentDate;

      if (times > 0) {
        const updateCountdown = () => {
          const daysElement = document.querySelector('.days > span');
          const hoursElement = document.querySelector('.hours > span');
          const minsElement = document.querySelector('.mins > span');
          const secElement = document.querySelector('.sec > span');

          const d = Math.floor(times / (1000 * 60 * 60 * 24));
          const h = Math.floor((times % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((times % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((times % (1000 * 60)) / 1000);

          daysElement.textContent = (d < 10 ? '0' : '') + d;
          hoursElement.textContent = (h < 10 ? '0' : '') + h;
          minsElement.textContent = (m < 10 ? '0' : '') + m;
          secElement.textContent = (s < 10 ? '0' : '') + s;

          if (d == 0 && h <= 2 && s > 0) {
            const voucherExpiredBox = document.querySelector(`.${styles.voucherExpired}`)
            voucherExpiredBox.style.display = 'block'
            const voucherExpired = document.querySelector(`.${styles.voucherExpired} > p`)
            voucherExpired.innerHTML = 'Ưu đãi sắp hết hạn'
          }

          if (times <= 0) {
            clearInterval(countdownInterval);
            daysElement.textContent = '00'
            hoursElement.textContent = '00'
            minsElement.textContent = '00'
            secElement.textContent = '00'
          } else {
            times -= 1000;
          }
        };

        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);

        const getVoucherBtn = document.querySelector(`.${styles.countDownBtn}`)
        getVoucherBtn.addEventListener('click', () => {
          clearInterval(countdownInterval)
          getVoucherBtn.setAttribute('id', 'animateExtend')
          const textBtn = document.querySelector(`.${styles.countDownBtn} > span`)
          textBtn.innerHTML = `<span class="material-symbols-outlined">done</span>`
          console.log('text', textBtn)
          const labelexpired = document.querySelector(`.${styles.labelexpired}`)
          labelexpired.style.marginTop = '30px'
          labelexpired.innerHTML = `
              <img src='./img/voucher.png' width="200px">
              <div>
                <h2>Ưu đãi: ${voucher.discount}% tổng thanh toán</h2>
                <p>Mã: <u>${voucher.voucher_code}</u> </p>
              </div>
            `
        })
      }
    };

    const productsSale = async () => {
      try {
        const products = await getAllProducts()
        const salesData = products.filter(item => item.hasOwnProperty('promo_price') | item.promo_price > 0).slice(0,8)
        const productBox = document.querySelector(`.${styles.products_sale}`)
        productBox.innerHTML = ''
        salesData.forEach((item) => {
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
            const imgItems = item.img_url.slice(0, 3)
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
            if (item.promo_price) {
              price.innerHTML = `<h3>${item.promo_price.toLocaleString()}&#8363;</h3>`
            } else {
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
                if (val.textContent == '1000G') {
                  if (item.promo_price) {
                    const _price = item.promo_price * 2;
                    price.innerHTML = `<h3>${_price.toLocaleString()}&#8363;</h3>`
                  } else {
                    const _price = item.price * 2;
                    price.innerHTML = `<h3>${_price.toLocaleString()}&#8363;</h3>`
                  }
                } else {
                  if (item.promo_price) {
                    price.innerHTML = `<h3>${item.promo_price.toLocaleString()}&#8363;</h3>`
                  } else {
                    price.innerHTML = `<h3>${item.price.toLocaleString()}&#8363;</h3>`
                  }
                }
              })
            })

            const colors = document.createElement('div');
            colors.className = styles.colorBox;
            quickViewInfo.appendChild(colors);

            const colorBtn = document.createElement('button');
            colorBtn.className = styles.colorBtn;
            colorBtn.textContent = 'COLOR';
            colors.appendChild(colorBtn);

            const colorItems = document.createElement('div');
            colorItems.className = styles.colorItems;
            colors.appendChild(colorItems);

            item.colors.forEach((color) => {
              const colorItem = document.createElement('button');
              colorItem.textContent = color;
              colorItem.style.backgroundColor = color;
              colorItems.appendChild(colorItem);

              colorItem.addEventListener('click', () => {
                colorNodes.forEach((node) => {
                  node.removeAttribute('id');
                });
                colorItem.id = styles.colorActive || '';

                const colorIndex = item.colors.indexOf(color);
                const imgUrl = colorIndex >= 0 ? item.img_url[colorIndex] : item.img_url[0];
                mainImg.src = `./img/${imgUrl}`;
              });
              const colorNodes = colorItems.querySelectorAll('button');
              const firstColorItem = colorNodes[0];
              firstColorItem.id = styles.colorActive 
            });

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

        const draggableBtns = document.querySelectorAll(`.${styles.draggable} > button`)
          
          draggableBtns.forEach((val) => {
            val.addEventListener('click', () => {
              draggableBtns.forEach((res) => {
                res.removeAttribute('id')
              })
              val.setAttribute('id', styles.slide_active)
              console.log(val)
              if(val.textContent == 2){
                productBox.style.transform = 'translate3d(-1250px, 0px, 0px)'
              }else if(val.textContent == 3){
                productBox.style.transform = 'translate3d(-1670px, 0px, 0px)'
              }else{
                productBox.style.transform = 'translate3d(0px, 0px, 0px)'
              }
            })
          })
      } catch (error) {
        console.log(error)
      }
    }

    productsSale()
    fetchData();
    setIsLoading(false);
    handleCountDown()
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

                <div id={styles.countDown}>
                  <div className={styles.count_down_v1}>
                    <img src="./img/count-down.webp" width="550px" height="682px" />
                  </div>
                  <div className={styles.count_down_v2}>
                    <img src="./img/bgcount-downt.webp" height="682px" width="1400px" />
                    <div className={styles.countDownContent}>
                      <div className={styles.countDownTitle}>
                        <p>A NATURAL COFFEE</p>
                        <button>
                          Enjoy The Coffee
                        </button>
                      </div>
                      <div className={styles.labelexpired}>
                        <li className="days">
                          <span>00</span>
                          <h4>Days</h4>
                        </li>
                        <li className="hours">
                          <span>00</span>
                          <h4>Hours</h4>
                        </li>
                        <li className="mins">
                          <span>00</span>
                          <h4>Mins</h4>
                        </li>
                        <li className="sec">
                          <span>00</span>
                          <h4>Sec</h4>
                        </li>
                      </div>
                      <button className={styles.countDownBtn}>
                        <span>GET VOUCHER</span>
                      </button>
                      <div className={styles.voucherExpired}>
                        <p></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.products_sale_box}>
                  <h2>Product Sale</h2>
                  <p>Discount every Monday</p>
                  <div className={styles.products_sale}></div>
                  <div className={styles.draggable}>
                      <button id={styles.slide_active}>1</button>
                      <button>2</button>
                      <button>3</button>
                  </div>
                </div>

                <div className={styles.news_box}>

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