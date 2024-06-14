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

