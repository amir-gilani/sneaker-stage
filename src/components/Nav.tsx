import { useEffect, useState } from 'react'
import type { CartLine } from '../data/cart'
import { cartCount, cartTotal, formatCents } from '../data/cart'
import '../styles/nav.css'

const links = ['Air Max', 'Jordan', 'Dunk', 'Running']

interface Props {
  cart: CartLine[]
  onRemove: (key: string) => void
  onClear: () => void
}

export default function Nav({ cart, onRemove, onClear }: Props) {
  const [current, setCurrent] = useState(links[0])
  const [open, setOpen] = useState(false)
  const count = cartCount(cart)

  // Escape closes the drawer; the overlay handles pointer dismissal
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="nav">
      <a className="nav__logo" href="#" aria-label="Nike home">
        <svg viewBox="0 3.6 69 25.2" aria-hidden="true">
          <path
            d="M68.56 4 18.4 25.36q-6.24 2.72-10.48 2.72-4.8 0-6.96-3.36Q-.32 22.64.16 19.76t2.72-6.24q1.6-2.4 5.36-6.24-1.6 2.56-2.24 5.28-.8 3.2.32 5.12 1.2 2.08 4.32 2.08 2.56 0 6-1.44z"
            fill="currentColor"
          />
        </svg>
      </a>

      <nav className="nav__links" aria-label="Categories">
        {links.map((l) => (
          <button
            key={l}
            type="button"
            className={l === current ? 'is-current' : undefined}
            aria-current={l === current ? 'page' : undefined}
            onClick={() => setCurrent(l)}
          >
            {l}
          </button>
        ))}
      </nav>

      <div className="nav__actions">
        <button type="button" className="icon-btn" aria-label="Wishlist">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 20.5 4.2 13a4.8 4.8 0 0 1 6.8-6.8l1 1 1-1A4.8 4.8 0 0 1 19.8 13Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="cart">
          <button
            type="button"
            className="icon-btn icon-btn--cart"
            aria-label={count === 0 ? 'Cart, empty' : `Cart, ${count} item${count === 1 ? '' : 's'}`}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 7h14l-1.2 12.2a1.8 1.8 0 0 1-1.8 1.6H8a1.8 1.8 0 0 1-1.8-1.6Z M9 9V6.2a3 3 0 1 1 6 0V9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            {count > 0 && <span className="icon-btn__count">{count}</span>}
          </button>

          {open && (
            <>
              <div className="cart__overlay" onClick={() => setOpen(false)} />

              <aside className="cart__drawer" role="dialog" aria-modal="true" aria-label="Bag">
                <header className="cart__head">
                  <h2 className="cart__title">Your bag</h2>
                  <button
                    type="button"
                    className="cart__close"
                    aria-label="Close bag"
                    onClick={() => setOpen(false)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </button>
                </header>

                {cart.length === 0 ? (
                  <p className="cart__empty">Your bag is empty.</p>
                ) : (
                  <ul className="cart__list">
                    {cart.map((l) => (
                      <li key={l.key} className="cart__line">
                        <span className="cart__name">
                          {l.name}
                          <span className="cart__size">US {l.size}</span>
                        </span>
                        <span className="cart__qty">×{l.qty}</span>
                        <span className="cart__price">{formatCents(l.qty * l.cents)}</span>
                        <button
                          type="button"
                          className="cart__remove"
                          aria-label={`Remove ${l.name}, size ${l.size}`}
                          onClick={() => onRemove(l.key)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="cart__foot">
                  <span className="cart__total-label">Total</span>
                  <span className="cart__total">{formatCents(cartTotal(cart))}</span>
                </div>

                <button type="button" className="cart__checkout">Checkout</button>

                <button
                  type="button"
                  className="cart__clear"
                  disabled={cart.length === 0}
                  onClick={onClear}
                >
                  Empty bag
                </button>
              </aside>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
