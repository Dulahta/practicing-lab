'use client'

import { Product } from '@/types/product'
import styles from './productCard.module.css'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  product: Product,
  isDisplayed?: boolean
}

export default function ProductCard({ product, isDisplayed }: ProductCardProps) {
  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={product.name}
          width={150}
          height={150}
          className={styles.image}
          loading='eager'
        />
        
        <div className={styles.badges}>
          {product.isNew && <span className={styles.badgeNew}>New</span>}
          {product.isPromo && (
            <span className={styles.badgePromo}>
              -{discountPercentage}%
            </span>
          )}
        </div>

        { !isDisplayed && <Link href={`/products/${product.id}`} className={styles.displayButton}>
           View product
        </Link>
        }
      </div>

      <div className={styles.content}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        
        <p className={styles.description}>{product.description}</p>

        <div className={styles.rating}>
          <span className={styles.stars}>★ {product.rating}</span>
        </div>

        <div className={styles.priceSection}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          {product.oldPrice && (
            <span className={styles.oldPrice}>${product.oldPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
