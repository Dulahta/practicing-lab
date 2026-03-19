import ProductCard from "@/components/productCard/productCard";
import { getPromoProducts } from "@/lib/getProducts";

export default function PromoProductsPage() {
  return (
        <>
        <h2 style={{ textAlign: "center" }}>Promotional Products</h2>
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", padding: "20px" }}>
          {getPromoProducts().map(product => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
        </>
  )
}
