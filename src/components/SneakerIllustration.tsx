interface Props {
  body: string
  panel: string
  accent: string
  className?: string
}

/**
 * Placeholder side-profile sneaker (toe left, heel right). Purely vector so
 * every colourway can be tinted from props — real product photography swaps
 * in later. Proportions follow a real lateral profile: low rounded toe, a
 * long vamp, a small tongue bump, the collar opening dipping behind it, and
 * the heel collar as the highest point of the shoe.
 */
export default function SneakerIllustration({ body, panel, accent, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 340"
      role="img"
      aria-label="Nike Jordan Series sneaker"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ---- upper ---- */}
      <path
        d="M48 250 C50 214 78 188 122 172 C186 149 254 158 300 150 C318 147 330 144 340 140
           C352 136 364 142 368 154 C374 172 386 178 400 172 C416 165 430 140 442 118
           C450 104 468 106 476 122 C492 154 506 200 516 248 Z"
        fill={body}
      />

      {/* toe cap */}
      <path
        d="M48 250 C50 216 72 192 112 176 C122 172 131 179 128 190 C118 214 112 232 110 250 Z"
        fill={panel}
      />

      {/* heel counter */}
      <path
        d="M476 122 C492 154 506 200 516 248 L474 248 C466 208 456 170 442 140 Z"
        fill={panel}
      />

      {/* tongue */}
      <path d="M326 138 C334 127 352 127 358 140 L370 162 C356 150 340 148 330 153 Z" fill={panel} />

      {/* collar opening */}
      <ellipse cx="406" cy="148" rx="44" ry="12" transform="rotate(-28 406 148)" fill={accent} />

      {/* laces */}
      <g stroke={accent} strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M212 186 C230 172 252 166 270 168" />
        <path d="M244 176 C262 162 284 156 302 158" />
        <path d="M276 166 C292 154 312 150 328 152" />
      </g>
      {/* eyestay seam */}
      <path
        d="M204 196 C232 176 268 166 320 160"
        stroke={accent}
        strokeWidth="3"
        fill="none"
        opacity="0.4"
      />

      {/* swoosh, sitting low on the side panel */}
      <path
        d="M120 232 C200 236 300 226 400 196 C420 190 428 204 410 212 C320 246 210 258 130 250
           C112 248 108 231 120 232 Z"
        fill={accent}
      />

      {/* heel pull tab */}
      <rect x="470" y="106" width="28" height="12" rx="6" fill={accent} opacity="0.9" />

      {/* shading where the upper meets the midsole */}
      <path d="M48 234 L516 234 L516 250 L48 250 Z" fill="#000" opacity="0.06" />

      {/* ---- midsole (wedge: thicker under the heel) ---- */}
      <path
        d="M36 252 C32 288 60 306 100 308 L510 308 C552 306 572 288 568 250 C566 240 556 236 542 236
           L52 240 C42 240 36 244 36 252 Z"
        fill="#ffffff"
      />

      {/* air unit */}
      <rect x="418" y="262" width="132" height="26" rx="13" fill={accent} opacity="0.2" />
      <g fill={accent} opacity="0.75">
        <circle cx="444" cy="275" r="8" />
        <circle cx="484" cy="275" r="8" />
        <circle cx="524" cy="275" r="8" />
      </g>

      {/* forefoot flex grooves */}
      <g stroke={accent} strokeWidth="3" opacity="0.3" strokeLinecap="round">
        <path d="M118 278 L118 298" />
        <path d="M158 276 L158 298" />
        <path d="M198 275 L198 298" />
      </g>

      {/* ---- outsole ---- */}
      <path
        d="M38 286 C50 304 78 313 106 314 L510 314 C544 312 566 301 570 286 L570 296
           C560 312 540 320 510 321 L104 321 C76 320 50 310 38 296 Z"
        fill={accent}
        opacity="0.6"
      />
    </svg>
  )
}
