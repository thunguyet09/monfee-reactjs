import React, { useState, useEffect } from 'react';
import orders from './Orders.module.css'
import { ascendingOrdersByTotal, descendingOrdersByTotal, changeOrderStatus, getCategoryDetail, getData, getDetail, getOrderStatusById, orderDetail, orderPagination } from '../../api';
const Orders = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [spending, setSpending] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [orderId, setOrderId] = useState(0)
  const [userId, setUserId] = useState('')
  const [activeOrder, setActiveOrder] = useState(0)
  const [sortValue, setSortValue] = useState(0)
  useEffect(() => {
    setIsMounted(true)

    getOrdersData('1', '2')
    return () => {
      setIsMounted(false)
    }
  }, [isMounted])

  const getOrdersData = async (page,limit) => {
    const userId = localStorage.getItem('userId')
    setUserId(userId)
    const orderData = await orderPagination(userId, page, limit)
    setTotalPages(orderData.totalPages)
    renderData(orderData.ordersData)
  }

  const getAPI = async(page, limit, orderData) => {
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const sliceOrderData = orderData.slice(startIndex, endIndex)
    renderData(sliceOrderData)
  }

  const renderData = async (orderData) => {
    const content = document.querySelector(`.${orders.content}`)
    content.innerHTML = ''
    if (isMounted) {
      if (orderData.length == 0) {
        content.innerHTML = `<div class='${orders.noOrder}'>You haven't placed any orders yet.</div>`
      }

      const ordersData = await getData('orders')
      const ordersDataFiltered = ordersData.filter((item) => item.user_id == userId && item.status !== 4)
      let total = 0
      ordersDataFiltered.forEach((item) => {
        total += item.total
      })
      setSpending(total)
      orderData.forEach(async (item) => {
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
        let orderDetailData = []
        if(item.order_id){
          orderDetailData = await orderDetail(item.order_id)
        }
        const mainOrderInfo = document.createElement('div')
        mainOrderInfo.className = orders.mainOrderInfo
        orderBox.appendChild(mainOrderInfo)
        if(orderDetailData.length > 0){
          orderDetailData.forEach(async (res) => {
            const detail = await getDetail(res.prod_id.toString())
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
        }

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
        if(item.status == 3){
          cancel_order.textContent = 'Buy Again'
        }else if(item.status == 4){
          cancel_order.style.color = 'grey'
          cancel_order.textContent = 'Cancelled'
          cancel_order.style.borderBottom = '1px solid grey'
        }else{
          cancel_order.textContent = 'Cancel The Order'
          cancel_order.addEventListener('click', () => {
            setOrderId(item.order_id)
            const cancelOrderModal = document.querySelector(`.${orders.cancelOrderModal}`)
            cancelOrderModal.style.display = 'block'
          })
        }
        orderBox_body_col2.appendChild(cancel_order)
      })
    }
  }
  const handlePagination = async (pageNumber) => {
    setPageNumber(pageNumber)

    const allOrders = await getData('orders')
    const ordersByUserId = allOrders.filter((item) => item.user_id == userId)
    if(activeOrder == 2){
      const nonShippedOrders = ordersByUserId.filter((item) => item.status == 0 || item.status == 1).reverse()
      getAPI(pageNumber, 2, nonShippedOrders)
    }else if(activeOrder == 1){
      getOrdersData(pageNumber, 2)
    }else if(activeOrder == 3){
      const canceledOrders = ordersByUserId.filter((item) => item.status == 4).reverse()
      getAPI(pageNumber, 2, canceledOrders)
    }

    if(sortValue == 2){
      const orders = await getAscendingOrdersByTotal()
      getAPI(pageNumber,2,orders.orders)
    }else if(sortValue == 3){
      const orders = await getDescendingOrdersByTotal()
      getAPI(pageNumber,2,orders.orders)
    }
  }

  const onActiveOrder = async (e) => {
    const order_features = document.querySelectorAll(`.${orders.order_features_row1} > button`)
    order_features.forEach((item) => {
      item.removeAttribute('id')
    })
    const target = e.target 
    target.setAttribute('id', `${orders.active}`)
    const allOrders = await getData('orders')
    const ordersByUserId = allOrders.filter((item) => item.user_id == userId)
    if(target.value == '2'){
      setActiveOrder(2)
      const nonShippedOrders = ordersByUserId.filter((item) => item.status == 0 || item.status == 1).reverse()
      const totalPages = Math.ceil(nonShippedOrders.length / 2)
      getAPI(1,2,nonShippedOrders.slice(0,2))
      setTotalPages(totalPages)
    }else if(target.value == '1'){
      getOrdersData('1', '2')
      setActiveOrder(1)
    }else if(target.value == '3'){
      setActiveOrder(3)
      const canceledOrders = ordersByUserId.filter((item) => item.status == 4).reverse()
      const totalPages = Math.ceil(canceledOrders.length / 2)
      getAPI(1,2,canceledOrders.slice(0,2))
      setTotalPages(totalPages)
    }
  }

  const closeModal = () => {
    const cancelOrderModal = document.querySelector(`.${orders.cancelOrderModal}`)
    cancelOrderModal.style.display = 'none'
  }

  const handleCancelOrder = async () => {
    await changeOrderStatus(orderId, '4')
    .then(() => {
      closeModal()
      getAPI(pageNumber, 2)
    })
  }

  let isOpen = false;
  const openSortBox = () => {
    const sortBox = document.querySelector(`.${orders.sort_box}`)
    isOpen = !isOpen;
    if(isOpen){
      sortBox.style.display = 'block'
    }else{
      sortBox.style.display = 'none'
    }
  }

  const getAscendingOrdersByTotal = async() => {
    const orders = await ascendingOrdersByTotal(userId,'1','2')
    return orders
  }

  const getDescendingOrdersByTotal = async() => {
    const orders = await descendingOrdersByTotal(userId,'1','2')
    return orders
  }
  
  const handleSort = async (e) => {
    const target = e.target 
    if(target.value == '2'){
      setSortValue(2)
      const orders = await getAscendingOrdersByTotal()
      renderData(orders.ordersData)
      setTotalPages(orders.totalPages)
    }else if(target.value == '3'){
      setSortValue(3)
      const orders = await getDescendingOrdersByTotal()
      renderData(orders.ordersData)
      setTotalPages(orders.totalPages)
    }else if(target.value == '4'){
      setSortValue(4)
      const orders = await getData('orders')
      const filteredOrders = orders.filter((item) => item.user_id == userId)
      const thisMonthOrders = filteredOrders.filter((item) => {
        const currentDate = new Date()
        const dateString = item.date
        const dateObject = new Date(dateString);
        const month = dateObject.getMonth() + 1;
        return month === currentDate.getMonth() + 1;
      })
      getAPI(1,2,thisMonthOrders)
      const totalPages = Math.ceil(thisMonthOrders.length / 2);
      setTotalPages(totalPages)
    }else if(target.value == '5'){
      setSortValue(5)
      const orders = await getData('orders')
      const filteredOrders = orders.filter((item) => item.user_id == userId)
      const lastMonthOrders = filteredOrders.filter((item) => {
        const currentDate = new Date()
        const dateString = item.date
        const dateObject = new Date(dateString);
        const month = dateObject.getMonth();
        return month === currentDate.getMonth() - 1;
      })
      getAPI(1,2,lastMonthOrders)
      const totalPages = Math.ceil(lastMonthOrders.length / 2);
      setTotalPages(totalPages)
    }else if(target.value == '6'){
      setSortValue(6)
      const orders = await getData('orders')
      const filteredOrders = orders.filter((item) => item.user_id == userId)
      const lastYearOrders = filteredOrders.filter((item) => {
        const currentDate = new Date()
        const dateString = item.date
        const dateObject = new Date(dateString);
        const year = dateObject.getFullYear();
        return year === currentDate.getFullYear() - 1;
      })
      getAPI(1,2,lastYearOrders)
      const totalPages = Math.ceil(lastYearOrders.length / 2);
      setTotalPages(totalPages)
    }
  }

  return (
    <>
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
              <button id={orders.active} onClick={(e) => onActiveOrder(e)} value="1">Orders</button>
              <button onClick={(e) => onActiveOrder(e)} value="2">Not Yet Shipped</button>
              <button onClick={(e) => onActiveOrder(e)} value="3">Cancelled Orders</button>
            </div>
            <div className={orders.order_features_row2}>
              <div className={orders.sort_orders} onClick={openSortBox}>
                <button>All</button>
                <span className="material-symbols-outlined">
                  keyboard_arrow_down
                </span>

                <div className={orders.sort_box}>
                  <ul>
                    <li>
                      <button onClick={(e) => handleSort(e)} value="1">All</button>
                    </li>
                    <li>
                      <button onClick={(e) => handleSort(e)} value="2">In ascending order: by price</button>
                    </li>
                    <li>
                      <button onClick={(e) => handleSort(e)} value="3">In descending order: by price</button>
                    </li>
                    <li>
                      <button onClick={(e) => handleSort(e)} value="4">This month's orders</button>
                    </li>
                    <li>
                      <button onClick={(e) => handleSort(e)} value="5">Last month's orders</button>
                    </li>
                    <li>
                      <button onClick={(e) => handleSort(e)} value="6">Last year's orders</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className={orders.content}>

          </div>
          <div className={orders.footer}>
            <div className={orders.pagination}>
                <button className={orders.prev_page}>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className={orders.pages}>
                  {[...Array(totalPages).keys()].map((page) => (
                    <button key={page + 1} className={orders.page_number} 
                    onClick={() => handlePagination(page + 1)}
                    id={`${pageNumber === page + 1 ? orders.active_page : ''}`}
                    >
                      {page + 1}
                    </button>
                  ))}
                </div>
                <button className={orders.next_page}>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id={orders.cancelOrderModal} className={orders.cancelOrderModal}>
      <div className={orders.modal_content}>
        <div className={orders.modal_title}>
           <h2>Cancel Order</h2>
           <span className={orders.closeBtn} onClick={closeModal}>&times;</span>
        </div>
        <div className={orders.cancel_order_confirm}>
          <p>Are you sure you want to cancel this order?</p>

          <div className={orders.btns}>
            <button className={orders.noBtn} onClick={closeModal}>NO, CANCEL</button>
            <button className={orders.yesBtn} onClick={handleCancelOrder}>YES, CONTINUE</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Orders;