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
  onAdd: (qty: number) => void
  onPrev: () => void
  onNext: () => void
}

export default function ProductHero({
  product,
  products,
  index,
  size,
  onSize,
  onAdd,
  onPrev,
  onNext,
}: Props) {
  const [qty, setQty] = useState(1)

  return (
    <>
      <div className="copy">
        <p className="copy__eyebrow">Air Max Dn SE</p>

        <h1 className="copy__title">
          Step light,
          <span className="copy__title-accent">move loud</span>
        </h1>

        <p className="copy__lede">{product.description}</p>

        <div className="copy__meta">
          <span className="copy__price">{product.price}</span>
          <span className="copy__colour">
            <span className="copy__dot" style={{ background: product.accent }} aria-hidden="true" />
            {product.name}
          </span>
        </div>
      </div>

      <div className="picker">
        <p className="picker__label">Select size (US)</p>
        <div className="picker__sizes" role="group" aria-label="Select size">
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
        <ul className="social" aria-label="Follow Nike">
          <li>
            <a className="social__link" href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
              </svg>
            </a>
          </li>
          <li>
            <a className="social__link" href="#" aria-label="X">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 4h3.9l4.3 5.9L17.6 4H20l-6.6 7.6L20.4 20h-3.9l-4.6-6.3L5.9 20H3.5l7-8Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </li>
          <li>
            <a className="social__link" href="#" aria-label="YouTube">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2.6" y="5.4" width="18.8" height="13.2" rx="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="m10.4 9.4 4.7 2.6-4.7 2.6Z" fill="currentColor" />
              </svg>
            </a>
          </li>
        </ul>

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

          <button type="button" className="buy-now-btn" onClick={() => onAdd(qty)}>
            Buy Now
          </button>
        </div>
      </div>
    </>
  )
}
