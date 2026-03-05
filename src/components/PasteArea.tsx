import { useState, useRef, useEffect } from 'react'

interface PasteAreaProps {
  folderName: string
  folderId: string
  onPaste: (text: string, folderId: string) => void
  onClose: () => void
}

export function PasteArea({ folderName, folderId, onPaste, onClose }: PasteAreaProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed) {
      alert('文書を貼り付けてください。')
      return
    }
    onPaste(trimmed, folderId)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>文書を貼り付け — 「{folderName}」に追加</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            閉じる
          </button>
        </div>
        <div className="modal-body">
          <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#a0aec0' }}>
            下の欄に、Reference・Abstract・Methods・Results 等を含む文書をそのまま貼り付けてください。①～⑦を自動で抽出します。
          </p>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ここに文書を貼り付けてください..."
          />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            キャンセル
          </button>
          <button type="button" className="btn-primary" onClick={handleSubmit}>
            抽出して追加
          </button>
        </div>
      </div>
    </div>
  )
}
