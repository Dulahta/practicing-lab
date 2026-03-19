import ProductCard from "@/components/productCard/productCard";
import classes from "./page.module.css";
import { getNewProducts, getPromoProducts } from "@/lib/getProducts";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className={classes.main}>
      <div className={classes.hero}>
        <h1 className={classes.title}>Welcome to our product store!</h1>
        <p className={classes.subtitle}>Discover our latest products and exclusive promotions.</p>
      </div>

      <section className={classes.section}>
        <div className={classes.sectionHeader}>
          <h2 className={classes.sectionTitle}>New Products</h2>
          <Link href="/products/new" className={classes.viewAll}>View all →</Link>
        </div>
        <ul className={classes.productGrid}>
          {getNewProducts().slice(0, 3).map(product => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      <section className={classes.section}>
        <div className={classes.sectionHeader}>
          <h2 className={classes.sectionTitle}>Promotional Products</h2>
          <Link href="/products/promo" className={classes.viewAll}>View all →</Link>
        </div>
        <ul className={classes.productGrid}>
          {getPromoProducts().slice(0, 3).map(product => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
