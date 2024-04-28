import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDribbble, faBehance, faInstagram } from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.css'

const Footer = () => {

  return (
    <div id={styles.footer}>
        <div className={styles.footerRow1}>
            <div className={styles.footerCol1}>
                <img src="../img/monfee-logo.png" width="320px"/>
                <span>Subscribe our newsletter and get discount 30% off</span>
                <div>
                    <FontAwesomeIcon icon={faTwitter} />
                    <FontAwesomeIcon icon={faDribbble} />
                    <FontAwesomeIcon icon={faBehance} />
                    <FontAwesomeIcon icon={faInstagram} />
                </div>
            </div>
            <div className={styles.footerCol2}>
                <h3>Customer Care</h3>
                <hr></hr>
                <div>
                    <p>About Us</p>
                    <p>Privacy Policy</p>
                    <p>Terms & Conditions</p>
                    <p>Products Return</p>
                    <p>Wholesale Policy</p>
                </div>
            </div>
            <div className={styles.footerCol2}>
                <h3>Quick Shop</h3>
                <hr></hr>
                <div>
                    <p>Pagination</p>
                    <p>Terms & Conditions</p>
                    <p>Contact</p>
                    <p>Accessories</p>
                    <p>Term of use</p>
                </div>
            </div>
            <div className={styles.footerCol2}>
                <h3>Company</h3>
                <hr></hr>
                <div>
                    <p>Help Center</p>
                    <p>Address Store</p>
                    <p>Privacy Policy</p>
                    <p>Receivers & Amplifiers</p>
                    <p>Clothings</p>
                </div>
            </div>
        </div>
        <div className={styles.footerRow2}>
            <p>© Copyright 2020 | MonfeeStore By <b>Thu Nguyet</b></p>
        </div>
    </div>
  )
}

export default Footer