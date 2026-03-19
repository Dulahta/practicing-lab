export type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    oldPrice?: number;
    isNew: boolean;
    isPromo: boolean;
    description: string;
    image: string;
    stock: number;
    rating: number;
}