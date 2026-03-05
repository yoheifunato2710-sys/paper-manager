import { useState, useRef, useEffect } from 'react'

interface FolderNameModalProps {
  onConfirm: (name: string) => void
  onClose: () => void
}

export function FolderNameModal({ onConfirm, onClose }: FolderNameModalProps) {
  const [name, setName] = useState('新しいフォルダ')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) onConfirm(trimmed)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-folder-name" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2>フォルダ名を入力</h2>
            <button type="button" className="modal-close" onClick={onClose}>
              閉じる
            </button>
          </div>
          <div className="modal-body">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="folder-name-input"
              placeholder="フォルダ名"
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn-primary">
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
