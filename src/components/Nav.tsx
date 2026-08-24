import '../styles/nav.css'

const links = ['Products', 'About', 'Category', 'Contact']

export default function Nav() {
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
          <a key={l} href="#" className={l === 'Products' ? 'is-current' : undefined}>
            {l}
          </a>
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
        <button type="button" className="icon-btn icon-btn--cart" aria-label="Cart, 1 item">
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
          <span className="icon-btn__dot" />
        </button>
      </div>
    </header>
  )
}
