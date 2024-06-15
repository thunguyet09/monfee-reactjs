import React, { useState, useEffect } from 'react';
import orders from './Orders.module.css'
import { getCategoryDetail, getData, getDetail, getOrderStatusById, orderDetail } from '../../api';
const Orders = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [spending, setSpending] = useState(0)
  useEffect(() => {
    setIsMounted(true)
    const renderData = async () => {
      const userId = localStorage.getItem('userId')
      const content = document.querySelector(`.${orders.content}`)
      if (isMounted) {
        const orderData = await getData('orders')
        const myOrders = orderData.filter((item) => item.user_id == userId).reverse()
        if (myOrders.length == 0) {
          content.innerHTML = `<div class='${orders.noOrder}'>You haven't placed any orders yet.</div>`
        }
        let total = 0
        myOrders.forEach((item) => {
          total += item.total
        })
        setSpending(total)
        myOrders.forEach(async (item) => {
          const orderBox = document.createElement('div')
          orderBox.className = orders.orderBox
          content.appendChild(orderBox)
          const orderBox_title = document.createElement('div')
          orderBox_title.className = orders.orderBox_title
          orderBox.appendChild(orderBox_title)
          const orderBox_title_row1 = document.createElement('div')
          orderBox_title_row1.className = orders.orderBox_title_row1
          orderBox_title.appendChild(orderBox_title_row1)
          const orderBox_title_row2 = document.createElement('div')
          orderBox_title_row2.className = orders.orderBox_title_row2
          orderBox_title.appendChild(orderBox_title_row2)
          const orderNumber = document.createElement('div')
          orderNumber.innerHTML = `
          <h4>Order Number</h4>
          <h5>${item._id}</h5>`
          orderBox_title_row1.appendChild(orderNumber)
          const date_placed = document.createElement('div')
          date_placed.innerHTML = `
          <h4>Date Placed</h4>
          <h5>${item.date}</h5>`
          orderBox_title_row1.appendChild(date_placed)
          const total_amount = document.createElement('div')
          total_amount.innerHTML = `
          <h4>Total Amount</h4>
          <h5>${item.total.toLocaleString()}&#8363;</h5>`
          orderBox_title_row1.appendChild(total_amount)

          const view_order = document.createElement('button')
          view_order.className = orders.view_order
          view_order.textContent = 'View Order'
          orderBox_title_row2.appendChild(view_order)
          const orderDetailData = await orderDetail(item.order_id)
          const mainOrderInfo = document.createElement('div')
          mainOrderInfo.className = orders.mainOrderInfo
          orderBox.appendChild(mainOrderInfo)
          orderDetailData.forEach(async (res) => {
            const detail = await getDetail(res.prod_id)
            const sizeIndex = detail.sizes.indexOf(res.size)
            const categoryDetail = await getCategoryDetail(detail.cat_id)
            const orderBox_body = document.createElement('div')
            orderBox_body.className = orders.orderBox_body
            mainOrderInfo.appendChild(orderBox_body)
            const orderBox_body_col1 = document.createElement('div')
            orderBox_body_col1.className = orders.orderBox_body_col1
            orderBox_body.appendChild(orderBox_body_col1)
            const product_info = document.createElement('div')
            product_info.className = orders.product_info
            orderBox_body_col1.appendChild(product_info)
            const order_actions = document.createElement('div')
            order_actions.className = orders.order_actions
            orderBox_body_col1.appendChild(order_actions)
            const subtotal = document.createElement('div')
            subtotal.className = orders.subtotal
            subtotal.innerHTML = `${res.subtotal.toLocaleString()}&#8363;`
            order_actions.appendChild(subtotal)
            const view_product = document.createElement('a')
            view_product.className = orders.view_product
            view_product.textContent = 'View Product'
            view_product.href = `/products/${res.prod_id}`
            order_actions.appendChild(view_product)
            const prod_img = document.createElement('img')
            prod_img.className = orders.prod_img
            prod_img.src = `../../img/${detail.img_url[sizeIndex]}`
            prod_img.width = '150'
            product_info.appendChild(prod_img)
            const prod_content = document.createElement('div')
            prod_content.className = orders.prod_content
            product_info.appendChild(prod_content)
            const prod_name = document.createElement('h3')
            prod_name.textContent = res.product_name
            prod_content.appendChild(prod_name)
            if (categoryDetail) {
              const catalog = document.createElement('h4')
              catalog.textContent = categoryDetail.name
              prod_content.appendChild(catalog)
            }
            const quantity = document.createElement('p')
            quantity.innerHTML = `Qty - ${res.product_quantity}`
            prod_content.appendChild(quantity)
            const prod_attribute = document.createElement('p')
            prod_attribute.innerHTML = `${res.size} ${res.color ? '/' + `<button style="background-color: ${res.color}" class="${orders.colorBtn}"></button>` : ''}`
            prod_content.appendChild(prod_attribute)
            const order_detail_id = document.createElement('p')
            order_detail_id.innerHTML = `Order Id - <span>#${res._id}</span>`
            prod_content.appendChild(order_detail_id)
          })

          const orderBox_body_col2 = document.createElement('div')
          orderBox_body_col2.className = orders.orderBox_body_col2
          mainOrderInfo.appendChild(orderBox_body_col2)
          const statusData = await getOrderStatusById(item.status.toString())
          const orderStatusBox = document.createElement('div')
          orderStatusBox.className = orders.orderStatusBox
          orderBox_body_col2.appendChild(orderStatusBox)
          const order_status = document.createElement('button')
          order_status.className = orders.order_status
          if (item.status == 0) {
            order_status.style.backgroundColor = 'rgb(34,34,221,0.15)'
            order_status.style.color = '#4959A5'
          } else if (item.status == 1) {
            order_status.style.backgroundColor = '#FFEADD'
            order_status.style.color = '#C70039'
          } else if (item.status == 2) {
            order_status.style.backgroundColor = '#DDF2FD'
            order_status.style.color = '#427D9D'
          } else if (item.status == 3) {
            order_status.style.backgroundColor = '#FAFDD6'
            order_status.style.color = '#7A9D54'
          } else {
            order_status.style.backgroundColor = '#D8D9DA'
            order_status.style.color = '#827E61'
          }
          order_status.textContent = statusData.status_name
          orderStatusBox.appendChild(order_status)

          const cancel_order = document.createElement('a')
          cancel_order.className = orders.cancel_order
          cancel_order.textContent = 'Cancel The Order'
          orderBox_body_col2.appendChild(cancel_order)
        })
      }
    }

    renderData()
    return () => {
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
            <h3>{spending.toLocaleString()}&#8363;</h3>
          </div>
        </div>
        <div className={orders.container}>
          <div className={orders.order_features}>
            <div className={orders.order_features_row1}>
              <button id={orders.active}>Orders</button>
              <button>Not Yet Shipped</button>
              <button>Cancelled Orders</button>
            </div>
            <div className={orders.order_features_row2}>
              <div className={orders.sort_orders}>
                <button>All</button>
                <span className="material-symbols-outlined">
                  keyboard_arrow_down
                </span>
              </div>
            </div>
          </div>
          <div className={orders.content}>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;