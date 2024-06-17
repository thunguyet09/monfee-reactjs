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