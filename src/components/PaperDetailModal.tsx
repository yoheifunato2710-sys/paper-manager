import { PaperDetail } from './PaperDetail'
import type { Paper } from '../types'

interface PaperDetailModalProps {
  paper: Paper
  onClose: () => void
}

export function PaperDetailModal({ paper, onClose }: PaperDetailModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-paper-detail" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{paper.englishTitle || paper.japaneseTitle || '論文詳細'}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            閉じる
          </button>
        </div>
        <div className="modal-body modal-body-scroll">
          <PaperDetail paper={paper} />
        </div>
      </div>
    </div>
  )
}
