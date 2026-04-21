import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'Администрация · Krasy Inspire',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="admin-root"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  )
}
