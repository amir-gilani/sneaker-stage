import { useCallback, useRef, useState } from 'react'
import Nav from './components/Nav'
import ProductHero from './components/ProductHero'
import SneakerStage from './components/SneakerStage'
import type { Direction } from './components/SneakerStage'
import { products } from './data/products'
import type { CartLine } from './data/cart'
import { addLine } from './data/cart'
import './styles/app.css'

export default function App() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>(1)
  const [size, setSize] = useState('10')
  const [cart, setCart] = useState<CartLine[]>([])
  const animating = useRef(false)

  const goTo = useCallback(
    (target: number) => {
      if (animating.current || target === index) return
      const n = products.length
      const forward = (target - index + n) % n
      const backward = (index - target + n) % n
      animating.current = true
      setDirection(forward <= backward ? 1 : -1)
      setIndex(target)
    },
    [index],
  )

  const step = (delta: number) => goTo((index + delta + products.length) % products.length)

  const product = products[index]

  return (
    <div className="page" style={{ background: product.bg }}>
      <Nav
        cart={cart}
        onRemove={(key) => setCart((c) => c.filter((l) => l.key !== key))}
        onClear={() => setCart([])}
      />

      <main className="hero">
        <div className="hero__wordmark" aria-hidden="true">
          NIKE
        </div>

        <SneakerStage
          products={products}
          index={index}
          direction={direction}
          onTransitionEnd={() => {
            animating.current = false
          }}
        />

        <div className="hero__grid">
          <ProductHero
            product={product}
            products={products}
            index={index}
            size={size}
            onSize={setSize}
            onAdd={(qty) => setCart((c) => addLine(c, product, size, qty))}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        </div>
      </main>
    </div>
  )
}
