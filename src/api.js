const url = 'http://localhost:3000/'
export const getData = async (val) => {
    if (val) {
        const res = await fetch(url + val)
        const data = await res.json()
        return data
    }
}

export const getOrderDetails = async (val) => {
    const res = await fetch(url + val)
    const data = await res.json()
    return data
}


export const getDetail = async (id) => {
    if (id) {
        const res = await fetch(`http://localhost:3000/products/${id}`)
        const data = await res.json()
        return data
    }
}

export const getOrderStatusById = async (id) => {
    if (id) {
        const res = await fetch(`http://localhost:3000/order-status/${id}`)
        const data = await res.json()
        return data
    }
}

export const getCategoryDetail = async (id) => {
    if (id) {
        const res = await fetch(`http://localhost:3000/categories/${id}`)
        const data = await res.json()
        return data
    }
}

export const getDetailVoucher = async (id) => {
    if (id) {
        const res = await fetch(`http://localhost:3000/vouchers/${id}`)
        const data = await res.json()
        return data
    }
}

export const getProductsByCategoryId = async (id) => {
    if (id) {
        const res = await fetch(`http://localhost:3000/products/category/${id}`)
        const data = await res.json()
        return data
    }
}


export const product_pagination = async (page, limit) => {
    if (page && limit) {
        const res = await fetch(`http://localhost:3000/products/${page}/${limit}`)
        const data = await res.json()
        return data
    }
}

export const getUser = async (id) => {
    if (id) {
        const res = await fetch(`http://localhost:3000/users/${id}`)
        const data = await res.json()
        return data
    }
}

export const updateUser = async (id, userData) => {
    if (id) {
        const res = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
    }
}

export const removeCart = async (val, id) => {
    const res = await fetch(url + `${val}/${id}`, {
        method: 'DELETE'
    })
    const data = await res.json()
    return data
}

export const orderDetail = async (id) => {
    if(id){
        const res = await fetch(`http://localhost:3000/order-details/${id}`)
        const data = await res.json()
        return data
    }
}

export const orderPagination = async (userId, page,limit) => {
    if(page && limit){
        const res = await fetch(`http://localhost:3000/orders/${userId}/${page}/${limit}`)
        const data = await res.json()
        return data
    }
}

export const orderNotShippedPagination = async (userId, page,limit) => {
    if(page && limit){
        const res = await fetch(`http://localhost:3000/orders/not-shipped/${userId}/${page}/${limit}`)
        const data = await res.json()
        return data
    }
}

export const ascendingOrdersByTotal = async (userId, page,limit) => {
    if(page && limit){
        const res = await fetch(`http://localhost:3000/orders/ascending/${userId}/${page}/${limit}`)
        const data = await res.json()
        return data
    }
}

export const descendingOrdersByTotal = async (userId, page,limit) => {
    if(page && limit){
        const res = await fetch(`http://localhost:3000/orders/descending/${userId}/${page}/${limit}`)
        const data = await res.json()
        return data
    }
}

export const insertNotifications = async (userId, notifications) => {
    if(userId && notifications){
        await fetch(`http://localhost:3000/users/notifications/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                notifications: notifications
            })
        })
        
    }
}

export const changeOrderStatus = async (orderId, statusData) => {
    if(orderId, statusData){
        await fetch(`http://localhost:3000/orders/status/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: statusData
            })
        })
    }
}

export const getUserByToken = async(token) => {
    if(token){
        const res = await fetch(`http://localhost:3000/users/token/${token}`)
        const data = await res.json()
        return data
    }
}

export const sendResetPasswordLink = async (info) => {
    if(info){
        await fetch(`http://localhost:3000/users/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(info)
        })
        
    }
}

export const comparePassword = async (userId, password) => {
    if(userId && password){
        return await fetch(`http://localhost:3000/users/compare-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: userId,
              password: password,
            }),
          }).then((res) => res.json());
    }
}
