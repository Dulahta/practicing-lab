import { products } from "@/data/products"
import { Product } from "@/types/product"

export async function getNewProducts (): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return products.filter(product => product.isNew)
}

export async function getPromoProducts (): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return products.filter(product => product.isPromo)
}

export const getProductById = (id: string) => {
    return products.find(product => product.id === id)
}

