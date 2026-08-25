import type { CSSProperties } from 'react'
import sneaker from '../assets/sneaker.png'

interface Props {
  /** Colourway name, for the alt text. */
  name: string
  /** CSS filter that shifts the base photograph onto this colourway. */
  tint: string
  className?: string
}

/**
 * The product shot: one cut-out photograph (toe left, heel right) recoloured
 * per colourway with a CSS filter, so every slide shares the same lighting and
 * silhouette. The source is cropped tight to the shoe and stored at 1152px
 * wide — twice the widest layout size, so it never has to be scaled up on a
 * high-DPI screen. The tint
 * rides a custom property so the stylesheet can chain the drop shadow after it.
 */
export default function SneakerPhoto({ name, tint, className }: Props) {
  return (
    <img
      className={className}
      src={sneaker}
      alt={`Nike sneaker, ${name} colourway`}
      style={{ '--tint': tint } as CSSProperties}
      draggable={false}
      decoding="async"
    />
  )
}
