export interface Product {
  id: string
  name: string
  /** Hero background colour for this colourway. */
  bg: string
  /** Laces / sole detail colour. */
  accent: string
  /** CSS filter that recolours the base product shot for this colourway. */
  tint: string
  price: string
  description: string
}

export const products: Product[] = [
  {
    id: 'volt-green',
    name: 'Volt Green',
    bg: '#b7e04a',
    accent: '#2f3b12',
    tint: 'hue-rotate(-108deg) saturate(2.6)',
    price: '$178.00',
    description:
      'The Air Max 90 DNA reworked for now: brand-new Nike Air cushioning under a bold silhouette built for all-day comfort.',
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    bg: '#5b9ee6',
    accent: '#14315c',
    tint: 'hue-rotate(8deg) saturate(1.45)',
    price: '$182.00',
    description:
      'A durable mesh upper paired with a compact midsole keeps you locked in and stable through every quick change of direction.',
  },
  {
    id: 'graphite',
    name: 'Graphite',
    bg: '#9096a0',
    accent: '#2b2f36',
    tint: 'saturate(0.16) brightness(0.99)',
    price: '$169.00',
    description:
      'A neutral colorway built for everyday wear, with a lightweight structure and flexible support that moves with you.',
  },
  {
    id: 'ember-orange',
    name: 'Ember Orange',
    bg: '#ef7444',
    accent: '#5a1c0b',
    // the base shot sits around 210deg, which is how Volt Green lands on 102
    // with -108; +158 carries the same hue the long way round to a warm 8
    tint: 'hue-rotate(158deg) saturate(1.7)',
    price: '$186.00',
    description:
      'A warm-weather take on the silhouette, with a breathable upper and the same Air unit tuned for long days on hard ground.',
  },
  {
    id: 'iris-purple',
    name: 'Iris Purple',
    bg: '#9a7bef',
    accent: '#2b1a63',
    // +62 off the base 210deg lands on 272 — far enough from Ocean Blue that
    // the two never read as the same shoe a shade apart
    tint: 'hue-rotate(62deg) saturate(1.5)',
    price: '$174.00',
    description:
      'A cleaner build with a suede-trimmed upper, cut low at the collar so it sits close and moves easily off the court.',
  },
]

export const sizes = ['9', '10', '11'] as const
