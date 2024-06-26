import React, { useEffect } from 'react'
import styles from './Search.module.css'
import { getData } from '../../api'
import { useSearch } from '../../contexts/SearchContext'


const Search = () => {
    const { open, setSearchOpen } = useSearch()
    useEffect(() => {
        const handleSearch = async () => {
            const products = await getData('products')
            const search_input = document.querySelector(`.${styles.search_input}`)
            const search_eveland = document.querySelector(`.${styles.search_eveland}`)
            if(open === true){
                search_eveland.style.display = 'block'
                search_eveland.setAttribute('id', styles.search_box_opened)
            }
            const close_search = document.querySelector(`.${styles.close_search}`)
            close_search.addEventListener('click', () => {
                setSearchOpen(false)
                search_eveland.setAttribute('id', styles.search_box_closed)
            })
            const search_results = document.querySelector(`.${styles.search_results}`)
            search_input.addEventListener('input', (e) => {
                const filteredData = products.filter((item) => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
                if(e.target.value == ''){
                    search_results.innerHTML = ''
                    const search_msg = document.createElement('span')
                    search_msg.className = styles.search_msg
                    search_msg.textContent = 'You must enter at least 2 characters.'
                    search_results.appendChild(search_msg)
                }else{
                    search_results.innerHTML = ''
                    const product_search_results = document.createElement('div')
                    product_search_results.className = styles.product_search_results
                    search_results.appendChild(product_search_results)
                    filteredData.forEach((item) => {
                        const product_info = document.createElement('div')
                        product_info.className = styles.product_info
                        product_search_results.appendChild(product_info)
                        const product_img = document.createElement('img')
                        product_img.src = `../../img/${item.img_url[0]}`
                        product_img.width = 100
                        product_info.appendChild(product_img)
                        const product_info_row2 = document.createElement('div')
                        product_info_row2.className = styles.product_info_row2
                        product_info.appendChild(product_info_row2)
                        const product_title = document.createElement('h4')
                        product_title.textContent = item.name
                        product_info_row2.appendChild(product_title)
                        const product_price = document.createElement('h3')
                        product_price.innerHTML = `${item.price[0].toLocaleString()}`
                        product_info_row2.appendChild(product_price)
                    })
                }
            })
        }
        handleSearch()
    }, [open])
    return (
        <>
            <div className={styles.search_eveland}>
                <div className={styles.close_search}>
                    <span className="material-symbols-outlined">
                        close
                    </span>
                </div>
                <div className={styles.search_drawer}>
                    <h2 className={styles.search_title}>Start typing and hit Enter</h2>
                    <input type="text" placeholder='Search anything' className={styles.search_input} />
                    <div className={styles.search_results}>
                        <span className={styles.search_msg}>You must enter at least 2 characters.</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Search