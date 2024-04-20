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