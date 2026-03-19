import ProductCard from '@/components/productCard/productCard';
import { getProductById } from '@/lib/getProducts'

export default async function ProductDetailPage({params}: {params: Promise<{id: string}>}) {
    const { id } = await params;
    const product = getProductById(id);

  return (
    <div  style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h2 style={{ textAlign: "center" }}>Product Detail</h2>
        <ProductCard product={product!} isDisplayed={true} />
        
    </div>
  )
}
