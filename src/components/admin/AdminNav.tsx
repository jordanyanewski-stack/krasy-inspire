'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/admin', label: 'Начало', icon: '⬡' },
  { href: '/admin/posts', label: 'Публикации', icon: '✦' },
  { href: '/admin/posts/new', label: 'Нова публикация', icon: '+' },
  { href: '/admin/categories', label: 'Категории', icon: '◈' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  async function logout() {
    setLoggingOut(true)
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const brand = (
    <div className="a-aside__brand">
      <div className="a-aside__mark">✦</div>
      <p className="a-aside__eyebrow">Krasy Inspire</p>
      <p className="a-aside__title">Администрация</p>
    </div>
  )

  const nav = (
    <nav className="a-aside__nav">
      {links.map(link => {
        const active = link.href === '/admin'
          ? pathname === '/admin'
          : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={`a-nav-link${active ? ' is-active' : ''}`}
          >
            <span className="a-nav-link__icon">{link.icon}</span>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )

  const foot = (
    <div className="a-aside__foot">
      <Link href="/" target="_blank" className="a-aside__view">
        <span>↗</span> Към сайта
      </Link>
      <button
        onClick={logout}
        disabled={loggingOut}
        className="a-btn a-btn--subtle a-btn--full a-btn--sm"
      >
        {loggingOut ? 'Излизане…' : 'Изход'}
      </button>
    </div>
  )

  return (
    <>
      <aside className="a-aside">
        {brand}
        {nav}
        {foot}
      </aside>

      <header className="a-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="a-aside__mark" style={{ width: 30, height: 30, marginBottom: 0, fontSize: '0.95rem' }}>✦</span>
          <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.05rem', color: 'var(--a-text)' }}>
            Администрация
          </p>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="a-topbar__btn"
          aria-label="Меню"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>

      {menuOpen && (
        <div className="a-drawer">
          <div className="a-drawer__overlay" onClick={() => setMenuOpen(false)} />
          <aside className="a-drawer__panel">
            {brand}
            {nav}
            {foot}
          </aside>
        </div>
      )}
    </>
  )
}
