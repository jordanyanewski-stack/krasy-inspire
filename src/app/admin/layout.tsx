import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Администрация · Krasy Inspire',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#f5f4f0',
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  )
}
