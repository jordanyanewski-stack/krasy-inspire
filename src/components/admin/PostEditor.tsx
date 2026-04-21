'use client'

import { useState, useRef } from 'react'
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
      router.refresh()
      router.push('/admin/posts')
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
      router.refresh()
      router.push('/admin/posts')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div style={{ maxWidth: 1060, margin: '0 auto' }}>
      {/* Header */}
      <div className="a-page-head" style={{ marginBottom: '1.5rem' }}>
        <div>
          <p className="a-eyebrow" style={{ marginBottom: '0.4rem' }}>
            {mode === 'create' ? 'Ново' : 'Редакция'}
          </p>
          <h1 className="a-page-title" style={{ fontSize: '1.75rem' }}>
            {mode === 'create' ? 'Нова публикация' : form.title || 'Редактирай публикация'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {mode === 'edit' && (
            <button onClick={handleDelete} disabled={deleting} className="a-btn a-btn--danger">
              {deleting ? 'Изтриване…' : 'Изтрий'}
            </button>
          )}
          <button onClick={() => setPreview(!preview)} className="a-btn a-btn--ghost">
            {preview ? '✎ Редактор' : '◉ Преглед'}
          </button>
          <button onClick={handleSave} disabled={saving} className="a-btn a-btn--primary">
            {saving ? 'Запазване…' : 'Запази'}
          </button>
        </div>
      </div>

      {error && (
        <div className="a-alert a-alert--danger" style={{ marginBottom: '1rem' }}>
          <span>⚠</span> {error}
        </div>
      )}

      <div className="a-editor-grid">
        {/* Main editor */}
        <div className="a-editor-main">
          {/* Title */}
          <div className="a-card" style={{ padding: '0.4rem 0.6rem' }}>
            <input
              type="text"
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Заглавие на публикацията…"
              className="a-input a-input--title"
            />
          </div>

          {/* Content editor */}
          <div className="a-card-flush">
            {!preview && (
              <div className="a-toolbar">
                {TOOLBAR.map(action => (
                  <button
                    key={action.label}
                    title={action.title}
                    type="button"
                    onClick={() => applyToolbar(action)}
                    className="a-toolbar__btn"
                  >
                    {action.label}
                  </button>
                ))}
                <span className="a-toolbar__sep" />
                <button
                  type="button"
                  title="Вмъкни снимка"
                  onClick={() => imgInputRef.current?.click()}
                  disabled={uploadingImg}
                  className="a-toolbar__btn"
                >
                  {uploadingImg ? '…' : '🖼 Снимка'}
                </button>
                <button
                  type="button"
                  title="Вмъкни видео"
                  onClick={() => setShowVideoModal(true)}
                  className="a-toolbar__btn"
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
                className="a-preview"
                dangerouslySetInnerHTML={{ __html: markdownToHtmlPreview(form.content) }}
              />
            ) : (
              <textarea
                ref={textareaRef}
                value={form.content}
                onChange={e => set('content', e.target.value)}
                placeholder="Пиши тук на Markdown…"
                className="a-textarea a-textarea--code"
                style={{ minHeight: 480 }}
                spellCheck={false}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="a-editor-aside">
          {/* Status */}
          <div className="a-card">
            <label className="a-label">Статус</label>
            <div className="a-segment">
              {[{ v: true, l: 'Публикувана' }, { v: false, l: 'Чернова' }].map(opt => (
                <button
                  key={String(opt.v)}
                  type="button"
                  onClick={() => set('published', opt.v)}
                  className={`a-segment__btn${form.published === opt.v ? ' is-active' : ''}`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div className="a-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            <div>
              <label className="a-label">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => { setSlugManual(true); set('slug', e.target.value) }}
                placeholder="moya-publikaciya"
                className="a-input"
                style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label className="a-label">Дата</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="a-input" />
            </div>
            <div>
              <label className="a-label">Категория</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="a-select">
                <option value="">— без категория —</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div className="a-card">
            <label className="a-label">Извадка</label>
            <textarea
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="Кратко описание за списъка…"
              rows={3}
              className="a-textarea"
            />
          </div>

          {/* Cover image */}
          <div className="a-card">
            <label className="a-label">Корица</label>
            {form.coverImage && (
              <div className="a-cover-preview">
                <img src={form.coverImage} alt="Корица" />
                <button
                  type="button"
                  onClick={() => set('coverImage', '')}
                  className="a-cover-remove"
                  aria-label="Премахни"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="text"
              value={form.coverImage}
              onChange={e => set('coverImage', e.target.value)}
              placeholder="URL или качи…"
              className="a-input"
              style={{ marginBottom: '0.6rem' }}
            />
            <button
              type="button"
              disabled={uploadingImg}
              onClick={() => coverImgRef.current?.click()}
              className="a-dropzone"
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
          <div className="a-card">
            <label className="a-label">Акцентен цвят</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="color"
                value={form.coverColor}
                onChange={e => set('coverColor', e.target.value)}
                className="a-color-native"
              />
              <div style={{ flex: 1, display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['#f7e8e8', '#e8c4c4', '#e8e0f0', '#c9b8e8', '#d4e8d8', '#d8ecf0', '#b8935a'].map(c => (
                  <button
                    key={c}
                    type="button"
                    title={c}
                    onClick={() => set('coverColor', c)}
                    className={`a-swatch${form.coverColor === c ? ' is-active' : ''}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom save */}
      <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
        {mode === 'edit' && (
          <a href={`/journal/${initial?.slug}`} target="_blank" className="a-btn a-btn--ghost">
            Виж публикацията ↗
          </a>
        )}
        <button onClick={handleSave} disabled={saving} className="a-btn a-btn--primary a-btn--lg">
          {saving ? 'Запазване…' : mode === 'create' ? 'Публикувай' : 'Запази промените'}
        </button>
      </div>

      {/* Video modal */}
      {showVideoModal && (
        <div className="a-modal-scrim" onClick={() => setShowVideoModal(false)}>
          <div className="a-modal" onClick={e => e.stopPropagation()}>
            <p className="a-eyebrow" style={{ marginBottom: '0.35rem' }}>Медия</p>
            <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.4rem', marginBottom: '1.1rem', color: 'var(--a-text)' }}>
              Вмъкни видео
            </h3>
            <label className="a-label">YouTube URL или embed линк</label>
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="a-input"
              style={{ marginBottom: '1.25rem' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => { setShowVideoModal(false); setVideoUrl('') }}
                className="a-btn a-btn--ghost"
              >
                Отказ
              </button>
              <button
                type="button"
                onClick={insertYoutube}
                className="a-btn a-btn--primary"
              >
                Вмъкни
              </button>
            </div>
          </div>
        </div>
      )}
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
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (line) => line.startsWith('<') ? line : `<p>${line}</p>`)
}
