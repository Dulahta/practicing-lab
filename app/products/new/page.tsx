import ProductCard from "@/components/productCard/productCard";
import { getNewProducts } from "@/lib/getProducts";

export default function NewProductsPage() {
  return (
        <>
        <h2 style={{ textAlign: "center" }}>New Products</h2>
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", padding: "20px" }}>
          {getNewProducts().map(product => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
        </>
  )
}
