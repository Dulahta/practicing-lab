import ProductCard from "@/components/productCard/productCard";
import { getPromoProducts } from "@/lib/getProducts";

export default async function PromoProductsPage() {
  const promoProducts = await getPromoProducts();

  return (
        <>
        <h2 style={{ textAlign: "center" }}>Promotional Products</h2>
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", padding: "20px" }}>
          {promoProducts.map(product => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
        </>
  )
}
