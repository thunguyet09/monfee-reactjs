import React, { useState, useEffect, useRef, useContext } from 'react'
import styles from './Product.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { getData, product_pagination } from '../../api';

const Product = () => {
    const [itemsPerPage, setItemsPerPage] = useState(8)
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
                dropdown.style.zIndex = 19
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
        const product_items = document.querySelector(`.${styles.product_grid_parent}`)
        let page = 1;
        const colors = async () => {
            const products = await getData("products")
            const uniqueColors = products.reduce((colorSet, item) => {
                item.colors.forEach(color => colorSet.add(color));
                return colorSet;
            }, new Set())
            const list_color = document.querySelector(`.${styles.list_color}`)
            list_color.innerHTML = ''
            uniqueColors.forEach((item) => {
                const color_item = document.createElement('li')
                color_item.addEventListener('click', () => {
                    const color_choose = color_item.childNodes[0].title;
                    const products_filtered = products.filter((val) => {
                        return val.colors.includes(color_choose);
                    });
                    product_items.innerHTML = ''
                    showProductGrid(products_filtered)
                    product_items.style.justifyContent = 'flex-start'
                    product_items.style.columnGap = '30px'
                })
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
                button.addEventListener('click', () => {
                    const color_choose = button.childNodes[0].placeholder;
                    const products_filtered = products.filter((val) => {
                        return val.colors.includes(color_choose);
                    });
                    product_items.innerHTML = ''
                    showProductGrid(products_filtered)
                    product_items.style.justifyContent = 'flex-start'
                    product_items.style.columnGap = '30px'
                });
                const color_item = document.createElement('input')
                color_item.style.backgroundColor = item
                color_item.type = 'button'
                color_item.placeholder = item
                filter_colors.appendChild(button)
                button.appendChild(color_item)
            })

            const price_list = document.querySelector(`.${styles.list_price}`)
            const filter_price = document.querySelector(`.${styles.filter_price}`)
            price_list.innerHTML = ''
            filter_price.innerHTML = ''
            const minPrice = products.reduce((min, product) => {
                const price = product.price[0]
                return price < min ? price : min;
            }, Infinity);

            const price_list_v1 = document.createElement('li')
            const price_v1 = minPrice + 80000
            price_list_v1.innerHTML = `<a>${minPrice.toLocaleString()} - ${price_v1.toLocaleString()}</a>`
            filter_price.appendChild(price_list_v1)
            price_list_v1.addEventListener('click', async () => {
                let data = await product_pagination(page, items_per_page)
                const filter_products = products.filter((val) => {
                    if (val.promo_price[0] > 0) {
                        return val.promo_price[0] >= minPrice && val.promo_price[0] <= price_v1;
                    } else {
                        return val.price[0] >= minPrice && val.price[0] <= price_v1;
                    }
                });
                product_items.style.justifyContent = 'flex-start'
                product_items.style.columnGap = '25px'
                data.products = filter_products
                product_items.innerHTML = ''
                showProductGrid(data.products)
            })
            price_list.appendChild(price_list_v1)
            const price_list_v2 = document.createElement('li')
            const price_v2 = price_v1 + 80000
            price_list_v2.innerHTML = `<a>${price_v1.toLocaleString()} - ${price_v2.toLocaleString()}</a>`
            filter_price.appendChild(price_list_v2)
            price_list_v2.addEventListener('click', async () => {
                let data = await product_pagination(page, itemsPerPage)
                const filter_products = products.filter((val) => {
                    if (val.promo_price[0] > 0) {
                        return val.promo_price[0] >= price_v1 && val.promo_price[0] <= price_v2;
                    } else {
                        return val.price[0] >= price_v1 && val.price[0] <= price_v2;
                    }
                });
                product_items.style.justifyContent = 'flex-start'
                product_items.style.columnGap = '25px'
                data.products = filter_products
                product_items.innerHTML = ''
                showProductGrid(data.products)
            })
            price_list.appendChild(price_list_v2)
            const price_list_v3 = document.createElement('li')
            const price_v3 = price_v2 + 80000
            price_list_v3.innerHTML = `<a>${price_v2.toLocaleString()} - ${price_v3.toLocaleString()}</a>`
            filter_price.appendChild(price_list_v3)
            price_list_v3.addEventListener('click', async () => {
                let data = await product_pagination(page, itemsPerPage)
                const filter_products = products.filter((val) => {
                    if (val.promo_price[0] > 0) {
                        return val.promo_price[0] >= price_v2 && val.promo_price[0] <= price_v3;
                    } else {
                        return val.price[0] >= price_v2 && val.price[0] <= price_v3;
                    }
                });
                product_items.style.justifyContent = 'flex-start'
                product_items.style.columnGap = '25px'
                data.products = filter_products
                product_items.innerHTML = ''
                showProductGrid(data.products)
            })
            price_list.appendChild(price_list_v3)
            const price_list_v4 = document.createElement('li')
            const price_v4 = price_v3 + 80000
            price_list_v4.innerHTML = `<a>${price_v3.toLocaleString()} - ${price_v4.toLocaleString()}</a>`
            filter_price.appendChild(price_list_v4)
            price_list_v4.addEventListener('click', async () => {
                let data = await product_pagination(page, itemsPerPage)
                const filter_products = products.filter((val) => {
                    if (val.promo_price[0] > 0) {
                        return val.promo_price[0] >= price_v3 && val.promo_price[0] <= price_v4;
                    } else {
                        return val.price[0] >= price_v3 && val.price[0] <= price_v4;
                    }
                });
                product_items.style.justifyContent = 'flex-start'
                product_items.style.columnGap = '25px'
                data.products = filter_products
                product_items.innerHTML = ''
                showProductGrid(data.products)
            })
            price_list.appendChild(price_list_v4)
            const price_list_v5 = document.createElement('li')
            price_list_v5.innerHTML = `<a>Over ${price_v4.toLocaleString()}</a>`
            filter_price.appendChild(price_list_v5)
            price_list_v5.addEventListener('click', async () => {
                let data = await product_pagination(page, itemsPerPage)
                const filter_products = products.filter((val) => {
                    if (val.promo_price[0] > 0) {
                        return val.promo_price[0] > price_v4;
                    } else {
                        return val.price[0] > price_v4;
                    }
                });
                product_items.style.justifyContent = 'flex-start'
                product_items.style.columnGap = '25px'
                data.products = filter_products
                product_items.innerHTML = ''
                showProductGrid(data.products)
            })
            price_list.appendChild(price_list_v5)
        }

        const priceFilter = async () => {
            try {
                const products = await getData('products');
                const filter = document.querySelector(`.${styles.col_content} > .${styles.filter_price}`);

                const minPrice = products.reduce((min, product) => {
                    const price = product.price?.[0] || Infinity;
                    return price < min ? price : min;
                }, Infinity);

                const priceRangeNode = document.createElement('li');
                const price_v1 = minPrice + 80000;
                priceRangeNode.innerHTML = `<a>${minPrice.toLocaleString()} - ${price_v1.toLocaleString()}</a>`;

                priceRangeNode.addEventListener('click', async () => {
                    try {
                        const data = await product_pagination(page, itemsPerPage);
                        const filteredProducts = products.filter((product) => {
                            const price = product.promo_price?.[0] || product.price?.[0];
                            return price >= minPrice && price <= price_v1;
                        });

                        product_items.style.justifyContent = 'flex-start';
                        product_items.style.columnGap = '25px';
                        data.products = filteredProducts;
                        console.log(data.products)
                        product_items.innerHTML = ''
                        showProductGrid(data.products);
                    } catch (error) {
                        console.error('Error in click event handler:', error);
                    }
                });

                filter.appendChild(priceRangeNode);

                const price_node_v2 = document.createElement('li')
                const price_v2 = price_v1 + 80000
                price_node_v2.innerHTML = `<a>${price_v1.toLocaleString()} - ${price_v2.toLocaleString()}</a>`
                filter.appendChild(price_node_v2)
                price_node_v2.addEventListener('click', async () => {
                    let data = await product_pagination(page, itemsPerPage)
                    const filter_products = products.filter((val) => {
                        if (val.promo_price[0] > 0) {
                            return val.promo_price[0] >= price_v1 && val.promo_price[0] <= price_v2;
                        } else {
                            return val.price[0] >= price_v1 && val.price[0] <= price_v2;
                        }
                    });
                    product_items.style.justifyContent = 'flex-start'
                    product_items.style.columnGap = '25px'
                    data.products = filter_products
                    product_items.innerHTML = ''
                    showProductGrid(data.products)
                })

                const price_node_v3 = document.createElement('li')
                const price_v3 = price_v2 + 80000
                price_node_v3.innerHTML = `<a>${price_v2.toLocaleString()} - ${price_v3.toLocaleString()}</a>`
                filter.appendChild(price_node_v3)
                price_node_v3.addEventListener('click', async () => {
                    let data = await product_pagination(page, itemsPerPage)
                    const filter_products = products.filter((val) => {
                        if (val.promo_price[0 > 0]) {
                            return val.promo_price[0] >= price_v2 && val.promo_price[0] <= price_v3;
                        } else {
                            return val.price[0] >= price_v2 && val.price[0] <= price_v3;
                        }
                    });
                    product_items.style.justifyContent = 'flex-start'
                    product_items.style.columnGap = '25px'
                    data.products = filter_products
                    product_items.innerHTML = ''
                    showProductGrid(data.products)
                })
                const price_node_v4 = document.createElement('li')
                const price_v4 = price_v3 + 80000
                price_node_v4.innerHTML = `<a>${price_v3.toLocaleString()} - ${price_v4.toLocaleString()}</a>`
                filter.appendChild(price_node_v4)
                price_node_v4.addEventListener('click', async () => {
                    let data = await product_pagination(page, itemsPerPage)
                    const filter_products = products.filter((val) => {
                        if (val.promo_price[0] > 0) {
                            return val.promo_price[0] >= price_v3 && val.promo_price[0] <= price_v4;
                        } else {
                            return val.price[0] >= price_v3 && val.price[0] <= price_v4;
                        }
                    });
                    product_items.style.justifyContent = 'flex-start'
                    product_items.style.columnGap = '25px'
                    data.products = filter_products
                    product_items.innerHTML = ''
                    showProductGrid(data.products)
                })

                const price_node_v5 = document.createElement('li')
                price_node_v5.innerHTML = `<a>Over ${price_v4.toLocaleString()}</a>`
                filter.appendChild(price_node_v5)
                price_node_v5.addEventListener('click', async () => {
                    let data = await product_pagination(page, itemsPerPage)
                    const filter_products = products.filter((val) => {
                        if (val.promo_price[0] > 0) {
                            return val.promo_price[0] > price_v4;
                        } else {
                            return val.price[0] > price_v4;
                        }
                    });
                    product_items.style.justifyContent = 'flex-start'
                    product_items.style.columnGap = '25px'
                    data.products = filter_products
                    product_items.innerHTML = ''
                    showProductGrid(data.products)
                })

            } catch (err) {
                console.error('Error in price filter', err)
            }
        }

        const getApi = async (page, itemsPerPage) => {
            let data;
            data = await product_pagination(page, itemsPerPage)
            pages(data.totalPages)
            product_items.innerHTML = ''
            showProductGrid(data.products)
        }

        const showProductGrid = async (products) => {
            product_items.innerHTML = ''
            const prod_per = document.querySelectorAll(`.${styles.prod_per} > button`)
            const product_item_arr = []
            products.forEach((item) => {
                const row = document.createElement('div')
                row.className = styles.row
                row.addEventListener('click', () => {
                    document.location.href = `/products/${item.id}`
                })
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
                if (item.colors.length > 0) {
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
                if (item.promo_price && item.promo_price.length > 0 && item.promo_price[0] > 0) {
                    const price_box = document.createElement('div')
                    price_box.className = styles.price_box
                    row.appendChild(price_box)
                    const price = document.createElement('h5')
                    price.innerHTML = `<del>${item.price[0].toLocaleString()}</del>`
                    price_box.appendChild(price)
                    const promo_price = document.createElement('h4')
                    promo_price.textContent = item.promo_price[0].toLocaleString()
                    price_box.appendChild(promo_price)
                } else {
                    const price = document.createElement('h4')
                    price.className = styles.price_item
                    price.innerHTML = `${item.price[0].toLocaleString()}`
                    row.appendChild(price)
                }

                const product_colors = document.createElement('div')
                row.appendChild(product_colors)
                if (item.colors.length > 0) {
                    product_colors.className = styles.product_colors
                    item.colors.forEach((val) => {
                        const color_btn = document.createElement('button')
                        color_btn.style.backgroundColor = val
                        product_colors.appendChild(color_btn)
                    })
                }
                if (item.promo_price && item.promo_price.length > 0 && item.promo_price[0] > 0) {
                    const discount = document.createElement('div')
                    discount.className = styles.discount
                    const percent = 100 - Math.floor(((item.promo_price[0] * 100) / item.price[0]))
                    discount.innerHTML = `-${percent}%`
                    row.appendChild(discount)
                }

                if (localStorage.getItem('column')) {
                    const column = localStorage.getItem('column')
                    if (column == '4') {
                        const icon_action = document.querySelectorAll(`.${styles.product_icon_action} > button > span`)
                        const icon_action_btn = document.querySelectorAll(`.${styles.product_icon_action} > button`)
                        icon_action.forEach((icon) => {
                            icon.style.fontSize = '20px'
                        })

                        icon_action_btn.forEach((btn) => {
                            btn.style.width = '48px'
                            btn.style.height = '48px'
                        })
                        product_items.style.gridTemplateColumns = 'auto auto auto auto'
                        img_link.width = 280
                        row.style.width = '280px'
                        product_icon_action.style.left = '15px'
                        product_icon_action.style.bottom = '30%'
                        product_colors.style.left = '38%'
                        title_product.style.fontSize = '17px'
                    } else if (column == '3') {
                        const icon_action = document.querySelectorAll(`.${styles.product_icon_action} > button > span`)
                        const icon_action_btn = document.querySelectorAll(`.${styles.product_icon_action} > button`)
                        icon_action.forEach((icon) => {
                            icon.style.fontSize = '22px'
                        })

                        icon_action_btn.forEach((btn) => {
                            btn.style.width = '55px'
                            btn.style.height = '55px'
                        })
                        product_items.style.gridTemplateColumns = 'auto auto auto'
                        img_link.width = 385
                        row.style.width = '385px'
                        product_icon_action.style.left = '55px'
                        product_icon_action.style.bottom = '40%'
                        product_colors.style.left = '42%'
                        title_product.style.fontSize = '18px'
                    } else if (column == '2') {
                        const icon_action = document.querySelectorAll(`.${styles.product_icon_action} > button > span`)
                        const icon_action_btn = document.querySelectorAll(`.${styles.product_icon_action} > button`)
                        icon_action.forEach((icon) => {
                            icon.style.fontSize = '26px'
                        })

                        icon_action_btn.forEach((btn) => {
                            btn.style.width = '60px'
                            btn.style.height = '60px'
                        })
                        product_items.style.gridTemplateColumns = 'auto auto'
                        img_link.width = 590
                        row.style.width = '590px'
                        product_icon_action.style.left = '140px'
                        product_icon_action.style.bottom = '40%'
                        product_colors.style.left = '42%'
                        title_product.style.fontSize = '20px'
                    } else if (column == '5') {
                        const icon_action = document.querySelectorAll(`.${styles.product_icon_action} > button > span`)
                        const icon_action_btn = document.querySelectorAll(`.${styles.product_icon_action} > button`)
                        icon_action.forEach((icon) => {
                            icon.style.fontSize = '17px'
                        })

                        icon_action_btn.forEach((btn) => {
                            btn.style.width = '35px'
                            btn.style.height = '35px'
                        })
                        product_items.style.gridTemplateColumns = 'auto auto auto auto auto'
                        img_link.width = 225
                        row.style.width = '225px'
                        product_icon_action.style.left = '7px'
                        product_icon_action.style.bottom = '30%'
                        product_colors.style.left = '38%'
                        title_product.style.fontSize = '15px'
                    }
                }
                prod_per.forEach((item) => {
                    item.addEventListener('click', () => {
                        prod_per.forEach((val) => {
                            val.removeAttribute('id')
                        })
                        item.setAttribute('id', styles.size_active)
                        const column = item.textContent
                        localStorage.setItem('column', column)
                        if (localStorage.getItem('column')) {
                            const column = localStorage.getItem('column')
                            if (column == '2') {
                                const icon_action = document.querySelectorAll(`.${styles.product_icon_action} > button > span`)
                                const icon_action_btn = document.querySelectorAll(`.${styles.product_icon_action} > button`)
                                icon_action.forEach((icon) => {
                                    icon.style.fontSize = '26px'
                                })

                                icon_action_btn.forEach((btn) => {
                                    btn.style.width = '60px'
                                    btn.style.height = '60px'
                                })
                                product_items.style.gridTemplateColumns = 'auto auto'
                                img_link.width = 590
                                row.style.width = '590px'
                                product_icon_action.style.left = '140px'
                                product_icon_action.style.bottom = '40%'
                                product_colors.style.left = '42%'
                                title_product.style.fontSize = '20px'
                            } else if (column == '3') {
                                const icon_action = document.querySelectorAll(`.${styles.product_icon_action} > button > span`)
                                const icon_action_btn = document.querySelectorAll(`.${styles.product_icon_action} > button`)
                                icon_action.forEach((icon) => {
                                    icon.style.fontSize = '22px'
                                })

                                icon_action_btn.forEach((btn) => {
                                    btn.style.width = '55px'
                                    btn.style.height = '55px'
                                })
                                product_items.style.gridTemplateColumns = 'auto auto auto'
                                img_link.width = 385
                                row.style.width = '385px'
                                product_icon_action.style.left = '55px'
                                product_icon_action.style.bottom = '40%'
                                product_colors.style.left = '42%'
                                title_product.style.fontSize = '18px'
                            } else if (column == '5') {
                                const icon_action = document.querySelectorAll(`.${styles.product_icon_action} > button > span`)
                                const icon_action_btn = document.querySelectorAll(`.${styles.product_icon_action} > button`)
                                icon_action.forEach((icon) => {
                                    icon.style.fontSize = '17px'
                                })

                                icon_action_btn.forEach((btn) => {
                                    btn.style.width = '35px'
                                    btn.style.height = '35px'
                                })
                                product_items.style.gridTemplateColumns = 'auto auto auto auto auto'
                                img_link.width = 225
                                row.style.width = '225px'
                                product_icon_action.style.left = '7px'
                                product_icon_action.style.bottom = '30%'
                                product_colors.style.left = '38%'
                                title_product.style.fontSize = '15px'
                            } else if (column == '4') {
                                const icon_action = document.querySelectorAll(`.${styles.product_icon_action} > button > span`)
                                const icon_action_btn = document.querySelectorAll(`.${styles.product_icon_action} > button`)
                                icon_action.forEach((icon) => {
                                    icon.style.fontSize = '20px'
                                })

                                icon_action_btn.forEach((btn) => {
                                    btn.style.width = '48px'
                                    btn.style.height = '48px'
                                })
                                product_items.style.gridTemplateColumns = 'auto auto auto auto'
                                img_link.width = 280
                                row.style.width = '280px'
                                product_icon_action.style.left = '15px'
                                product_icon_action.style.bottom = '30%'
                                product_colors.style.left = '38%'
                                title_product.style.fontSize = '17px'
                            }
                        }
                    })
                })
            })
        }

        const prev_page = document.querySelector(`.${styles.prev_page}`)
        const first_page = document.querySelector(`.${styles.first_page}`)
        if (page == 1) {
            first_page.style.display = 'none'
            prev_page.style.display = 'none'
        } else {
            first_page.style.display = 'flex'
            prev_page.style.display = 'flex'
        }
        const pages = async (totalPages) => {
            const last_page = document.querySelector(`.${styles.last_page}`)
            const next_page = document.querySelector(`.${styles.next_page}`)
            const first_page = document.querySelector(`.${styles.first_page}`)
            const prev_page = document.querySelector(`.${styles.prev_page}`)
            let last_page_data = await product_pagination(totalPages, itemsPerPage)
            let first_page_data = await product_pagination(1, itemsPerPage)
            const total_pages = document.querySelector(`.${styles.total_pages}`)
            total_pages.innerHTML = ''
            const filter_size = document.querySelectorAll(`.${styles.filter_size} > button`)
            const list_size = document.querySelectorAll(`.${styles.list_size} > li > a`)
            filter_size.forEach((item) => {
                item.addEventListener('click', async () => {
                    let data = await product_pagination(page, itemsPerPage)
                    const filteredData = data.products.filter((val) => {
                        return val.sizes.includes(item.textContent)
                    })
                    product_items.style.justifyContent = 'flex-start'
                    product_items.style.columnGap = '25px'
                    product_items.innerHTML = ''
                    showProductGrid(filteredData)
                })
            })

            list_size.forEach((item) => {
                item.addEventListener('click', async () => {
                    let data = await product_pagination(page, itemsPerPage)
                    const filteredData = data.products.filter((val) => {
                        return val.sizes.includes(item.title)
                    })
                    product_items.style.justifyContent = 'flex-start'
                    product_items.style.columnGap = '25px'
                    product_items.innerHTML = ''
                    showProductGrid(filteredData)
                })
            })
            next_page.addEventListener('click', async () => {
                const next_page_number = parseInt(page) + 1
                page = next_page_number;
                if (next_page_number > totalPages) {
                    page = totalPages
                    product_items.innerHTML = ''
                    showProductGrid(last_page_data.products)
                } else {
                    total_pages.childNodes.forEach((p) => {
                        p.removeAttribute('id');
                    });

                    const currentPage = Array.from(total_pages.childNodes).find((p) => parseInt(p.title) == next_page_number);
                    if (currentPage) {
                        currentPage.setAttribute('id', styles.page_active);
                        let data = await product_pagination(next_page_number, itemsPerPage)
                        product_items.innerHTML = ''
                        showProductGrid(data.products)
                    }
                    if (page == 1) {
                        first_page.style.display = 'none'
                        prev_page.style.display = 'none'
                    } else {
                        first_page.style.display = 'flex'
                        prev_page.style.display = 'flex'
                    }
                }
            })
            last_page.addEventListener('click', () => {
                showProductGrid(last_page_data.products)
                total_pages.childNodes.forEach((p) => {
                    p.removeAttribute('id');
                });

                const currentPage = Array.from(total_pages.childNodes).find((p) => parseInt(p.title) == totalPages);
                if (currentPage) {
                    currentPage.setAttribute('id', styles.page_active);
                }
                first_page.style.display = 'flex'
                prev_page.style.display = 'flex'
            })

            prev_page.addEventListener('click', async () => {
                const prev_page_number = parseInt(page) - 1
                page = prev_page_number;
                if (prev_page_number <= 1) {
                    page = 1;
                    total_pages.childNodes.forEach((p) => {
                        p.removeAttribute('id');
                    });

                    const currentPage = Array.from(total_pages.childNodes).find((p) => parseInt(p.title) == 1);
                    if (currentPage) {
                        currentPage.setAttribute('id', styles.page_active);
                    }
                    product_items.innerHTML = ''
                    showProductGrid(first_page_data.products)
                } else {
                    total_pages.childNodes.forEach((p) => {
                        p.removeAttribute('id');
                    });

                    const currentPage = Array.from(total_pages.childNodes).find((p) => parseInt(p.title) == prev_page_number);
                    if (currentPage) {
                        currentPage.setAttribute('id', styles.page_active);
                        let data = await product_pagination(prev_page_number, itemsPerPage)
                        product_items.innerHTML = ''
                        showProductGrid(data.products)
                    }
                    if (page == 1) {
                        first_page.style.display = 'none'
                        prev_page.style.display = 'none'
                    } else {
                        first_page.style.display = 'flex'
                        prev_page.style.display = 'flex'
                    }
                }
            })

            first_page.addEventListener('click', () => {
                product_items.innerHTML = ''
                showProductGrid(first_page_data.products)
                total_pages.childNodes.forEach((p) => {
                    p.removeAttribute('id');
                });

                const currentPage = Array.from(total_pages.childNodes).find((p) => parseInt(p.title) == 1);
                if (currentPage) {
                    currentPage.setAttribute('id', styles.page_active);
                }
                first_page.style.display = 'flex'
                prev_page.style.display = 'flex'
            })


            for (let i = 1; i <= totalPages; i++) {
                const page_link = document.createElement('a')
                page_link.title = `${i}`
                page_link.innerHTML = `0${i}`
                total_pages.appendChild(page_link)
                if (i == 1) {
                    page_link.setAttribute('id', styles.page_active)
                }

                page_link.addEventListener('click', () => {
                    total_pages.childNodes.forEach((item) => {
                        item.removeAttribute('id')
                    })
                    page = page_link.title
                    if (page == 1) {
                        first_page.style.display = 'none'
                        prev_page.style.display = 'none'
                    } else {
                        first_page.style.display = 'flex'
                        prev_page.style.display = 'flex'
                    }
                    page_link.setAttribute('id', styles.page_active)
                    setTimeout(async () => {
                        if (itemsPerPage) {
                            let data = await product_pagination(i, itemsPerPage)
                            product_items.innerHTML = ''
                            showProductGrid(data.products)

                        } else {
                            let data = await product_pagination(i, 12)
                            product_items.innerHTML = ''
                            showProductGrid(data.products)
                        }
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

        const rowsPerPage = () => {
            const row_active = document.querySelector(`.${styles.row_active}`)
            const active = document.querySelector(`.${styles.row_active} > span:first-child`)
            const rows_icon = document.querySelector(`.${styles.row_active} > span:last-child`)
            const row_list = document.querySelector(`.${styles.row_list} > ul`)
            const rows = document.querySelectorAll(`.${styles.row_list} > ul > li > a`)
            active.textContent = itemsPerPage
            let flag = false;
            row_active.addEventListener('click', () => {
                flag = !flag;
                if (flag) {
                    row_list.style.opacity = 1
                    rows_icon.innerHTML = `<span class="material-symbols-outlined">arrow_drop_up</span>`
                } else {
                    row_list.style.opacity = 0
                    rows_icon.innerHTML = `<span class="material-symbols-outlined">arrow_drop_down</span>`
                }
            })
            rows.forEach((item) => {
                item.addEventListener('click', async () => {
                    active.textContent = item.textContent
                    const items_per_page = item.textContent
                    setItemsPerPage(items_per_page)
                    const data = await product_pagination(page, items_per_page)
                    product_items.innerHTML = ''
                    showProductGrid(data.products)
                    pages(data.totalPages)
                })
            })
        }

        const sortProducts = () => {
            const dropdown = document.querySelectorAll(`.${styles.dropdown} > li`)
            dropdown.forEach((item) => {
                item.addEventListener('click', async () => {
                    const startIndex = (parseInt(page) - 1) * parseInt(itemsPerPage);
                    const endIndex = startIndex + parseInt(itemsPerPage);
                    const products = await getData('products')
                    let sortedData = []
                    if (item.value == '1') {
                        const sorted = products.sort((a, b) => b.sales - a.sales)
                        sortedData = sorted.slice(startIndex, endIndex)
                        console.log(endIndex,sortedData)
                    } else if (item.value == '2') {
                        const sorted = products.sort((a, b) => a.name - b.name)
                        sortedData = sorted.slice(startIndex, endIndex)
                    } else if (item.value == '3') {
                        const sorted = products.sort((a, b) => b.price[0] - a.price[0]);
                        sortedData = sorted.slice(startIndex, endIndex)
                    } else if (item.value == '4') {
                        const sorted = products.sort((a, b) => a.price[0] - b.price[0]);
                        sortedData = sorted.slice(startIndex, endIndex)
                    } else if (item.value == '5') {
                        const sorted = products.sort((a, b) => {
                            return new Date(b.createdAt) - new Date(a.createdAt)
                        })
                        sortedData = sorted.slice(startIndex, endIndex)
                    } else if (item.value == '6') {
                        const sorted = products.sort((a, b) => {
                            return new Date(a.createdAt) - new Date(b.createdAt)
                        })
                        sortedData = sorted.slice(startIndex, endIndex)
                    }

                    showProductGrid(sortedData)
                })
            })
        }

        sortProducts()
        rowsPerPage()
        handleData()
        getApi(1, itemsPerPage)
        colors()
        priceFilter()
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
                            <span className="material-symbols-outlined">chevron_right</span>
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
                        <button className={styles.prevBtn}><span className="material-symbols-outlined">arrow_back_ios</span></button>
                        <button className={styles.nextBtn}><span className="material-symbols-outlined">arrow_forward_ios</span></button>
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
                                    <li><a href='/'>Home</a></li>
                                    <li><a href=''>Shop</a></li>
                                    <li><a href='/'>Featured</a></li>
                                    <li><a href='/'>Pages</a></li>
                                    <li><a href='/'>Element</a></li>
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
                                        <span className="material-symbols-outlined">arrow_drop_down</span>
                                    </button>
                                    <ul className={styles.dropdown}>
                                        <li value="0">Featured</li>
                                        <li value="1">Best Selling</li>
                                        <li value="2">Alphabetically, A-Z</li>
                                        <li value="3">Price, high to low</li>
                                        <li value="4">Price, low to high</li>
                                        <li value="5">Date, old to new</li>
                                        <li value="6">Date, new to old</li>
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
                            <div className={styles.pagi_nav}>
                                <div className={styles.pagination}>
                                    <a className={styles.first_page}>
                                        <span className="material-symbols-outlined">
                                            keyboard_double_arrow_left
                                        </span>
                                    </a>
                                    <a className={styles.prev_page}>
                                        <span className="material-symbols-outlined">
                                            arrow_back_ios_new
                                        </span>
                                    </a>
                                    <div className={styles.total_pages}></div>
                                    <a className={styles.next_page}>
                                        <span className="material-symbols-outlined">
                                            arrow_forward_ios
                                        </span>
                                    </a>
                                    <a className={styles.last_page}>
                                        <span className="material-symbols-outlined">
                                            keyboard_double_arrow_right
                                        </span>
                                    </a>
                                </div>
                                <div className={styles.rows_per_page}>
                                    <h4>Items per page:</h4>
                                    <div className={styles.row_list}>
                                        <button className={styles.row_active}>
                                            <span>12</span>
                                            <span className="material-symbols-outlined">
                                                arrow_drop_down
                                            </span>
                                        </button>
                                        <ul>
                                            <li><a>6</a></li>
                                            <li><a>8</a></li>
                                            <li><a>10</a></li>
                                            <li><a>12</a></li>
                                        </ul>
                                    </div>
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