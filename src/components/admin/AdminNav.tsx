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

  const navItems = (
    <>
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>
          Krasy Inspire
        </p>
        <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.25rem', color: '#fff', fontWeight: 400 }}>
          Администрация
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {links.map(link => {
          const active = link.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                color: active ? '#fdf8f2' : 'rgba(255,255,255,0.55)',
                background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Link
          href="/"
          target="_blank"
          style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.75rem', textDecoration: 'none' }}
        >
          ↗ Към сайта
        </Link>
        <button
          onClick={logout}
          disabled={loggingOut}
          style={{
            width: '100%',
            padding: '0.6rem',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '0.5rem',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          {loggingOut ? 'Излизане…' : 'Изход'}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: 'var(--ink)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '2rem',
          minHeight: '100vh',
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
        }}
        className="hidden md:flex"
      >
        {navItems}
      </aside>

      {/* Mobile top bar */}
      <header
        style={{
          background: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
        className="md:hidden"
      >
        <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.1rem', color: '#fff' }}>
          Администрация
        </p>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            display: 'flex',
          }}
          className="md:hidden"
        >
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMenuOpen(false)}
          />
          <aside
            style={{
              position: 'relative',
              width: 240,
              background: 'var(--ink)',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '1.5rem',
              zIndex: 50,
            }}
          >
            {navItems}
          </aside>
        </div>
      )}
    </>
  )
}
