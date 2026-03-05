import type { Paper } from '../types'

interface PaperListProps {
  papers: Paper[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function PaperList({ papers, selectedId, onSelect, onDelete }: PaperListProps) {
  const sorted = [...papers].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <ul className="paper-list">
      {sorted.map((p) => (
        <li
          key={p.id}
          className={`paper-item ${selectedId === p.id ? 'selected' : ''}`}
          onClick={() => onSelect(p.id)}
        >
          <div className="title-wrap">
            <span className="title">{p.englishTitle || p.japaneseTitle || '（タイトルなし）'}</span>
            {p.japaneseTitle && p.englishTitle && (
              <span className="japanese-title">{p.japaneseTitle}</span>
            )}
          </div>
          <button
            type="button"
            className="btn-delete"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(p.id)
            }}
            title="論文を削除"
          >
            削除
          </button>
        </li>
      ))}
    </ul>
  )
}
