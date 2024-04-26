export const getAllProducts = async () => {
    const res = await fetch('http://localhost:3000/products')
    const data = await res.json()
    return data
}

export const getChosedVoucher = async () => {
    const res = await fetch('http://localhost:3000/vouchers/chosed')
    const data = await res.json()
    return data
}

export const getNewsApproved = async () => {
    const res = await fetch('http://localhost:3000/news')
    const data = await res.json()
    return data
}

export const getCarts= async () => {
    const res = await fetch('http://localhost:3000/cart')
    const data = await res.json()
    return data
}

export const getDetail = async (id) => {
    const res = await fetch(`http://localhost:3000/products/${id}`)
    const data = await res.json()
    return data
}

export const getProductsByCategoryId = async (id) => {
    const res = await fetch(`http://localhost:3000/products/category/${id}`)
    const data = await res.json()
    return data
}


export const product_pagination = async (page, limit) => {
    const res = await fetch(`http://localhost:3000/products/page/${page}/limit/${limit}`)
    const data = await res.json()
    return data
}