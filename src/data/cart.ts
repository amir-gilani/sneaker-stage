import type { Product } from './products'

export interface CartLine {
  /** product id + size: one line per size of a colourway. */
  key: string
  productId: string
  name: string
  size: string
  qty: number
  /** Unit price in cents, so the total never drifts on floats. */
  cents: number
}

/** "$178.00" -> 17800 */
export const toCents = (price: string) => Math.round(Number(price.replace(/[^0-9.]/g, '')) * 100)

export const formatCents = (cents: number) =>
  `$${(cents / 100).toFixed(2)}`

export const addLine = (lines: CartLine[], product: Product, size: string, qty: number) => {
  const key = `${product.id}-${size}`
  const found = lines.find((l) => l.key === key)
  if (found) {
    return lines.map((l) => (l.key === key ? { ...l, qty: Math.min(9, l.qty + qty) } : l))
  }
  return [
    ...lines,
    { key, productId: product.id, name: product.name, size, qty, cents: toCents(product.price) },
  ]
}

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0)

export const cartTotal = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty * l.cents, 0)
