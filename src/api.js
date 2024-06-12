const url = 'http://localhost:3000/'
export const getAllProducts = async (val) => {
    if(val){
        const res = await fetch(url + val)
        const data = await res.json()
        return data
    }
}

export const getChosedVoucher = async (val) => {
    if(val){
        const res = await fetch(url + val)
        const data = await res.json()
        return data
    }
}

export const getAllVouchers = async (val) => {
    if(val){
        const res = await fetch(url + val)
        const data = await res.json()
        return data
    }
}

export const getDetailVoucher = async (val) => {
    if(val){
        const res = await fetch(url + val)
        const data = await res.json()
        return data
    }
}

export const getNewsApproved = async (val) => {
    if(val){
        const res = await fetch(url + val)
        const data = await res.json()
        return data
    }
}

export const getCarts = async (val) => {
    if(val){
        const res = await fetch(url + val)
        const data = await res.json()
        return data
    }
}

export const getDetail = async (id) => {
    if(id){
        const res = await fetch(`http://localhost:3000/products/${id}`)
        const data = await res.json()
        return data
    }
}

export const getProductsByCategoryId = async (id) => {
    if(id){
        const res = await fetch(`http://localhost:3000/products/category/${id}`)
        const data = await res.json()
        return data
    }
}


export const product_pagination = async (page, limit) => {
   if(page && limit){
    const res = await fetch(`http://localhost:3000/products/${page}/${limit}`)
    const data = await res.json()
    return data
   }
}

export const getUser = async (id) => {
   if(id){
    const res = await fetch(`http://localhost:3000/users/${id}`)
    const data = await res.json()
    return data
   }
}

export const getOrders = async (val) => {
    const res = await fetch(url + val)
    const data = await res.json()
    return data
}

export const getOrderDetails = async (val) => {
    const res = await fetch(url + val)
    const data = await res.json()
    return data
}

export const removeCart = async (val, id) => {
    const res = await fetch(url + `${val}/${id}`, {
        method: 'DELETE'
    })
    const data = await res.json()
    return data
}




