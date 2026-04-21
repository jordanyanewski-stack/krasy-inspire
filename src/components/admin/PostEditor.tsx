'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export type PostFormData = {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  coverColor: string
  coverImage: string
  content: string
  published: boolean
}

interface PostEditorProps {
  initial?: Partial<PostFormData>
  categories: { slug: string; name: string }[]
  mode: 'create' | 'edit'
}

const EMPTY: PostFormData = {
  slug: '',
  title: '',
  date: new Date().toISOString().slice(0, 10),
  category: '',
  excerpt: '',
  coverColor: '#e8c4c4',
  coverImage: '',
  content: '',
  published: true,
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

type ToolbarAction = {
  label: string
  title: string
  action: (text: string, selStart: number, selEnd: number) => { value: string; cursor: number }
}

const TOOLBAR: ToolbarAction[] = [
  {
    label: 'H2', title: 'Заглавие 2',
    action: (t, s, e) => {
      const sel = t.slice(s, e) || 'Заглавие'
      return { value: t.slice(0, s) + `## ${sel}` + t.slice(e), cursor: s + 3 + sel.length }
    },
  },
  {
    label: 'H3', title: 'Заглавие 3',
    action: (t, s, e) => {
      const sel = t.slice(s, e) || 'Заглавие'
      return { value: t.slice(0, s) + `### ${sel}` + t.slice(e), cursor: s + 4 + sel.length }
    },
  },
  {
    label: 'B', title: 'Удебелен',
    action: (t, s, e) => {
      const sel = t.slice(s, e) || 'текст'
      return { value: t.slice(0, s) + `**${sel}**` + t.slice(e), cursor: s + 2 + sel.length + 2 }
    },
  },
  {
    label: 'I', title: 'Курсив',
    action: (t, s, e) => {
      const sel = t.slice(s, e) || 'текст'
      return { value: t.slice(0, s) + `*${sel}*` + t.slice(e), cursor: s + 1 + sel.length + 1 }
    },
  },
  {
    label: '❝', title: 'Цитат',
    action: (t, s, e) => {
      const sel = t.slice(s, e) || 'цитат'
      return { value: t.slice(0, s) + `\n> ${sel}\n` + t.slice(e), cursor: s + 3 + sel.length + 1 }
    },
  },
  {
    label: '—', title: 'Разделител',
    action: (t, s) => ({ value: t.slice(0, s) + '\n\n---\n\n' + t.slice(s), cursor: s + 8 }),
  },
  {
    label: '• Списък', title: 'Списък',
    action: (t, s, e) => {
      const sel = t.slice(s, e) || 'елемент'
      return { value: t.slice(0, s) + `\n- ${sel}\n` + t.slice(e), cursor: s + 3 + sel.length + 1 }
    },
  },
  {
    label: '1. Списък', title: 'Номериран списък',
    action: (t, s, e) => {
      const sel = t.slice(s, e) || 'елемент'
      return { value: t.slice(0, s) + `\n1. ${sel}\n` + t.slice(e), cursor: s + 4 + sel.length + 1 }
    },
  },
  {
    label: '🔗 Линк', title: 'Линк',
    action: (t, s, e) => {
      const sel = t.slice(s, e) || 'текст'
      const inserted = `[${sel}](URL)`
      return { value: t.slice(0, s) + inserted + t.slice(e), cursor: s + sel.length + 3 }
    },
  },
]

export default function PostEditor({ initial, categories, mode }: PostEditorProps) {
  const router = useRouter()
  const [form, setForm] = useState<PostFormData>({ ...EMPTY, ...initial })
  const [slugManual, setSlugManual] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const imgInputRef = useRef<HTMLInputElement>(null)
  const coverImgRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof PostFormData>(key: K, value: PostFormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleTitleChange(val: string) {
    set('title', val)
    if (!slugManual) {
      set('slug', slugify(val))
    }
  }

  function applyToolbar(action: ToolbarAction) {
    const ta = textareaRef.current
    if (!ta) return
    const s = ta.selectionStart
    const e = ta.selectionEnd
    const result = action.action(form.content, s, e)
    set('content', result.value)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(result.cursor, result.cursor)
    }, 0)
  }

  async function uploadImage(file: File, forContent: boolean) {
    setUploadingImg(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (forContent) {
        const isVideo = file.type.startsWith('video/')
        const md = isVideo
          ? `\n<video src="${data.url}" controls style="max-width:100%"></video>\n`
          : `\n![${file.name}](${data.url})\n`
        const ta = textareaRef.current
        const pos = ta?.selectionStart ?? form.content.length
        set('content', form.content.slice(0, pos) + md + form.content.slice(pos))
      } else {
        set('coverImage', data.url)
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploadingImg(false)
    }
  }

  function insertYoutube() {
    const url = videoUrl.trim()
    if (!url) return
    let embedUrl = url
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/)
    if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`
    const html = `\n<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden">\n  <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allowfullscreen></iframe>\n</div>\n`
    const ta = textareaRef.current
    const pos = ta?.selectionStart ?? form.content.length
    set('content', form.content.slice(0, pos) + html + form.content.slice(pos))
    setVideoUrl('')
    setShowVideoModal(false)
  }

  async function handleSave() {
    setError('')
    if (!form.slug || !form.title || !form.date) {
      setError('Slug, заглавие и дата са задължителни')
      return
    }
    setSaving(true)
    try {
      const url = mode === 'edit'
        ? `/api/admin/posts/${initial?.slug}`
        : '/api/admin/posts'
      const method = mode === 'edit' ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/admin/posts')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Сигурна ли си, че искаш да изтриеш тази публикация?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/posts/${initial?.slug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Грешка при изтриване')
      router.push('/admin/posts')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 0.875rem',
    border: '1px solid #e0d8cc',
    borderRadius: '0.625rem',
    background: '#fff',
    color: 'var(--ink)',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'Lato, sans-serif',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--ink-soft)',
    marginBottom: '0.375rem',
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.5rem', color: 'var(--ink)', fontWeight: 400 }}>
          {mode === 'create' ? 'Нова публикация' : 'Редактирай публикация'}
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {mode === 'edit' && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{ padding: '0.6rem 1rem', background: '#fee2e2', border: 'none', borderRadius: '0.5rem', color: '#c0392b', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              {deleting ? 'Изтриване…' : 'Изтрий'}
            </button>
          )}
          <button
            onClick={() => setPreview(!preview)}
            style={{ padding: '0.6rem 1rem', background: '#f5f4f0', border: '1px solid #e0d8cc', borderRadius: '0.5rem', color: 'var(--ink-mid)', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            {preview ? 'Редактор' : 'Преглед'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '0.6rem 1.25rem', background: 'var(--ink)', border: 'none', borderRadius: '0.5rem', color: '#fdf8f2', fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.05em' }}
          >
            {saving ? 'Запазване…' : 'Запази'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#c0392b', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }} className="editor-grid">
        {/* Main editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Title */}
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e0d8cc' }}>
            <label style={labelStyle}>Заглавие</label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Заглавие на публикацията"
              style={{ ...inputStyle, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            />
          </div>

          {/* Content editor */}
          <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid #e0d8cc', overflow: 'hidden' }}>
            {/* Toolbar */}
            {!preview && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', padding: '0.625rem 0.875rem', borderBottom: '1px solid #f0ebe3', background: '#fdf8f2' }}>
                {TOOLBAR.map(action => (
                  <button
                    key={action.label}
                    title={action.title}
                    type="button"
                    onClick={() => applyToolbar(action)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'transparent',
                      border: '1px solid #e0d8cc',
                      borderRadius: '0.375rem',
                      color: 'var(--ink-mid)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontFamily: 'Lato, sans-serif',
                    }}
                  >
                    {action.label}
                  </button>
                ))}
                {/* Image insert */}
                <button
                  type="button"
                  title="Вмъкни снимка"
                  onClick={() => imgInputRef.current?.click()}
                  disabled={uploadingImg}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: uploadingImg ? '#e8e0f0' : 'transparent',
                    border: '1px solid #e0d8cc',
                    borderRadius: '0.375rem',
                    color: 'var(--ink-mid)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {uploadingImg ? '…' : '🖼 Снимка'}
                </button>
                {/* Video insert */}
                <button
                  type="button"
                  title="Вмъкни видео"
                  onClick={() => setShowVideoModal(true)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: 'transparent',
                    border: '1px solid #e0d8cc',
                    borderRadius: '0.375rem',
                    color: 'var(--ink-mid)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  ▶ Видео
                </button>
                <input
                  ref={imgInputRef}
                  type="file"
                  accept="image/*,video/mp4,video/webm"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) uploadImage(file, true)
                    e.target.value = ''
                  }}
                />
              </div>
            )}

            {preview ? (
              <div
                className="prose-krasy"
                style={{ padding: '1.25rem', minHeight: 300 }}
                dangerouslySetInnerHTML={{ __html: markdownToHtmlPreview(form.content) }}
              />
            ) : (
              <textarea
                ref={textareaRef}
                value={form.content}
                onChange={e => set('content', e.target.value)}
                placeholder="Пиши тук на Markdown…"
                style={{
                  width: '100%',
                  minHeight: 400,
                  padding: '1rem',
                  border: 'none',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  color: 'var(--ink)',
                  background: '#fff',
                }}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Publish */}
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e0d8cc' }}>
            <label style={labelStyle}>Статус</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[{ v: true, l: 'Публикувана' }, { v: false, l: 'Чернова' }].map(opt => (
                <button
                  key={String(opt.v)}
                  type="button"
                  onClick={() => set('published', opt.v)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid',
                    borderColor: form.published === opt.v ? 'var(--ink)' : '#e0d8cc',
                    borderRadius: '0.5rem',
                    background: form.published === opt.v ? 'var(--ink)' : '#fff',
                    color: form.published === opt.v ? '#fff' : 'var(--ink-mid)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e0d8cc', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label style={labelStyle}>Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => { setSlugManual(true); set('slug', e.target.value) }}
                placeholder="moya-publikaciya"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Дата</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Категория</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
                <option value="">— без категория —</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e0d8cc' }}>
            <label style={labelStyle}>Извадка (описание)</label>
            <textarea
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="Кратко описание за списъка…"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Cover image */}
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e0d8cc' }}>
            <label style={labelStyle}>Корица (снимка)</label>
            {form.coverImage && (
              <div style={{ marginBottom: '0.75rem', position: 'relative' }}>
                <img src={form.coverImage} alt="Корица" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: '0.5rem' }} />
                <button
                  type="button"
                  onClick={() => set('coverImage', '')}
                  style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: '0.7rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="text"
              value={form.coverImage}
              onChange={e => set('coverImage', e.target.value)}
              placeholder="URL или качи снимка"
              style={{ ...inputStyle, marginBottom: '0.5rem' }}
            />
            <button
              type="button"
              disabled={uploadingImg}
              onClick={() => coverImgRef.current?.click()}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#f5f4f0',
                border: '1px dashed #c9b8e8',
                borderRadius: '0.5rem',
                color: 'var(--ink-mid)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {uploadingImg ? 'Качване…' : '↑ Качи снимка'}
            </button>
            <input
              ref={coverImgRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) uploadImage(file, false)
                e.target.value = ''
              }}
            />
          </div>

          {/* Cover color */}
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e0d8cc' }}>
            <label style={labelStyle}>Акцентен цвят</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="color"
                value={form.coverColor}
                onChange={e => set('coverColor', e.target.value)}
                style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer', borderRadius: '0.375rem' }}
              />
              <div style={{ flex: 1, display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {['#f7e8e8', '#e8c4c4', '#e8e0f0', '#c9b8e8', '#d4e8d8', '#d8ecf0', '#b8935a'].map(c => (
                  <button
                    key={c}
                    type="button"
                    title={c}
                    onClick={() => set('coverColor', c)}
                    style={{
                      width: 20,
                      height: 20,
                      background: c,
                      border: form.coverColor === c ? '2px solid var(--ink)' : '1px solid #e0d8cc',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom save */}
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        {mode === 'edit' && (
          <a href={`/journal/${initial?.slug}`} target="_blank" style={{ padding: '0.75rem 1.25rem', border: '1px solid #e0d8cc', borderRadius: '0.75rem', color: 'var(--ink-mid)', textDecoration: 'none', fontSize: '0.85rem' }}>
            Виж публикацията ↗
          </a>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: '0.75rem 2rem', background: 'var(--ink)', border: 'none', borderRadius: '0.75rem', color: '#fdf8f2', fontSize: '0.875rem', cursor: 'pointer', letterSpacing: '0.05em' }}
        >
          {saving ? 'Запазване…' : mode === 'create' ? 'Публикувай' : 'Запази промените'}
        </button>
      </div>

      {/* Video modal */}
      {showVideoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: 480, margin: '1rem' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--ink)' }}>
              Вмъкни видео
            </h3>
            <label style={labelStyle}>YouTube URL или embed линк</label>
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{ ...inputStyle, marginBottom: '1rem' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => { setShowVideoModal(false); setVideoUrl('') }}
                style={{ padding: '0.6rem 1rem', background: '#f5f4f0', border: '1px solid #e0d8cc', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Отказ
              </button>
              <button
                type="button"
                onClick={insertYoutube}
                style={{ padding: '0.6rem 1.25rem', background: 'var(--ink)', border: 'none', borderRadius: '0.5rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Вмъкни
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 680px) {
          .editor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function markdownToHtmlPreview(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr />')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (line) => line.startsWith('<') ? line : `<p>${line}</p>`)
}
