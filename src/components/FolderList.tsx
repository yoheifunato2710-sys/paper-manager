import type { Folder } from '../types'

interface FolderListProps {
  folders: Folder[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function FolderList({ folders, selectedId, onSelect, onDelete }: FolderListProps) {
  const sorted = [...folders].sort((a, b) => a.order - b.order)

  return (
    <ul className="folder-list">
      {sorted.map((f) => (
        <li
          key={f.id}
          className={`folder-item ${selectedId === f.id ? 'selected' : ''}`}
          onClick={() => onSelect(f.id)}
        >
          <span>{f.name}</span>
          <button
            type="button"
            className="btn-delete"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(f.id)
            }}
            title="フォルダを削除"
          >
            削除
          </button>
        </li>
      ))}
    </ul>
  )
}
