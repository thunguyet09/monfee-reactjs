import React, { useState, useEffect, useRef } from 'react'
import styles from './Search.module.css'
import { getAllProducts } from '../../api'
const Search = () => {
    useEffect(() => {
        const handleSearch = async () => {
            const products = await getAllProducts()
            const search_input = document.querySelector(`.${styles.search_input}`)
            const search_eveland = document.querySelector(`.${styles.search_eveland}`)
            const search_results = document.querySelector(`.${styles.search_results}`)
            search_input.addEventListener('input', (e) => {
                const filteredData = products.filter((item) => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
                if(e.target.value == ''){
                    search_results.innerHTML = '<span className={styles.search_img}>You must enter at least 2 characters.</span>'
                }else{

                }
            })
        }
        handleSearch()
    }, [])
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