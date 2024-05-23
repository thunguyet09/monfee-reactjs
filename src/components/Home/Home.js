import React, { useState, useEffect, useRef } from "react";
import styles from "./Home.module.css";
import {
  getAllProducts,
  getCarts,
  getChosedVoucher,
  getNewsApproved,
  getDetail,
  getProductsByCategoryId,
} from "../../api.js";
import MyLoader from "../Loader/Loader";
import { numsInCart } from "../Header/Header";
const Home = ({ authenticated }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      imageUrl: "./img/carousel1.webp",
      alt: "Image 1",
      h3: "DON'T MISS TODAY'S FEATURED DEALS",
      h3_animate: styles.h3_animate1,
      h1: "Start A Day With Coffee",
      h1_animate: styles.h1_animate1,
      h2: "Here to bring your life style to the next level.",
      h2_animate: styles.h2_animate1,
      button: "SHOP NOW",
      button_animate: styles.button_animate1,
    },
    {
      imageUrl: "./img/carousel2.webp",
      alt: "Image 2",
      h3: "NEED-IT-NOW",
      h3_animate: styles.h3_animate2,
      h1: "Start A Day With Coffee",
      h1_animate: styles.h1_animate2,
      h2: "Contemporary, minimal and beautifully iconic.",
      h2_animate: styles.h2_animate2,
      button: "BUY NOW",
      button_animate: styles.button_animate2,
    },
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
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    let selectedColorIndex = '';
    const fetchData = async () => {
      try {
        const products = await getAllProducts("products");
        const newProducts = products.sort((b, a) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        const data = newProducts.slice(0, 8);
        const productBox = document.querySelector(`.${styles.newProductBox}`);
        productBox.innerHTML = "";
        data.forEach(async (item) => {
          const productItem = document.createElement("div");
          productItem.className = styles.productItem;
          productBox.appendChild(productItem);
          productItem.addEventListener("mouseenter", () => {
            actions.style.display = "flex";
          });

          productItem.addEventListener("mouseleave", () => {
            actions.style.display = "none";
          });

          const actions = document.createElement("div");
          actions.className = styles.actionBtns;
          productItem.appendChild(actions);

          const heart = document.createElement("div");
          heart.className = styles.heartBtn;
          heart.innerHTML = `<button><span class="material-symbols-outlined">favorite</span></button>`;
          actions.appendChild(heart);

          const wishlist = document.createElement("div");
          wishlist.textContent = "Add to Wishlist";
          wishlist.className = styles.tooltip;
          heart.appendChild(wishlist);

          const cart = document.createElement("div");
          cart.className = styles.cartBtn;
          cart.innerHTML = `<button><span class="material-symbols-outlined">local_mall</span></button>`;
          actions.appendChild(cart);

          const addToCart = document.createElement("div");
          addToCart.textContent = "Add to Cart";
          addToCart.className = styles.tooltip;
          cart.appendChild(addToCart);

          const cartModal = document.querySelector(`.${styles.cartModal}`);
          const closeCartModal = document.querySelector(
            `.${styles.closeCartModal}`
          );
          closeCartModal.addEventListener("click", () => {
            localStorage.removeItem("product_id");
            cartModal.style.display = "none";
          });
          cart.addEventListener("click", async () => {
            if (token) {
              const carts = await getCarts("cart");
              let id = 0;
              if (carts.length > 0) {
                id = carts[carts.length - 1].id + 1;
              } else {
                id = 0;
              }
              const cartObj = {
                id: id,
                prod_id: item.id,
                quantity: 1,
                user_id: userId,
                size: "500g",
              };
              const existingCart = carts.filter(
                (res) => res.user_id == userId && res.prod_id == item.id
              );

              if (item.quantity[0] > 0) {
                if (existingCart.length > 0) {
                  existingCart.forEach(async (val) => {
                    const new_quantity = val.quantity + 1;
                    await fetch(`http://localhost:3000/cart`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        quantity: new_quantity,
                        prod_id: val.prod_id,
                        user_id: userId,
                      }),
                    }).then(() => {
                      localStorage.setItem("product_id", val.prod_id);
                      cart.innerHTML = `<button><span class="material-symbols-outlined">check_circle</span></button>`;
                      cart.style.color = "#b8784e";
                      setTimeout(() => {
                        cartModal.style.display = "block";
                        console.log(item.quantity[0])
                        handleCartModal();
                        numsInCart();
                      }, 2000);
                    });
                  });
                } else {
                  await fetch(`http://localhost:3000/cart`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cartObj),
                  }).then(() => {
                    localStorage.setItem("product_id", item.id);
                    cart.innerHTML = `<button><span class="material-symbols-outlined">check_circle</span></button>`;
                    cart.style.color = "#b8784e";
                    setTimeout(() => {
                      cartModal.style.display = "block";
                      handleCartModal();
                      numsInCart();
                    }, 2000);
                  });
                }
              } else {
                document.location.href = `/products/${item.id}`
              }
            } else {
              document.location.href = "/login";
            }
          });
          const search = document.createElement("div");
          search.className = styles.searchBtn;
          search.innerHTML = `<button><span class="material-symbols-outlined">search</span></button>`;
          actions.appendChild(search);
          const quick_view = document.createElement("div");
          quick_view.textContent = "Quick view";
          quick_view.className = styles.tooltip;
          search.appendChild(quick_view);

          search.addEventListener("click", () => {
            const quickViewModal = document.getElementById(
              `${styles.quickView}`
            );
            quickViewModal.style.display = "block";
            const imgQuickView = document.querySelector(
              `.${styles.imgQuickView}`
            );
            imgQuickView.innerHTML = "";
            const mainImg = document.createElement("img");
            mainImg.width = 420;
            mainImg.src = `./img/${item.img_url[0]}`;
            imgQuickView.appendChild(mainImg);
            const carousel = document.createElement("div");
            carousel.className = styles.carousel;
            imgQuickView.appendChild(carousel);
            const imgItems = item.img_url.slice(0, 3);
            imgItems.forEach((res) => {
              const imgItem = document.createElement("img");
              imgItem.width = 133;
              imgItem.src = `./img/${res}`;
              carousel.appendChild(imgItem);

              imgItem.addEventListener("click", () => {
                mainImg.src = `./img/${res}`;
              });
            });

            const quickViewInfo = document.querySelector(
              `.${styles.quickViewInfo}`
            );
            quickViewInfo.innerHTML = "";
            const name = document.createElement("h2");
            name.textContent = item.name;
            quickViewInfo.appendChild(name);
            const price = document.createElement("div");
            price.className = styles.quickViewPrice;
            quickViewInfo.appendChild(price);
            if (item.promo_price && item.promo_price[0] > 0) {
              price.innerHTML = `<h3>${item.promo_price[0].toLocaleString()}&#8363;</h3>
              <h4><del>${item.price[0].toLocaleString()}&#8363;</del></h4>`;
            } else {
              price.innerHTML = `<h3>${item.price[0].toLocaleString()}&#8363;</h3>`;
            }

            const mo_ta = document.createElement("p");
            mo_ta.textContent = item.mo_ta;
            quickViewInfo.appendChild(mo_ta);

            const sizeBox = document.createElement("div");
            sizeBox.className = styles.sizeBox;
            quickViewInfo.appendChild(sizeBox);
            const sizeBtn = document.createElement("button");
            sizeBtn.className = styles.sizeBtn;
            sizeBtn.textContent = "SIZE";
            sizeBox.appendChild(sizeBtn);
            const sizeItems = document.createElement("div");
            sizeItems.className = styles.sizeItems;
            sizeBox.appendChild(sizeItems);

            let colorChoosed = ''
            if (item.colors.length > 0) {
              const colors = document.createElement("div");
              colors.className = styles.colorBox;
              quickViewInfo.appendChild(colors);

              const colorBtn = document.createElement("button");
              colorBtn.className = styles.colorBtn;
              colorBtn.textContent = "COLOR";
              colors.appendChild(colorBtn);

              const colorItems = document.createElement("div");
              colorItems.className = styles.colorItems;
              colors.appendChild(colorItems);
              item.colors.forEach((color) => {
                const colorItem = document.createElement("button");
                colorItem.textContent = "";
                colorItem.style.backgroundColor = color;
                colorItem.value = color
                colorItems.appendChild(colorItem);

                colorItem.addEventListener("click", () => {
                  colorNodes.forEach((node) => {
                    node.removeAttribute("id");
                  });
                  colorItem.id = styles.colorActive || "";
                  colorChoosed = colorItem.value
                  selectedColorIndex = item.colors.indexOf(colorItem.value)
                  const colorIndex = item.colors.indexOf(color);
                  const imgUrl =
                    colorIndex >= 0 ? item.img_url[colorIndex] : item.img_url[0];
                  mainImg.src = `./img/${imgUrl}`;
                });

                const colorNodes = colorItems.querySelectorAll("button");
                const firstColorItem = colorNodes[0];
                firstColorItem.id = styles.colorActive;
              });
            }
            const quickViewAction = document.createElement("div");
            quickViewAction.className = styles.quickViewAction;
            quickViewInfo.appendChild(quickViewAction);

            const quantityBox = document.createElement("div");
            quantityBox.className = styles.quantityBox;
            quickViewAction.appendChild(quantityBox);
            const quantity = document.createElement("input");
            quantity.className = styles.quantity;
            quantity.value = 1;
            quantityBox.appendChild(quantity);
            const quantityAction = document.createElement("div");
            quantityAction.className = styles.quantityAction;
            quantityBox.appendChild(quantityAction);
            const plus = document.createElement("span");
            plus.innerHTML = `<span class="material-symbols-outlined">add</span>`;
            quantityAction.appendChild(plus);
            plus.addEventListener("click", () => {
              quantity.value++;
            });
            const minus = document.createElement("span");
            minus.innerHTML = `<span class="material-symbols-outlined">remove</span>`;
            quantityAction.appendChild(minus);
            minus.addEventListener("click", () => {
              quantity.value--;
            });
            const addToCartBtn = document.createElement("button");
            addToCartBtn.textContent = "ADD TO CART";
            quickViewAction.appendChild(addToCartBtn);

            let sizeChoosed = ''
            item.sizes.forEach((val) => {
              const size = document.createElement("button");
              size.textContent = val;
              sizeItems.appendChild(size);

              const zeroIndices = [];
              item.quantity.forEach((quantity, index) => {
                if (quantity === 0) {
                  zeroIndices.push(index);
                }
              });

              zeroIndices.forEach((index) => {
                if (sizeItems.childNodes[index] === size) {
                  size.disabled = true;
                  size.style.backgroundColor = 'rgba(9, 9, 9, 0.253)';
                  size.style.color = 'grey';
                  addToCartBtn.disabled = true
                }
              });

              const sizes = document.querySelectorAll(`.${styles.sizeItems} > button`);
              sizes.forEach((val) => {
                val.addEventListener("click", () => {
                  sizes.forEach((node) => {
                    node.style.backgroundColor = "white";
                    node.style.color = "black";
                  });
                  sizeChoosed = val.textContent
                  zeroIndices.forEach((index) => {
                    sizes[index].disabled = true;
                    sizes[index].style.backgroundColor = 'rgba(9, 9, 9, 0.253)';
                    sizes[index].style.color = 'grey';
                  });

                  addToCartBtn.disabled = false;
                  val.style.backgroundColor = "black";
                  val.style.color = "white";
                  const sizeIndex = item.sizes.indexOf(val.textContent);
                  if (item.promo_price[sizeIndex] > 0) {
                    price.innerHTML = `<h3>${item.promo_price[sizeIndex].toLocaleString()}&#8363;</h3>
                  <h4><del>${item.price[sizeIndex].toLocaleString()}&#8363;</del></h4>`;
                  } else {
                    price.innerHTML = `<h3>${item.price[sizeIndex].toLocaleString()}&#8363;</h3>`;
                  }
                });
              });
            });

            addToCartBtn.addEventListener('click', async () => {
              let existingCart = []
              const carts = await getCarts("cart")
              const cartId = carts[carts.length - 1].id + 1
              if (colorChoosed) {
                if (sizeChoosed) {
                  existingCart = carts.filter((res) => res.user_id == userId && res.prod_id == item.id && res.color == colorChoosed && res.size == sizeChoosed)
                } else {
                  existingCart = carts.filter((res) => res.user_id == userId && res.prod_id == item.id && res.color == colorChoosed)
                }
              } else {
                if (sizeChoosed) {
                  existingCart = carts.filter((res) => res.user_id == userId && res.prod_id == item.id && res.size == sizeChoosed)
                } else {
                  existingCart = carts.filter((res) => res.user_id == userId && res.prod_id == item.id)
                }
              }

              let checked = true;
              if (sizeChoosed == '') {
                sizeBtn.style.color = 'red'
                checked = false;
              }
              if (item.colors.length > 0 && colorChoosed == '') {
                colorBtn.style.color = 'red'
                checked = false;
              }
              if (token) {
                if (checked) {
                  if (existingCart.length > 0) {
                    existingCart.forEach(async (val) => {
                      const new_quantity = val.quantity + parseInt(quantity.value);
                      if (val.size) {
                        if (val.color) {
                          await fetch(`http://localhost:3000/cart`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ quantity: new_quantity, prod_id: val.prod_id, user_id: userId, size: val.size, color: val.color })
                          })
                            .then(() => {
                              localStorage.setItem('product_id', val.prod_id)
                              setTimeout(() => {
                                cartModal.style.display = 'block'
                                handleCartModal2(colorChoosed, sizeChoosed)
                                numsInCart()
                              }, 2000)
                            })
                        } else {
                          await fetch(`http://localhost:3000/cart`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ quantity: new_quantity, prod_id: val.prod_id, user_id: userId, size: val.size })
                          })
                            .then(() => {
                              localStorage.setItem('product_id', val.prod_id)
                              setTimeout(() => {
                                cartModal.style.display = 'block'
                                handleCartModal2(colorChoosed, sizeChoosed)
                                numsInCart()
                              }, 2000)
                            })
                        }
                      } else {
                        if (val.color) {
                          await fetch(`http://localhost:3000/cart`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ quantity: new_quantity, prod_id: val.prod_id, user_id: userId, color: val.color })
                          })
                            .then(() => {
                              localStorage.setItem('product_id', val.prod_id)
                              setTimeout(() => {
                                cartModal.style.display = 'block'
                                handleCartModal2(colorChoosed, sizeChoosed)
                                numsInCart()
                              }, 2000)
                            })
                        } else {
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
                                handleCartModal2(colorChoosed, sizeChoosed)
                                numsInCart()
                              }, 2000)
                            })
                        }
                      }
                    })
                  } else {
                    if (item.colors && item.colors.length > 0) {
                      const cart = {
                        id: cartId,
                        prod_id: item.id,
                        quantity: quantity.value,
                        size: sizeChoosed,
                        color: colorChoosed,
                        img_url: item.img_url[selectedColorIndex],
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
                          localStorage.setItem('product_id', item.id)
                          setTimeout(() => {
                            cartModal.style.display = 'block'
                            handleCartModal2(colorChoosed, sizeChoosed)
                            numsInCart()
                          }, 2000)
                        })
                    } else {
                      const cart = {
                        id: cartId,
                        prod_id: item.id,
                        quantity: parseInt(quantity.value),
                        size: sizeChoosed,
                        img_url: selectedColorIndex ? item.img_url[selectedColorIndex] : item.img_url[0],
                        user_id: localStorage.getItem('userId')
                      }
                      try {
                        await fetch(`http://localhost:3000/cart`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(cart)
                        })
                          .then(() => {
                            localStorage.setItem('product_id', item.id)
                            setTimeout(() => {
                              cartModal.style.display = 'block'
                              handleCartModal2('', sizeChoosed)
                              numsInCart()
                            }, 2000)
                          })
                      } catch (err) {
                        console.error(err)
                      }
                    }
                  }
                } else {

                }
              } else {
                document.location.href = '/login'
              }
            })
          });

          const closeModal = document.querySelector(`.${styles.close}`);
          closeModal.addEventListener("click", () => {
            const quickViewModal = document.getElementById(
              `${styles.quickView}`
            );
            quickViewModal.style.display = "none";
          });
          const imgBox = document.createElement("div");
          imgBox.className = styles.imgBox;
          productItem.appendChild(imgBox);

          const img = document.createElement("img");
          img.src = `./img/${item.img_url[0]}`;
          img.width = 388;
          imgBox.appendChild(img);
          const name = document.createElement("h3");
          name.textContent = item.name;
          productItem.appendChild(name);
          if (item.promo_price && item.promo_price[0] > 0) {
            const sale = document.createElement("div");
            sale.className = styles.sale;
            sale.innerHTML = `<p>SALE</p>`;
            productItem.appendChild(sale);
            const priceBox = document.createElement("div");
            priceBox.className = styles.priceBox;
            productItem.appendChild(priceBox);
            const promo_price = document.createElement("h3");
            promo_price.innerHTML = `${item.promo_price[0].toLocaleString()}&#8363;`;
            priceBox.appendChild(promo_price);
            const price = document.createElement("h4");
            price.innerHTML = `<del>${item.price[0].toLocaleString()}&#8363;</del>`;
            priceBox.appendChild(price);
          } else {
            const price = document.createElement("h4");
            price.className = styles.price;
            price.innerHTML = `${item.price[0].toLocaleString()}&#8363;`;
            productItem.appendChild(price);
          }
          const imgThumbnail = document.createElement("div");
          imgThumbnail.className = styles.imgThumbnail;
          productItem.appendChild(imgThumbnail);
          const imgUrls = item.img_url;
          imgUrls.forEach((val) => {
            const image = document.createElement("img");
            image.src = `./img/${val}`;
            image.width = 45;
            imgThumbnail.appendChild(image);
            if (imgUrls[0] == val) {
              image.className = styles.activeImg;
            }
            image.addEventListener("click", (e) => {
              const imgNode = e.target.parentNode.childNodes;
              imgNode.forEach((res) => {
                res.removeAttribute("class");
              });
              image.className = styles.activeImg;
              img.src = `./img/${val}`;
            });
          });
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const handleCountDown = async () => {
      const voucher = await getChosedVoucher("vouchers/chosed");
      const currentDate = new Date();
      const expiredDate = new Date(voucher.expiredDate);
      let times = expiredDate - currentDate;

      if (times > 0) {
        const updateCountdown = () => {
          const d = Math.floor(times / (1000 * 60 * 60 * 24));
          const h = Math.floor(
            (times % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const m = Math.floor((times % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((times % (1000 * 60)) / 1000);

          const daysElement = document.querySelector(".days > span");
          const hoursElement = document.querySelector(".hours > span");
          const minsElement = document.querySelector(".mins > span");
          const secElement = document.querySelector(".sec > span");

          daysElement.innerHTML = (d < 10 ? "0" : "") + d;
          hoursElement.textContent = (h < 10 ? "0" : "") + h;
          minsElement.textContent = (m < 10 ? "0" : "") + m;
          secElement.textContent = (s < 10 ? "0" : "") + s;

          if (d == 0 && h <= 2 && s > 0) {
            const voucherExpiredBox = document.querySelector(
              `.${styles.voucherExpired}`
            );
            voucherExpiredBox.style.display = "block";
            const voucherExpired = document.querySelector(
              `.${styles.voucherExpired} > p`
            );
            voucherExpired.innerHTML = "Ưu đãi sắp hết hạn";
          }

          if (times <= 0) {
            clearInterval(countdownInterval);
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minsElement.textContent = "00";
            secElement.textContent = "00";
          } else {
            times -= 1000;
          }
        };

        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);

        const getVoucherBtn = document.querySelector(`.${styles.countDownBtn}`);
        getVoucherBtn.addEventListener("click", () => {
          clearInterval(countdownInterval);
          getVoucherBtn.setAttribute("id", "animateExtend");
          const textBtn = document.querySelector(
            `.${styles.countDownBtn} > span`
          );
          textBtn.innerHTML = `<span class="material-symbols-outlined">done</span>`;
          const labelexpired = document.querySelector(
            `.${styles.labelexpired}`
          );
          labelexpired.style.marginTop = "30px";
          labelexpired.innerHTML = `
              <img src='./img/voucher.png' width="200px">
              <div>
                <h2>Ưu đãi: ${voucher.discount}% tổng thanh toán</h2>
                <p>Mã: <u>${voucher.voucher_code}</u> </p>
              </div>
            `;
        });
      }
    };

    const productsSale = async () => {
      try {
        const products = await getAllProducts("products");
        const salesData = products
          .filter((item) => {
            return (
              item.hasOwnProperty("promo_price") &&
              typeof item.promo_price !== "undefined" &&
              item.promo_price.length > 0
            );
          })
          .slice(0, 8);
        const productBox = document.querySelector(`.${styles.products_sale}`);
        productBox.innerHTML = "";
        salesData.forEach((item) => {
          const productItem = document.createElement("div");
          productItem.className = styles.productItem;
          productBox.appendChild(productItem);
          productItem.addEventListener("mouseenter", () => {
            actions.style.display = "flex";
          });

          productItem.addEventListener("mouseleave", () => {
            actions.style.display = "none";
          });

          const actions = document.createElement("div");
          actions.className = styles.actionBtns;
          productItem.appendChild(actions);

          const heart = document.createElement("div");
          heart.className = styles.heartBtn;
          heart.innerHTML = `<button><span class="material-symbols-outlined">favorite</span></button>`;
          actions.appendChild(heart);

          const wishlist = document.createElement("div");
          wishlist.textContent = "Add to Wishlist";
          wishlist.className = styles.tooltip;
          heart.appendChild(wishlist);

          const cart = document.createElement("div");
          cart.className = styles.cartBtn;
          cart.innerHTML = `<button><span class="material-symbols-outlined">local_mall</span></button>`;
          actions.appendChild(cart);

          cart.addEventListener("click", async () => {
            if (token) {
              const carts = await getCarts("cart");
              let id = 0;
              if (carts.length > 0) {
                id = carts[carts.length - 1].id + 1;
              } else {
                id = 0;
              }
              const cartObj = {
                id: id,
                prod_id: item.id,
                quantity: 1,
                user_id: userId,
                size: "500g",
              };
              const existingCart = carts.filter(
                (res) => res.user_id == userId && res.prod_id == item.id
              );

              if (existingCart.length > 0) {
                existingCart.forEach(async (val) => {
                  const new_quantity = val.quantity + 1;
                  await fetch(`http://localhost:3000/cart`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      quantity: new_quantity,
                      prod_id: val.prod_id,
                      user_id: userId,
                    }),
                  }).then(() => {
                    localStorage.setItem("product_id", val.prod_id);
                    cart.innerHTML = `<button><span class="material-symbols-outlined">check_circle</span></button>`;
                    cart.style.color = "#b8784e";
                    setTimeout(() => {
                      cartModal.style.display = "block";
                      handleCartModal();
                      numsInCart();
                    }, 2000);
                  });
                });
              } else {
                await fetch(`http://localhost:3000/cart`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(cartObj),
                }).then(() => {
                  localStorage.setItem("product_id", item.id);
                  cart.innerHTML = `<button><span class="material-symbols-outlined">check_circle</span></button>`;
                  cart.style.color = "#b8784e";
                  setTimeout(() => {
                    cartModal.style.display = "block";
                    handleCartModal();
                    numsInCart();
                  }, 2000);
                });
              }
            } else {
              document.location.href = "/login";
            }
          });
          const cartModal = document.querySelector(`.${styles.cartModal}`);
          const closeCartModal = document.querySelector(
            `.${styles.closeCartModal}`
          );
          closeCartModal.addEventListener("click", () => {
            localStorage.removeItem("product_id");
            cartModal.style.display = "none";
          });

          const addToCart = document.createElement("div");
          addToCart.textContent = "Add to Cart";
          addToCart.className = styles.tooltip;
          cart.appendChild(addToCart);

          const search = document.createElement("div");
          search.className = styles.searchBtn;
          search.innerHTML = `<button><span class="material-symbols-outlined">search</span></button>`;
          actions.appendChild(search);
          const quick_view = document.createElement("div");
          quick_view.textContent = "Quick view";
          quick_view.className = styles.tooltip;
          search.appendChild(quick_view);

          search.addEventListener("click", () => {
            const quickViewModal = document.getElementById(
              `${styles.quickView}`
            );
            quickViewModal.style.display = "block";
            const imgQuickView = document.querySelector(
              `.${styles.imgQuickView}`
            );
            imgQuickView.innerHTML = "";
            const mainImg = document.createElement("img");
            mainImg.width = 420;
            mainImg.src = `./img/${item.img_url[0]}`;
            imgQuickView.appendChild(mainImg);
            const carousel = document.createElement("div");
            carousel.className = styles.carousel;
            imgQuickView.appendChild(carousel);
            const imgItems = item.img_url.slice(0, 3);
            imgItems.forEach((res) => {
              const imgItem = document.createElement("img");
              imgItem.width = 133;
              imgItem.src = `./img/${res}`;
              carousel.appendChild(imgItem);
            });

            const quickViewInfo = document.querySelector(
              `.${styles.quickViewInfo}`
            );
            quickViewInfo.innerHTML = "";
            const name = document.createElement("h2");
            name.textContent = item.name;
            quickViewInfo.appendChild(name);
            const price = document.createElement("div");
            price.className = styles.quickViewPrice;
            quickViewInfo.appendChild(price);
            if (item.promo_price && item.promo_price[0] > 0) {
              price.innerHTML = `<h3>${item.promo_price[0].toLocaleString()}&#8363;</h3>
              <h4><del>${item.price[0].toLocaleString()}&#8363;</del></h4>`;
            } else {
              price.innerHTML = `<h3>${item.price[0].toLocaleString()}&#8363;</h3>`;
            }

            const mo_ta = document.createElement("p");
            mo_ta.textContent = item.mo_ta;
            quickViewInfo.appendChild(mo_ta);

            const sizeBox = document.createElement("div");
            sizeBox.className = styles.sizeBox;
            quickViewInfo.appendChild(sizeBox);
            const sizeBtn = document.createElement("button");
            sizeBtn.className = styles.sizeBtn;
            sizeBtn.textContent = "SIZE";
            sizeBox.appendChild(sizeBtn);
            const sizeItems = document.createElement("div");
            sizeItems.className = styles.sizeItems;
            sizeBox.appendChild(sizeItems);

            const colors = document.createElement("div");
            colors.className = styles.colorBox;
            quickViewInfo.appendChild(colors);
            let colorChoosed = ''
            if(item.colors.length > 0){
              const colorBtn = document.createElement("button");
              colorBtn.className = styles.colorBtn;
              colorBtn.textContent = "COLOR";
              colors.appendChild(colorBtn);

              const colorItems = document.createElement("div");
              colorItems.className = styles.colorItems;
              colors.appendChild(colorItems);

              item.colors.forEach((color) => {
                const colorItem = document.createElement("button");
                colorItem.textContent = color;
                colorItem.style.backgroundColor = color;
                colorItems.appendChild(colorItem);

                colorItem.addEventListener("click", () => {
                  colorNodes.forEach((node) => {
                    node.removeAttribute("id");
                  });
                  colorItem.id = styles.colorActive || "";
                  colorChoosed = colorItem.value
                  selectedColorIndex = item.colors.indexOf(colorItem.value)
                  const colorIndex = item.colors.indexOf(color);
                  const imgUrl =
                    colorIndex >= 0 ? item.img_url[colorIndex] : item.img_url[0];
                  mainImg.src = `./img/${imgUrl}`;
                });
                const colorNodes = colorItems.querySelectorAll("button");
                const firstColorItem = colorNodes[0];
                firstColorItem.id = styles.colorActive;
              });
            }

            const quickViewAction = document.createElement("div");
            quickViewAction.className = styles.quickViewAction;
            quickViewInfo.appendChild(quickViewAction);

            const quantityBox = document.createElement("div");
            quantityBox.className = styles.quantityBox;
            quickViewAction.appendChild(quantityBox);
            const quantity = document.createElement("input");
            quantity.className = styles.quantity;
            quantity.value = 1;
            quantityBox.appendChild(quantity);
            const quantityAction = document.createElement("div");
            quantityAction.className = styles.quantityAction;
            quantityBox.appendChild(quantityAction);
            const plus = document.createElement("span");
            plus.innerHTML = `<span class="material-symbols-outlined">add</span>`;
            quantityAction.appendChild(plus);
            plus.addEventListener("click", () => {
              quantity.value++;
            });
            const minus = document.createElement("span");
            minus.innerHTML = `<span class="material-symbols-outlined">remove</span>`;
            quantityAction.appendChild(minus);
            minus.addEventListener("click", () => {
              quantity.value--;
            });
            const addToCartBtn = document.createElement("button");
            addToCartBtn.textContent = "ADD TO CART";
            quickViewAction.appendChild(addToCartBtn);

            let sizeChoosed = item.sizes[0]
            item.sizes.forEach((val) => {
              const size = document.createElement("button");
              size.textContent = val;
              sizeItems.appendChild(size);
              const zeroIndices = [];
              item.quantity.forEach((quantity, index) => {
                if (quantity === 0) {
                  zeroIndices.push(index);
                }
              });

              zeroIndices.forEach((index) => {
                if (sizeItems.childNodes[index] === size) {
                  size.disabled = true;
                  size.style.backgroundColor = 'rgba(9, 9, 9, 0.253)';
                  size.style.color = 'grey';
                  addToCartBtn.disabled = true
                }
              });

              const sizes = document.querySelectorAll(`.${styles.sizeItems} > button`);
              sizes.forEach((val) => {
                val.addEventListener("click", () => {
                  sizes.forEach((node) => {
                    node.style.backgroundColor = "white";
                    node.style.color = "black";
                  });
                  sizeChoosed = val.textContent
                  zeroIndices.forEach((index) => {
                    sizes[index].disabled = true;
                    sizes[index].style.backgroundColor = 'rgba(9, 9, 9, 0.253)';
                    sizes[index].style.color = 'grey';
                  });

                  addToCartBtn.disabled = false;
                  val.style.backgroundColor = "black";
                  val.style.color = "white";
                  const sizeIndex = item.sizes.indexOf(val.textContent);
                  if (item.promo_price[sizeIndex] > 0) {
                    price.innerHTML = `<h3>${item.promo_price[sizeIndex].toLocaleString()}&#8363;</h3>
                  <h4><del>${item.price[sizeIndex].toLocaleString()}&#8363;</del></h4>`;
                  } else {
                    price.innerHTML = `<h3>${item.price[sizeIndex].toLocaleString()}&#8363;</h3>`;
                  }
                });
              });
            });

            addToCartBtn.addEventListener('click', async () => {
              let existingCart = []
              const carts = await getCarts("cart")
              const cartId = carts[carts.length - 1].id + 1
              if (colorChoosed) {
                if (sizeChoosed) {
                  existingCart = carts.filter((res) => res.user_id == userId && res.prod_id == item.id && res.color == colorChoosed && res.size == sizeChoosed)
                } else {
                  existingCart = carts.filter((res) => res.user_id == userId && res.prod_id == item.id && res.color == colorChoosed)
                }
              } else {
                if (sizeChoosed) {
                  existingCart = carts.filter((res) => res.user_id == userId && res.prod_id == item.id && res.size == sizeChoosed)
                } else {
                  existingCart = carts.filter((res) => res.user_id == userId && res.prod_id == item.id)
                }
              }

              let checked = true;
              if (sizeChoosed == '') {
                sizeBtn.style.color = 'red'
                checked = false;
              }
              if (item.colors.length > 0 && colorChoosed == '') {
                colorBtn.style.color = 'red'
                checked = false;
              }
              if (token) {
                if (checked) {
                  if (existingCart.length > 0) {
                    existingCart.forEach(async (val) => {
                      const new_quantity = val.quantity + parseInt(quantity.value);
                      if (val.size) {
                        if (val.color) {
                          await fetch(`http://localhost:3000/cart`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ quantity: new_quantity, prod_id: val.prod_id, user_id: userId, size: val.size, color: val.color })
                          })
                            .then(() => {
                              localStorage.setItem('product_id', val.prod_id)
                              setTimeout(() => {
                                cartModal.style.display = 'block'
                                handleCartModal2(colorChoosed, sizeChoosed)
                                numsInCart()
                              }, 2000)
                            })
                        } else {
                          await fetch(`http://localhost:3000/cart`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ quantity: new_quantity, prod_id: val.prod_id, user_id: userId, size: val.size })
                          })
                            .then(() => {
                              localStorage.setItem('product_id', val.prod_id)
                              setTimeout(() => {
                                cartModal.style.display = 'block'
                                handleCartModal2(colorChoosed, sizeChoosed)
                                numsInCart()
                              }, 2000)
                            })
                        }
                      } else {
                        if (val.color) {
                          await fetch(`http://localhost:3000/cart`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ quantity: new_quantity, prod_id: val.prod_id, user_id: userId, color: val.color })
                          })
                            .then(() => {
                              localStorage.setItem('product_id', val.prod_id)
                              setTimeout(() => {
                                cartModal.style.display = 'block'
                                handleCartModal2(colorChoosed, sizeChoosed)
                                numsInCart()
                              }, 2000)
                            })
                        } else {
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
                                handleCartModal2(colorChoosed, sizeChoosed)
                                numsInCart()
                              }, 2000)
                            })
                        }
                      }
                    })
                  } else {
                    if (item.colors && item.colors.length > 0) {
                      const cart = {
                        id: cartId,
                        prod_id: item.id,
                        quantity: quantity.value,
                        size: sizeChoosed,
                        color: colorChoosed,
                        img_url: item.img_url[selectedColorIndex],
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
                          localStorage.setItem('product_id', item.id)
                          setTimeout(() => {
                            cartModal.style.display = 'block'
                            handleCartModal2(colorChoosed, sizeChoosed)
                            numsInCart()
                          }, 2000)
                        })
                    } else {
                      const cart = {
                        id: cartId,
                        prod_id: item.id,
                        quantity: parseInt(quantity.value),
                        size: sizeChoosed,
                        img_url: selectedColorIndex ? item.img_url[selectedColorIndex] : item.img_url[0],
                        user_id: localStorage.getItem('userId')
                      }
                      try {
                        await fetch(`http://localhost:3000/cart`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(cart)
                        })
                          .then(() => {
                            localStorage.setItem('product_id', item.id)
                            setTimeout(() => {
                              cartModal.style.display = 'block'
                              handleCartModal2('', sizeChoosed)
                              numsInCart()
                            }, 2000)
                          })
                      } catch (err) {
                        console.error(err)
                      }
                    }
                  }
                }
              } else {
                document.location.href = '/login'
              }
            })
          });

          const closeModal = document.querySelector(`.${styles.close}`);
          closeModal.addEventListener("click", () => {
            const quickViewModal = document.getElementById(
              `${styles.quickView}`
            );
            quickViewModal.style.display = "none";
          });
          const imgBox = document.createElement("div");
          imgBox.className = styles.imgBox;
          productItem.appendChild(imgBox);

          const img = document.createElement("img");
          img.src = `./img/${item.img_url[0]}`;
          img.width = 388;
          imgBox.appendChild(img);
          const name = document.createElement("h3");
          name.textContent = item.name;
          productItem.appendChild(name);
          if (item.promo_price && item.promo_price[0] > 0) {
            const sale = document.createElement("div");
            sale.className = styles.sale;
            sale.innerHTML = `<p>SALE</p>`;
            productItem.appendChild(sale);
            const priceBox = document.createElement("div");
            priceBox.className = styles.priceBox;
            productItem.appendChild(priceBox);
            const promo_price = document.createElement("h3");
            promo_price.innerHTML = `${item.promo_price[0].toLocaleString()}&#8363;`;
            priceBox.appendChild(promo_price);
            const price = document.createElement("h4");
            price.innerHTML = `<del>${item.price[0].toLocaleString()}&#8363;</del>`;
            priceBox.appendChild(price);
          } else {
            const price = document.createElement("h4");
            price.className = styles.price;
            price.innerHTML = `${item.price[0].toLocaleString()}&#8363;`;
            productItem.appendChild(price);
          }
          const imgThumbnail = document.createElement("div");
          imgThumbnail.className = styles.imgThumbnail;
          productItem.appendChild(imgThumbnail);
          const imgUrls = item.img_url;
          imgUrls.forEach((val) => {
            const image = document.createElement("img");
            image.src = `./img/${val}`;
            image.width = 45;
            imgThumbnail.appendChild(image);
            if (imgUrls[0] == val) {
              image.className = styles.activeImg;
            }
            image.addEventListener("click", (e) => {
              const imgNode = e.target.parentNode.childNodes;
              imgNode.forEach((res) => {
                res.removeAttribute("class");
              });
              image.className = styles.activeImg;
              img.src = `./img/${val}`;
            });
          });
        });

        const draggableBtns = document.querySelectorAll(
          `.${styles.draggable} > button`
        );

        draggableBtns.forEach((val) => {
          val.addEventListener("click", () => {
            draggableBtns.forEach((res) => {
              res.removeAttribute("id");
            });
            val.setAttribute("id", styles.slide_active);
            if (val.textContent == 2) {
              productBox.style.transform = "translate3d(-1250px, 0px, 0px)";
            } else if (val.textContent == 3) {
              productBox.style.transform = "translate3d(-1670px, 0px, 0px)";
            } else {
              productBox.style.transform = "translate3d(0px, 0px, 0px)";
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
    };

    const showNews = async () => {
      const news = await getNewsApproved("news");
      const news_data = news
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .slice(0, 8);

      const slider_button = document.querySelector(`.${styles.slider_button}`);
      const prevButton = document.querySelector(`.${styles.prev_button}`);
      const nextButton = document.querySelector(`.${styles.next_button}`);
      const newsBox = document.querySelector(`.${styles.news_box}`);

      newsBox.addEventListener("mouseenter", () => {
        prevButton.style.display = "block";
        nextButton.style.display = "block";
      });

      newsBox.addEventListener("mouseleave", () => {
        prevButton.style.display = "none";
        nextButton.style.display = "none";
      });
      const sliderContainer = document.querySelector(
        `.${styles.slider_container}`
      );
      sliderContainer.innerHTML = "";
      news_data.forEach((item) => {
        const slider_slide = document.createElement("div");
        slider_slide.className = styles.newsItem;
        sliderContainer.appendChild(slider_slide);
        const imgBox = document.createElement("div");
        imgBox.className = styles.imgBox;
        slider_slide.appendChild(imgBox);
        const img = document.createElement("img");
        img.src = `./img/${item.img_url}`;
        img.width = 560;
        imgBox.appendChild(img);

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const dateBox = document.createElement("div");
        dateBox.className = styles.dateBox;
        slider_slide.appendChild(dateBox);
        const day = document.createElement("h4");
        day.innerHTML = new Date(item.createdAt).getDate();
        dateBox.appendChild(day);
        const dateHr = document.createElement("hr");
        dateBox.appendChild(dateHr);
        const month = document.createElement("h3");
        const month_text = monthNames[new Date(item.createdAt).getMonth()];
        month.innerHTML = month_text;
        dateBox.appendChild(month);
        const info_blog = document.createElement("div");
        info_blog.className = styles.info_blog;
        slider_slide.appendChild(info_blog);
        const category_blog = document.createElement("a");
        category_blog.className = styles.category_blog;
        category_blog.textContent = "NEWS";
        category_blog.href = "/blog";
        info_blog.appendChild(category_blog);
        const title_blog = document.createElement("a");
        title_blog.className = styles.title_blog;
        title_blog.href = `/blog?id=${item.id}`;
        title_blog.innerHTML = `<h4>${item.title}</h4>`;
        info_blog.appendChild(title_blog);
      });

      let slideIndex = 0;

      prevButton.addEventListener("click", () => {
        if (slideIndex == 0) {
          slideIndex = 2;
          const slideWidth = sliderContainer.clientWidth;
          sliderContainer.style.transform = `translateX(-${slideIndex * slideWidth
            }px)`;
        } else {
          slideIndex =
            (slideIndex - 1 + sliderContainer.children.length) %
            sliderContainer.children.length;
          updateSliderPosition();
        }
      });

      nextButton.addEventListener("click", () => {
        slideIndex = (slideIndex + 1) % sliderContainer.children.length;

        if (slideIndex > 2) {
          slideIndex = 0;
          sliderContainer.style.transform = `translateX(0px)`;
        } else {
          updateSliderPosition();
        }
      });

      function updateSliderPosition() {
        const slideWidth = sliderContainer.clientWidth;
        sliderContainer.style.transform = `translateX(-${slideIndex * slideWidth
          }px)`;
      }

      const categoryImg = document.querySelectorAll(
        `.${styles.homeCol2} > div > img`
      );
      const handleMouseEnter = (e) => {
        const parentNode = e.target.parentNode;
        parentNode.classList.add(styles.hovered);
      };

      const handleMouseLeave = (e) => {
        const parentNode = e.target.parentNode;
        parentNode.classList.remove(styles.hovered);
      };
      categoryImg.forEach((item) => {
        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    const handleCartModal = async () => {
      const productId = localStorage.getItem("product_id");
      const product = await getDetail(productId);
      if (product) {
        const cart = await getCarts("cart");
        const products_by_categoryId = await getProductsByCategoryId(product.cat_id);
        const data = cart.filter(
          (item) => item.prod_id == productId && item.user_id == userId
        );
        const myCart = cart.filter((item) => item.user_id == userId);
        let total = 0;
        for (const res of myCart) {
          const product = await getDetail(res.prod_id);
          if (product.sizes.indexOf(res.size) > 0) {
            if (product.promo_price) {
              const sizeIndex = product.sizes.indexOf(res.size);
              const itemTotal = product.promo_price[sizeIndex]
                ? res.quantity * product.promo_price[sizeIndex]
                : res.quantity * product.price[sizeIndex];
              total += itemTotal;
            } else {
              const sizeIndex = product.sizes.indexOf(res.size);
              const itemTotal = res.quantity * product.price[sizeIndex];
              total += itemTotal;
            }
          } else {
            if (product.promo_price) {
              const itemTotal = product.promo_price[0]
                ? res.quantity * product.promo_price[0]
                : res.quantity * product.price[0];
              total += itemTotal;
            } else {
              const itemTotal = res.quantity * product.price[0];
              total += itemTotal;
            }
          }
        }
        data.forEach(async (item) => {
          const imgCart = document.querySelector(`.${styles.imgCart}`);
          imgCart.innerHTML = "";
          const cartInfo = document.querySelector(`.${styles.cartInfo}`);
          cartInfo.innerHTML = "";
          const confirm = document.createElement("h2");
          confirm.innerHTML = `
        <span class="material-symbols-outlined">
          done
        </span>
        <span>Added to cart successfully!</span>
        `;
          imgCart.appendChild(confirm);
          const img = document.createElement("img");
          img.src = `./img/${product.img_url[0]}`;
          img.width = 200;
          imgCart.appendChild(img);
          const product_name = document.createElement("h3");
          product_name.textContent = product.name;
          imgCart.appendChild(product_name);

          let sizeIndex = 0;
          cart.forEach((val) => {
            sizeIndex = product.sizes.indexOf(val.size);
          });

          if (
            product.promo_price &&
            sizeIndex == 0 &&
            product.promo_price[0] > 0
          ) {
            const price = document.createElement("h4");
            price.className = styles.cart_price;
            price.innerHTML = `PRICE: <b>${product.promo_price[0].toLocaleString()}&#8363;</b>`;
            imgCart.appendChild(price);
          } else {
            const price = document.createElement("h4");
            price.className = styles.cart_price;
            price.innerHTML = `PRICE: <b>${product.price[
              sizeIndex
            ].toLocaleString()}&#8363;</b>`;
            imgCart.appendChild(price);
          }
          const quantity = document.createElement("h4");
          quantity.className = styles.cart_quantity;
          quantity.innerHTML = `QTY: <b>${item.quantity}</b>`;
          imgCart.appendChild(quantity);

          let cal_subtotal = 0;
          if (product.promo_price && product.promo_price[sizeIndex] > 0) {
            cal_subtotal = item.quantity * product.promo_price[sizeIndex];
          } else {
            cal_subtotal = item.quantity * product.price[0];
          }
          const subtotal = document.createElement("h4");
          subtotal.className = styles.cart_subtotal;
          subtotal.innerHTML = `SUBTOTAL: <b>${cal_subtotal.toLocaleString()}&#8363;</b>`;
          imgCart.appendChild(subtotal);

          if (myCart.length < 2) {
            const items_count = document.createElement("p");
            items_count.className = styles.items_count;
            items_count.innerHTML = `There are <span>${myCart.length}</span> item in your cart`;
            cartInfo.appendChild(items_count);
          } else {
            const items_count = document.createElement("p");
            items_count.className = styles.items_count;
            items_count.innerHTML = `There are <span>${myCart.length}</span> items in your cart`;
            cartInfo.appendChild(items_count);
          }
          const cartModal = document.querySelector(`.${styles.cartModal}`);
          const cart_total = document.createElement("p");
          cart_total.className = styles.total_price;
          cart_total.innerHTML = `CART TOTALS: <span>${total.toLocaleString()}&#8363;</span>`;
          cartInfo.appendChild(cart_total);
          const continue_shopping = document.createElement("button");
          continue_shopping.className = styles.continue_shopping;
          continue_shopping.textContent = "CONTINUE SHOPPING";
          continue_shopping.addEventListener("click", () => {
            cartModal.style.display = "none";
          });
          cartInfo.appendChild(continue_shopping);

          const go_to_cart = document.createElement("button");
          go_to_cart.className = styles.go_to_cart;
          go_to_cart.textContent = "GO TO CART";
          cartInfo.appendChild(go_to_cart);
          const cart_condition = document.createElement("div");
          cart_condition.className = styles.cart_condition;
          cartInfo.appendChild(cart_condition);
          const condition_checkbox = document.createElement("input");
          condition_checkbox.type = "checkbox";
          cart_condition.appendChild(condition_checkbox);
          const condition_label = document.createElement("label");
          condition_label.textContent = "Agree with term and conditional.";
          cart_condition.appendChild(condition_label);

          const checkOutBtn = document.createElement("input");
          checkOutBtn.type = "button";
          checkOutBtn.value = "PROCEED TO CHECKOUT";
          checkOutBtn.className = styles.checkOutBtn;
          checkOutBtn.disabled = true;
          checkOutBtn.style.opacity = 0.7;
          cartInfo.appendChild(checkOutBtn);

          condition_checkbox.addEventListener("change", () => {
            if (condition_checkbox.checked == true) {
              checkOutBtn.disabled = false;
              checkOutBtn.style.opacity = 1;
            } else {
              checkOutBtn.disabled = true;
              checkOutBtn.style.opacity = 0.7;
            }
          });

          const cartCol2 = document.querySelector(`.${styles.cartCol2}`);
          cartCol2.innerHTML = "";
          const suggested_products = document.createElement("div");
          cartCol2.appendChild(suggested_products);
          const suggested_products_title = document.createElement("div");
          suggested_products_title.className = styles.suggested_products_title;
          suggested_products.appendChild(suggested_products_title);
          const also_like_title = document.createElement("h3");
          also_like_title.textContent = "Suggested products:";
          suggested_products_title.appendChild(also_like_title);
          const also_like_btns = document.createElement("div");
          also_like_btns.className = styles.also_like_btns;
          suggested_products_title.appendChild(also_like_btns);
          const prevBtn = document.createElement("button");
          prevBtn.className = styles.also_like_prevBtn;
          prevBtn.innerHTML = `<span class="material-symbols-outlined">arrow_back_ios</span>`;
          prevBtn.childNodes[0].setAttribute("id", styles.arrow_active);
          also_like_btns.appendChild(prevBtn);
          const nextBtn = document.createElement("button");
          nextBtn.className = styles.also_like_nextBtn;
          nextBtn.innerHTML = `<span class="material-symbols-outlined">arrow_forward_ios</span>`;
          also_like_btns.appendChild(nextBtn);

          const buttons = document.querySelectorAll(
            `.${styles.also_like_btns} > button`
          );
          buttons.forEach((item) => {
            item.addEventListener("click", () => {
              buttons.forEach((val) => {
                val.childNodes[0].removeAttribute("id");
              });
              item.childNodes[0].setAttribute("id", styles.arrow_active);
            });
          });
          const suggected_prod_container = document.createElement("div");
          suggected_prod_container.className = styles.suggected_prod_container;
          cartCol2.appendChild(suggected_prod_container);
          products_by_categoryId.forEach((item) => {
            const suggested_prod_box = document.createElement("div");
            suggested_prod_box.className = styles.box;
            suggected_prod_container.appendChild(suggested_prod_box);
            const img = document.createElement("img");
            img.src = `./img/${item.img_url[0]}`;
            img.width = 200;
            suggested_prod_box.appendChild(img);
            const name = document.createElement("h4");
            name.textContent = item.name;
            suggested_prod_box.appendChild(name);
            if (item.promo_price && item.promo_price.length > 0 && item.promo_price[0] > 0) {

              price_box.innerHTML = `<h4>${item.promo_price[0].toLocaleString()}</h4>
              <span><del>${item.price[0].toLocaleString()}</del></span>`

              const discount = document.createElement('div')
              discount.className = styles.discount
              const percent = 100 - Math.floor(((item.promo_price[0] * 100) / item.price[0]))
              discount.textContent = '-' + percent + '%'
              suggested_prod_box.appendChild(discount)
            } else {
              price_box.innerHTML = `<h3>${item.price[0].toLocaleString()}</h3>`
            }
          });

          let slideIndex = 0;

          prevBtn.addEventListener("click", () => {
            if (slideIndex == 0) {
              slideIndex = 2;
              const slideWidth = suggected_prod_container.clientWidth;
              suggected_prod_container.style.transform = `translateX(-${slideIndex * slideWidth
                }px)`;
            } else {
              slideIndex =
                (slideIndex - 1 + suggected_prod_container.children.length) %
                suggected_prod_container.children.length;
              updateSliderPosition();
            }
          });

          nextBtn.addEventListener("click", () => {
            slideIndex =
              (slideIndex + 1) % suggected_prod_container.children.length;

            if (slideIndex > 2) {
              slideIndex = 0;
              suggected_prod_container.style.transform = `translateX(0px)`;
            } else {
              updateSliderPosition();
            }
          });

          function updateSliderPosition() {
            const slideWidth = suggected_prod_container.clientWidth - 205;
            suggected_prod_container.style.transform = `translateX(-${slideIndex * slideWidth
              }px)`;
          }
        });
      }
    };

    const handleCartModal2 = async (colorItem, sizeItem) => {
      const imgCart = document.querySelector(`.${styles.imgCart}`)
      const cartInfo = document.querySelector(`.${styles.cartInfo}`)
      imgCart.innerHTML = ''
      cartInfo.innerHTML = ''
      const productId = localStorage.getItem('product_id')
      const product = await getDetail(productId)
      if (product) {
        const cart = await getCarts("cart")
        let data = '';
        if (colorItem !== '') {
          if (sizeItem !== '') {
            data = cart.filter((item) => item.prod_id == productId && item.user_id == userId && item.color == colorItem && item.size == sizeItem)
          } else {
            data = cart.filter((item) => item.prod_id == productId && item.user_id == userId && item.color == colorItem)
          }
        } else {
          if (sizeItem !== '') {
            data = cart.filter((item) => item.prod_id == productId && item.user_id == userId && item.size == sizeItem)
          } else {
            data = cart.filter((item) => item.prod_id == productId && item.user_id == userId)
          }
        }
        const myCart = cart.filter((item) => item.user_id == userId)
        data.forEach(async (item) => {
          const confirm = document.createElement('h2')
          confirm.innerHTML = `
        <span class="material-symbols-outlined">
          done
        </span>
        <span>Added to cart successfully!</span>
        `
          imgCart.appendChild(confirm)
          if (selectedColorIndex == '') {
            const img = document.createElement('img')
            img.src = `../../img/${product.img_url[0]}`
            img.width = 200
            imgCart.appendChild(img)
          } else {
            const img = document.createElement('img')
            img.src = `../../img/${product.img_url[selectedColorIndex]}`
            img.width = 200
            imgCart.appendChild(img)
          }
          const product_name = document.createElement('h3')
          product_name.textContent = product.name
          imgCart.appendChild(product_name)
          let sizeIndex = 0;
          data.forEach((val) => {
            sizeIndex = product.sizes.indexOf(val.size)
          })
          if (product.promo_price && product.promo_price.length > 0) {
            const price = document.createElement('h4')
            price.className = styles.cart_price
            price.innerHTML = `PRICE: <b>${product.promo_price[sizeIndex].toLocaleString()}&#8363;</b>`
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
            if (product.sizes.indexOf(res.size) > 0) {
              const sizeIndex = product.sizes.indexOf(res.size)
              const itemTotal = product.promo_price && product.promo_price.length > 0 ? res.quantity * product.promo_price[sizeIndex] : res.quantity * product.price[sizeIndex];
              total += itemTotal;
            } else {
              const itemTotal = product.promo_price && product.promo_price.length > 0 ? res.quantity * product.promo_price[sizeIndex] : res.quantity * product.price[0];
              total += itemTotal;
            }
          }
          const quantity = document.createElement('h4')
          quantity.className = styles.cart_quantity
          quantity.innerHTML = `QTY: <b>${item.quantity}</b>`
          imgCart.appendChild(quantity)

          let cal_subtotal = 0;
          if (product.promo_price && product.promo_price.length > 0) {
            cal_subtotal = item.quantity * product.promo_price[sizeIndex]
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
          go_to_cart.addEventListener('click', () => {
            document.location.href = '/cart'
          })
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
          const catId = product.cat_id;
          const products_by_categoryId = await getProductsByCategoryId(catId.toString())
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
            const price_box = document.createElement('div')
            price_box.className = styles.price_box
            suggested_prod_box.appendChild(price_box)
            if (item.promo_price && item.promo_price.length > 0 && item.promo_price[0] > 0) {

              price_box.innerHTML = `<h4>${item.promo_price[0].toLocaleString()}</h4>
              <span><del>${item.price[0].toLocaleString()}</del></span>`

              const discount = document.createElement('div')
              discount.className = styles.discount
              const percent = 100 - Math.floor(((item.promo_price[0] * 100) / item.price[0]))
              discount.textContent = '-' + percent + '%'
              suggested_prod_box.appendChild(discount)
            } else {
              price_box.innerHTML = `<h3>${item.price[0].toLocaleString()}</h3>`
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
    }

    showNews();
    productsSale();
    fetchData();
    setIsLoading(false);
    handleCountDown();
  }, []);

  return (
    <div>
      {isLoading ? (
        <MyLoader />
      ) : (
        <>
          <div id={styles.home}>
            <div className={styles.homeCol1}>
              <div className={styles.carousel}>
                {slides.map((slide, index) => (
                  <>
                    <div
                      key={index}
                      className={`${styles.slide} ${index === currentIndex ? styles.active : ""
                        }`}
                    >
                      <img src={slide.imageUrl} alt={slide.alt} />
                    </div>
                    <div
                      key={index}
                      className={`${styles.slide} ${styles.bgTitle} ${index === currentIndex ? styles.active : ""
                        }`}
                    >
                      <h3 key={index} className={slide.h3_animate}>
                        {slide.h3}
                      </h3>
                      <h1 key={index} className={slide.h1_animate}>
                        {slide.h1}
                      </h1>
                      <h2 className={slide.h2_animate}>{slide.h2}</h2>
                      <button className={slide.button_animate}>
                        {slide.button}
                      </button>
                    </div>
                  </>
                ))}
              </div>
              <button className={styles.prevBtn} onClick={handlePrevClick}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className={styles.nextBtn} onClick={handleNextClick}>
                <span className="material-symbols-outlined">chevron_right</span>
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
              <div className={styles.newProductBox}></div>
            </div>

            <div id={styles.countDown}>
              <div className={styles.count_down_v1}>
                <img src="./img/count-down.webp" width="550px" height="682px" />
              </div>
              <div className={styles.count_down_v2}>
                <img
                  src="./img/bgcount-downt.webp"
                  height="682px"
                  width="1400px"
                />
                <div className={styles.countDownContent}>
                  <div className={styles.countDownTitle}>
                    <p>A NATURAL COFFEE</p>
                    <button>Enjoy The Coffee</button>
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
              <div className={styles.slider_container}></div>
              <button
                className={`${styles.slider_button} ${styles.prev_button}`}
              >
                <span className="material-symbols-outlined">
                  arrow_back_ios
                </span>
              </button>
              <button
                className={`${styles.slider_button} ${styles.next_button}`}
              >
                <span className="material-symbols-outlined">
                  arrow_forward_ios
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {isLoading ? (
        <MyLoader />
      ) : (
        <div id={styles.quickView} className={styles.quickViewModal}>
          <div className={styles.quickViewContent}>
            <div className={styles.imgQuickView}></div>
            <div className={styles.quickViewInfo}></div>
            <span className={styles.close}>&times;</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <MyLoader />
      ) : (
        <div id={styles.cartModal} className={styles.cartModal}>
          <div className={styles.cartContent}>
            <div className={styles.cartCol1}>
              <div className={styles.imgCart}></div>
              <div className={styles.cartInfo}></div>
              <span className={styles.closeCartModal}>&times;</span>
            </div>
            <div className={styles.cartCol2}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
