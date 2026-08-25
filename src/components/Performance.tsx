import { useEffect, useRef } from 'react'
import type { Product } from '../data/products'
import '../styles/performance.css'

interface Feature {
  tag: string
  title: string
  body: string
  icon: 'air' | 'mesh' | 'foam' | 'grip'
}

const features: Feature[] = [
  {
    tag: '01',
    icon: 'air',
    title: 'Nike Air Dn unit',
    body:
      'Four pressurised tubes sit under the heel and forefoot, so every step lands soft and springs back instead of flattening out.',
  },
  {
    tag: '02',
    icon: 'mesh',
    title: 'Engineered mesh upper',
    body:
      'Open weave over the toes for airflow, tighter weave through the midfoot where the laces pull — one panel, two jobs.',
  },
  {
    tag: '03',
    icon: 'foam',
    title: 'Dual-density midsole',
    body:
      'A firmer carrier holds the Air unit in place while a softer top layer takes the impact, keeping the ride stable at speed.',
  },
  {
    tag: '04',
    icon: 'grip',
    title: 'Waffle rubber outsole',
    body:
      'The classic waffle pattern, redrawn with deeper lugs at the toe-off point for grip on wet pavement.',
  },
]

const specs = [
  { label: 'Drop', value: '10 mm' },
  { label: 'Weight', value: '298 g' },
  { label: 'Cushion', value: 'Air Dn' },
  { label: 'Use', value: 'Everyday' },
]

function Icon({ name }: { name: Feature['icon'] }) {
  switch (name) {
    case 'air':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="7" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="14" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M19.5 8.6v6.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'mesh':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 8h16M4 12h16M4 16h16M8 4v16M12 4v16M16 4v16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
      )
    case 'foam':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 14c2.6-3 5.2-3 7.8 0s5.6 3 8.2-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M3 18.5c2.6-3 5.2-3 7.8 0s5.6 3 8.2-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8.5 8.5h.01M12 8.5h.01M15.5 8.5h.01M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )
  }
}

interface Props {
  product: Product
}

export default function Performance({ product }: Props) {
  const root = useRef<HTMLElement>(null)

  // reveal each block once it has cleared the fold — plain IntersectionObserver
  // so the panel rides the native scroll (wheel, trackpad, keys, touch alike)
  useEffect(() => {
    const el = root.current
    if (!el) return

    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((i) => i.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    )

    items.forEach((i) => io.observe(i))
    return () => io.disconnect()
  }, [])

  return (
    <section className="perf" ref={root} aria-labelledby="perf-title">
      <div className="perf__inner">
        <header className="perf__head" data-reveal>
          <p className="perf__eyebrow">
            <span className="perf__dot" style={{ background: product.accent }} aria-hidden="true" />
            Performance · {product.name}
          </p>
          <h2 className="perf__title" id="perf-title">
            Built to be
            <span className="perf__title-accent">felt, not noticed</span>
          </h2>
          <p className="perf__lede">
            Every part of the Air Max Dn SE earns its place. Here is what is actually doing the work
            once the shoe is on your foot.
          </p>
        </header>

        <ul className="perf__grid">
          {features.map((f, i) => (
            <li
              className="perf-card"
              key={f.tag}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span className="perf-card__icon" aria-hidden="true">
                <Icon name={f.icon} />
              </span>
              <span className="perf-card__tag">{f.tag}</span>
              <h3 className="perf-card__title">{f.title}</h3>
              <p className="perf-card__body">{f.body}</p>
            </li>
          ))}
        </ul>

        <dl className="perf__specs" data-reveal>
          {specs.map((s) => (
            <div className="perf__spec" key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
