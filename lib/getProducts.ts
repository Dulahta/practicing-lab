import { products } from "@/data/products"

export const getNewProducts = () => {
    return products.filter(product => product.isNew)
}

export const getPromoProducts = () => {
    return products.filter(product => product.isPromo)
}

export const getProductById = (id: string) => {
    return products.find(product => product.id === id)
}

