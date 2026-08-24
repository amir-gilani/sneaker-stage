import { useState } from 'react'
import type { Product } from '../data/products'
import { sizes } from '../data/products'
import '../styles/hero.css'

interface Props {
  product: Product
  products: Product[]
  index: number
  size: string
  onSize: (s: string) => void
  onPrev: () => void
  onNext: () => void
}

export default function ProductHero({ product, products, index, size, onSize, onPrev, onNext }: Props) {
  const [qty, setQty] = useState(1)

  return (
    <>
      <div className="copy">
        <h1 className="copy__title">
          <span className="copy__title-line">Wear your</span>
          <span className="copy__title-line">Style with</span>
          <span className="copy__title-line">Comfort</span>
        </h1>
        <p className="copy__model">
          Nike Air Max Dn SE · {product.name} · {product.price}
        </p>
      </div>

      <div className="picker">
        <div className="picker__sizes">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              className={`size-btn${s === size ? ' is-active' : ''}`}
              aria-pressed={s === size}
              onClick={() => onSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="picker__note">{product.name} upper with Air cushioning</p>
      </div>

      <div className="controls">
        <div className="controls__text">
          <p className="controls__desc">{product.description}</p>
          <p className="controls__legal">© 2024 All rights reserved</p>
        </div>

        <div className="qty">
          <button
            type="button"
            className="qty__btn"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 12h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <span className="qty__value">{qty}</span>
          <button
            type="button"
            className="qty__btn"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(9, q + 1))}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 7v10M7 12h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="controls__side">
          <div className="controls__arrows">
            <button type="button" className="round-btn" aria-label="Previous colorway" onClick={onPrev}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.5 5 8 12l6.5 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="controls__count">
              {String(index + 1).padStart(2, '0')}/{String(products.length).padStart(2, '0')}
            </span>
            <button type="button" className="round-btn" aria-label="Next colorway" onClick={onNext}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9.5 5 16 12l-6.5 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <button type="button" className="buy-now-btn">Buy Now</button>
        </div>
      </div>
    </>
  )
}
