import React, { useState, useEffect } from 'react';
import orders from './Orders.module.css'
const Orders = () => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
    if(isMounted){

    }
    return() => {
      setIsMounted(false)
    }
  }, [isMounted])
  return (
    <div id={orders.orders}>
      <div className={orders.orders}>
        <div className={orders.bread_crumb}>
            <a href="/">Home</a>
            <span className="material-symbols-outlined">chevron_right</span>
            <a href="/account">User Profile</a>
            <span className="material-symbols-outlined">chevron_right</span>
            <a>Orders</a>
        </div>
        <div className={orders.heading}>
           <div className={orders.title}>
            <h2>Order History</h2>
            <span>Check the status of recent orders, manage returns, and discover similar products</span>
           </div>
            <div className={orders.spending}>
              <h2>Spending:</h2>
              <h3></h3>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;