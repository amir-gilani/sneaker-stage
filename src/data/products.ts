export interface Product {
  id: string
  name: string
  /** Hero background colour for this colourway. */
  bg: string
  /** Laces / sole detail colour. */
  accent: string
  /** Main body colour of the shoe illustration. */
  body: string
  /** Secondary panel colour of the shoe illustration. */
  panel: string
  price: string
  description: string
}

export const products: Product[] = [
  {
    id: 'volt-green',
    name: 'Volt Green',
    bg: '#b7e04a',
    accent: '#2f3b12',
    body: '#f4f6ee',
    panel: '#d9e77f',
    price: '$178.00',
    description:
      'The Air Max 90 DNA reworked for now: brand-new Nike Air cushioning under a bold silhouette built for all-day comfort.',
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    bg: '#5b9ee6',
    accent: '#14315c',
    body: '#f2f6fb',
    panel: '#a9cdf4',
    price: '$182.00',
    description:
      'A durable mesh upper paired with a compact midsole keeps you locked in and stable through every quick change of direction.',
  },
  {
    id: 'graphite',
    name: 'Graphite',
    bg: '#9096a0',
    accent: '#2b2f36',
    body: '#f5f5f6',
    panel: '#c3c8d1',
    price: '$169.00',
    description:
      'A neutral colorway built for everyday wear, with a lightweight structure and flexible support that moves with you.',
  },
]

export const sizes = ['8', '9', '10', '11', '12.5'] as const
